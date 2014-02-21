<?php
/**
 * Carrington Build Loop Module (Modified by UD)
 *
 * @version 0.1
 * @author potanin@UD
 */

if( !class_exists( 'FestivalLoopModule' ) ) {

  class FestivalLoopModule extends cfct_build_module {
    const POST_TYPES_FILTER     = 'cfct-module-loop-post-types';
    const TAXONOMY_TYPES_FILTER = 'cfct-module-loop-taxonomy-types';

    protected $_deprecated_id = 'cfct-module-loop'; // deprecated property, not needed for new module development

    protected $default_display_args = array(
      'caller_get_posts' => 1
    );

    protected $default_content_display = 'title';
    protected $default_show_title = 'yes';
    protected $default_show_meta_header = 'yes';
    protected $default_show_meta_footer = 'yes';
    protected $default_show_thumbnail = 'no';
    protected $default_show_post_content_type = 'post_excerpt';
    protected $default_item_count = 10;
    protected $default_item_offset = 0;
    protected $default_post_type = 'post';
    protected $default_relation = 'AND';
    protected $default_tax_select_text = '&mdash; Select taxonomy to filter &mdash;';
    protected $js_base;

    public function __construct() {
      $opts = array(
        'description' => __( 'Choose and display a set of posts (any post type) This is the UD Loop, a modified version of the regular Loop..', 'carrington-build' ),
        'icon'        => plugins_url( '/icon.png', __DIR__ )
      );
      parent::__construct( 'cfct-module-loop', __( 'Post Loop', 'carrington-build' ), $opts );
      $this->init();
    }

    protected function init() {
      // We need to enqueue the suggest script so we can use it later for type-ahead search
      $this->enqueue_scripts();
      // Taxonomy Filter Request Handler
      $this->register_ajax_handler( $this->id_base . '-get-new-taxonomy-block', array( $this, 'get_new_taxonomy_block' ) );
      add_action( 'wp_ajax_cf_taxonomy_filter_autocomplete', array( $this, 'taxonomy_filter_autocomplete' ) );
    }

# Data upgrade

    /**
     * Function to translate legacy loop save data in to "modern" loop save data.
     * This is not going to be standard practice. It was unavoidable in the 1.1 upgrade.
     *
     * @param array $data
     *
     * @return array
     */
    protected function migrate_data( $data ) {
      // post types used to be singular and stored as strings
      if( !is_array( $data[ $this->gfn( 'post_type' ) ] ) ) {
        $data[ $this->gfn( 'post_type' ) ] = (array) $data[ $this->gfn( 'post_type' ) ];
      }

      // tax_filter used to be the name, now its tax_input and stores much more data
      if( isset( $data[ $this->gfn( 'tax_filter' ) ] ) && !empty( $data[ $this->gfn( 'tax_filter' ) ] ) ) {
        $data[ $this->gfn( 'tax_input' ) ][ $data[ $this->gfn( 'taxonomy' ) ] ] = (array) $data[ $this->gfn( 'tax_filter' ) ];
        unset( $data[ $this->gfn( 'tax_filter' ) ], $data[ $this->gfn( 'taxonomy' ) ] );
      }

      return apply_filters( 'cfct-migrate-loop-data', $data, $this );
    }

# Admin Ajax

    /**
     * Type ahead search for tag like term completion
     *
     * @return string
     */
    public function taxonomy_filter_autocomplete() {
      $search = strip_tags( stripslashes( $_GET[ 'q' ] ) );
      $tax    = strip_tags( stripslashes( $_GET[ 'tax' ] ) );

      $items = array();
      if( !empty( $search ) ) {
        $terms = get_terms( $tax, array(
          'search' => $search
        ) );
        if( is_array( $terms ) ) {
          foreach( $terms as $term ) {
            $items[ ] = $term->name;
          }
        }
      }

      header( 'content-type: text/plain' );
      if( !empty( $items ) ) {
        echo implode( "\n", $items );
      } else {
        echo __( 'No Matching Taxonomies', 'carrington-build' );
      }
      exit;
    }

    /**
     * Return a taxonomy filter section for the admin-ui
     *
     * @param array $args
     *
     * @return object cfct_message
     */
    public function get_new_taxonomy_block( $args ) {
      $success = $html = false;

      $taxonomy = get_taxonomy( esc_attr( $args[ 'taxonomy' ] ) );
      if( !empty( $taxonomy ) || !is_wp_error( $taxonomy ) ) {
        $success = true;
        $html    = $this->get_taxonomy_filter_item( $taxonomy, array() );
      }

      return $this->ajax_response( $success, $html, 'get-new-taxonomy-block' );
    }

# Output

    /**
     * Display the module
     *
     * @param array $data - saved module data
     * @param array $args - previously set up arguments from a child class
     *
     * @return string HTML
     */
    public function display( $data ) {
      global $wp_query;
      $data = $this->migrate_data( $data );
      $args = $this->set_display_args( $data );
      /** Backup wp_query */
      $_wp_query = $wp_query;
      /** Now run our query */
      $wp_query = new WP_Query( $args );
      $wp_query->data = array(
        'template' => $data[ $this->get_field_name( 'template' ) ],
        'title' => $data[ $this->get_field_name( 'title' ) ],
        'content' => $data[ $this->get_field_name( 'content' ) ],
      );
      /** Get our template */
      ob_start();
      get_template_part( 'templates/aside/post-loop', $wp_query->data[ 'template' ] );
      /** Restore our wp_query */
      $wp_query = $_wp_query;
      /** Return our string */
      return ob_get_clean();
    }

    protected function set_display_args( $data ) {
      // Set default
      $args = $this->default_display_args;

      // Figure out post type or use default
      $post_type = $data[ $this->get_field_name( 'post_type' ) ];
      if( !empty( $post_type ) ) {
        $args[ 'post_type' ] = $post_type;
      }

      $tax_input = $this->get_data( 'tax_input', $data );
      if( !empty( $tax_input ) ) {
        $relation = $this->get_data( 'relation', $data, $this->default_relation );
        if( !empty( $relation ) ) {
          $args[ 'tax_query' ][ 'relation' ] = $relation;
        }
        foreach( $tax_input as $taxonomy => $terms ) {
          $taxonomy               = get_taxonomy( $taxonomy );
          $args[ 'tax_query' ][ ] = array(
            'taxonomy' => $taxonomy->name,
            'terms'    => $terms,
            'field'    => 'term_id'
          );
        }
      }

      // Filter by Author
      $args[ 'author' ] = !empty( $data[ $this->get_field_name( 'author' ) ] ) ? $data[ $this->get_field_name( 'author' ) ] : null;

      // Number of items
      $args[ 'posts_per_page' ] = intval( !empty( $data[ $this->get_field_name( 'item_count' ) ] ) ? $data[ $this->get_field_name( 'item_count' ) ] : $this->default_item_count );

      //** Do we show titles - potanin@UD */
      $args[ 'show_title' ] = isset( $data[ $this->get_field_name( 'show_title' ) ] ) ? $data[ $this->get_field_name( 'show_title' ) ] : $this->default_show_title;

      //** Do we show meta  - potanin@UD */
      $args[ 'show_meta_header' ] = isset( $data[ $this->get_field_name( 'show_meta_header' ) ] ) ? $data[ $this->get_field_name( 'show_meta_header' ) ] : $this->default_show_meta_header;

      //** Do we show entry utility  - potanin@UD */
      $args[ 'show_meta_footer' ] = isset( $data[ $this->get_field_name( 'show_meta_footer' ) ] ) ? $data[ $this->get_field_name( 'show_meta_footer' ) ] : $this->default_show_meta_footer;

      //** Do we show excerpt when in advanced mode - potanin@UD */
      $args[ 'show_thumbnail' ] = isset( $data[ $this->get_field_name( 'show_thumbnail' ) ] ) ? $data[ $this->get_field_name( 'show_thumbnail' ) ] : $this->default_show_thumbnail;

      //** Do we show full content when in advanced mode   - potanin@UD */
      $args[ 'show_post_content_type' ] = isset( $data[ $this->get_field_name( 'show_post_content_type' ) ] ) ? $data[ $this->get_field_name( 'show_post_content_type' ) ] : $this->default_show_post_content_type;

      // Item offset
      $args[ 'offset' ] = intval( isset( $data[ $this->get_field_name( 'item_offset' ) ] ) ? $data[ $this->get_field_name( 'item_offset' ) ] : $this->default_item_offset );

      // Don't include this post, otherwise we'll get an infinite loop
      global $post;
      $args[ 'post__not_in' ] = array( $post->ID );

      return $args;
    }


# Admin Form

    /**
     * Output the Admin Form
     *
     * @param array $data - saved module data
     *
     * @return string HTML
     */
    public function admin_form( $data ) {
      $data = $this->migrate_data( $data );
      
      $post_types = $this->get_post_types();
      $selected   = ( !empty( $data[ $this->gfn( 'post_type' ) ] ) ? $data[ $this->gfn( 'post_type' ) ] : array() );

      $_taxes = apply_filters( self::TAXONOMY_TYPES_FILTER, get_object_taxonomies( array_keys( $post_types ), 'objects' ), $this );
      foreach( $_taxes as $taxonomy ) {
        if( $taxonomy->name == 'post_format' ) {
          // its like a cockroach...
          continue;
        }
        $tax_defs[ $taxonomy->name ] = $taxonomy->label;
      }
      
      $post_type = ( $data[ $this->get_field_name( 'post_type' ) ] ) ? $data[ $this->get_field_name( 'post_type' ) ] : $this->default_post_type;
      $_taxes    = apply_filters( self::TAXONOMY_TYPES_FILTER, get_object_taxonomies( $post_type, 'objects' ), $this );

      foreach( $_taxes as $tax_type => $taxonomy ) {
        if( $tax_type == 'post_format' ) {
          continue;
        }
        if( !is_array( $post_type ) ) {
          $post_type = array( $post_type );
        }
        $matches = array_intersect( $post_type, $taxonomy->object_type );
        if( count( $matches ) == count( $post_type ) ) {
          $taxes[ $tax_type ] = $taxonomy;
        }
      }
      unset( $_taxes );
      
      $show_title             = isset( $data[ $this->id_base . '-show_title' ] ) ? $data[ $this->id_base . '-show_title' ] : $this->default_show_title;
      $show_meta_header       = isset( $data[ $this->id_base . '-show_meta_header' ] ) ? $data[ $this->id_base . '-show_meta_header' ] : $this->default_show_meta_header;
      $show_meta_footer       = isset( $data[ $this->id_base . '-show_meta_footer' ] ) ? $data[ $this->id_base . '-show_meta_footer' ] : $this->default_show_meta_footer;
      $show_thumbnail         = isset( $data[ $this->id_base . '-show_thumbnail' ] ) ? $data[ $this->id_base . '-show_thumbnail' ] : $this->default_show_thumbnail;
      $show_post_content_type = isset( $data[ $this->id_base . '-show_post_content_type' ] ) ? $data[ $this->id_base . '-show_post_content_type' ] : $this->default_show_post_content_type;
      
      $templates = array(
        'default' => __( 'Default', wp_festival( 'domain' ) ),
        'featured' => __( 'Featured', wp_festival( 'domain' ) ),
        'slider' => __( 'Slider', wp_festival( 'domain' ) ),
      );
      
      /** Now get and return the template */
      ob_start();
      require_once( __DIR__ . '/admin/form.php' );
      return ob_get_clean();
    }

    protected function get_post_type_taxonomies( $post_type ) {
      $taxonomies = get_object_taxonomies( $post_type );
      foreach( $taxonomies as $i => $t ) {
        if( $t == 'post_format' ) {
          // cockroach!
          unset( $taxonomies[ $i ] );
        }
      }

      return $taxonomies;
    }

    protected function get_filter_advanced_options( $data ) {
      $html = '
        <div id="' . $this->gfi( 'filter-advanced-options' ) . '">
          <p><a class="toggle ' . $this->gfi( 'advanced-filter-options-toggle' ) . '" id="advanced-filter-options-toggle" href="#' . $this->gfi( 'filter-advanced-options-container' ) . '">' .
        sprintf( __( '%sShow%s Advanced Options', 'carrington-build' ), '<span>', '</span>' ) . '</a></p>
          <div id="' . $this->gfi( 'filter-advanced-options-container' ) . '" style="display: none;">
            ' . $this->get_filter_relation_select( $data ) . '
          </div>
        </div>';

      return $html;
    }

    /**
     * Taxonomy query relation
     *
     * By default all queries are done with an AND operator, meaning that all taxonomies
     * selected must be part of the result. Change this to 'OR' and then all results must
     * match at least 1 of the selected taxonomies instead of all of them
     *
     * @param array $data
     *
     * @return void
     */
    protected function get_filter_relation_select( $data ) {
      $relations = apply_filters( $this->id_base . '-relation-options', array(
          'AND' => __( 'And - all taxonomies must be matched', 'carrington-build' ),
          'OR'  => __( 'Or - any taxonomy can be matched', 'carrington-build' )
        ) );

      $selected = $this->get_data( 'relation', $data, $this->default_relation );

      $html = '
        <div class="cfct-inline-els">
          <label for="' . $this->gfi( 'relation' ) . '">' . __( 'Filter Relation', 'carrington-build' ) . '</label>
          <select name="' . $this->gfn( 'relation' ) . '" id="' . $this->gfi( 'relation' ) . '">';
      foreach( $relations as $key => $relation ) {
        $html .= '
            <option value="' . $key . '"' . selected( $key, $selected, false ) . '>' . $relation . '</option>';
      }
      $html .= '
          </select>
        </div>';

      return $html;
    }

    protected function get_taxonomy_filter_items( $data ) {
      $html = '';

      if( !empty( $data[ $this->gfn( 'tax_input' ) ] ) ) {
        foreach( $data[ $this->gfn( 'tax_input' ) ] as $taxonomy => $tax_input ) {
          $html .= $this->get_taxonomy_filter_item( $taxonomy, $tax_input );
        }
      }

      $html .= '
        <li class="cfct-repeater-item no-items-item">
          <p>' . __( 'There are currently no taxonomy filters.', 'carrington-build' ) . '</p>
        </li>';

      return $html;
    }

    protected function get_taxonomy_filter_item( $taxonomy, $tax_input ) {
      if( !is_object( $taxonomy ) ) {
        $taxonomy = get_taxonomy( $taxonomy );
      }

      $html = '
        <li id="' . $this->id_base . '-tax-section-' . $taxonomy->name . '" class="' . $this->id_base . '-tax-section cfct-repeater-item" data-taxonomy="' . $taxonomy->name . '">';

      // Heirarchichal taxonomy checkbox interface
      if( $taxonomy->hierarchical ) {
        $html .= '
            <h2 class="cfct-title">' . $taxonomy->label . ':  </h2>';
        $html .= $this->get_taxonomy_selector( array(
          'taxonomy'      => $taxonomy,
          'selected_cats' => ( !empty( $tax_input ) ? $tax_input : array() ),
          'post_id'       => $this->get_post_id()
        ) );
      } // Tag type-ahead search input
      else {
        if( !empty( $tax_input ) ) {
          foreach( $tax_input as &$term ) {
            $_term = get_term( $term, $taxonomy->name );
            $term  = $_term->name;
          }
        }
        $html .= '
            <label class="cfct-title" for="' . $this->gfi( 'tax-filter-' . $tax_type ) . '">' . $taxonomy->label . '</label>

            <div class="cfct-tax-filter-type-ahead-wrapper">
              <span class="cfct-input-full">
                <input class="' . $this->id_base . '-tax-filter-type-ahead-search" name="tax_input[' . $taxonomy->name . ']" id="' . $this->gfi( 'tax-input-' . $tax_type ) . '" type="text" value="' . ( !empty( $tax_input ) ? implode( ', ', $tax_input ) : '' ) . '" />
              </span>
              <div class="cfct-help">' . __( 'Start typing to search for a term. Separate terms with commas. If a term is misspelled (ie: does not exist) it will be discarded during save.', 'carrington-build' ) . '</div>
            </div>';
      }
      $html .= '
          <div class="warning-text">
            <p>' . __( 'This taxonomy is incompatible with the current post-type selection and will be discarded upon save. Change the post-type selection to keep this filter.', 'carrington-build' ) . '</p>
          </div>
          <a href="#" class="cfct-repeater-item-remove">remove</a>
        </li>';

      return $html;
    }

    /**
     * Returns a dropdown for available taxonomies
     *
     * @param array $items array of taxonomy objects
     *
     * @return string
     */
    protected function get_taxonomy_dropdown( $items, $data ) {
      // Prepare our options
      $options = array();
      if( !empty( $items ) ) {
        foreach( $items as $k => $v ) {
          if( in_array( $key, array( 'link_category', 'nav_menu' ) ) ) {
            continue;
          }
          $options[ $k ] = $v->labels->name;
        }
      }

      $field_name = $this->get_field_name( 'taxonomy-' . $index );
      $value      = ( isset( $data[ $field_name ] ) ) ? $data[ $field_name ] : 0;

      $html = $this->dropdown(
        'taxonomy-select',
        $options,
        $value,
        array(
          'default'    => array(
            'value' => '',
            'text'  => __( $this->default_tax_select_text, 'carrington-build' ),
          ),
          'class_name' => 'taxonomy'
        )
      );

      return $html;
    }

    /**
     * Get a list of post types available for selection
     * Automatically excludes attachments, revisions, and nav_menu_items
     * Post Type must be public to appear in this list
     *
     * @param string $type - 'post' for non-heirarchal objects, 'page' or heirarchal objects
     *
     * @return array
     */
    protected function get_post_types( $type = false ) {
      $type_opts = array(
        'publicly_queryable' => 1
      );
      if( !empty( $type ) ) {
        if( is_array( $type ) ) {
          $hierarchical = true;
          if( ( count( $type ) == 1 ) && ( $type[ 0 ] == 'post' ) ) {
            $hierarchical = false;
          }
        } else {
          $hierarchical = ( $type == 'post' ? false : true );
        }
        $type_opts[ 'hierarchical' ] = $hierarchical;
      }
      $post_types = get_post_types( $type_opts, 'objects' );
      ksort( $post_types );

      // be safe, filter out the undesirables
      foreach( array( 'attachment', 'revision', 'nav_menu_item' ) as $item ) {
        if( !empty( $post_types[ $item ] ) ) {
          unset( $post_types[ $item ] );
        }
      }

      return apply_filters( self::POST_TYPES_FILTER, $post_types, $this );
    }

// Required

    /**
     * Don't contribute to the post_content stored in the database
     *
     * @return null
     */
    public function text( $data ) {
      return null;
    }

    public function admin_text( $data ) {
      return strip_tags( $data[ $this->get_field_name( 'title' ) ] );
    }

    public function update( $new_data, $old_data ) {
      // Set default for item count
      $count = $new_data[ $this->gfi( 'item_count' ) ];
      if( empty( $count ) && $count !== '0' ) {
        $new_data[ $this->gfi( 'item_count' ) ] = 10;
      }

      // Using wordpress constructs can give us a stand-alone post_category
      // input. Shoehorn it in to our own data structure for consistency
      if( !empty( $new_data[ 'post_category' ] ) ) {
        $new_data[ 'tax_input' ][ 'category' ] = $new_data[ 'post_category' ];
        unset( $new_data[ 'post_category' ] );
      }

      // Namespace the saved data & convert non-hierarchical term strings in to arrays
      if( !empty( $new_data[ 'tax_input' ] ) ) {
        foreach( $new_data[ 'tax_input' ] as $taxonomy => $tax_input ) {
          if( !is_array( $tax_input ) ) {
            $tax_input = array_filter( array_map( 'trim', explode( ',', $tax_input ) ) );
            foreach( $tax_input as &$tax_input_item ) {
              $term = get_term_by( 'name', $tax_input_item, $taxonomy );
              {
                if( !empty( $term ) && !is_wp_error( $term ) ) {
                  $tax_input_item = $term->term_id;
                }
              }
            }
          }
          $new_data[ $this->gfn( 'tax_input' ) ][ $taxonomy ] = $tax_input;
        }
        unset( $new_data[ 'tax_input' ] );
      }

      return $new_data;
    }

    public function admin_css() {
      return preg_replace( '/(\t){4}/m', '', '
        #' . $this->id_base . '-admin-form-wrapper li .warning-text {
          border: 1px solid #822c27;
          background-color: #990000;
          -moz-border-radius: 3px;
          -webkit-border-radius: 3px;
          -khtml-border-radius: 3px;
          border-radius: 3px;
          display: none;
          margin-bottom: 5px;
          padding: 6px;
        }
        #' . $this->id_base . '-admin-form-wrapper li .warning-text p {
          color: #fff;
          font-size: 11px;
          line-height: 15px;
          margin: 0;
        }
        #' . $this->id_base . '-admin-form-wrapper li.post-type-taxonomy-warning {
          background-color: #fcf2f2;
          color: #666;
        }
        #' . $this->id_base . '-admin-form-wrapper li.post-type-taxonomy-warning .cfct-input-full,
        #' . $this->id_base . '-admin-form-wrapper li.post-type-taxonomy-warning input[type=text] {
          background: #eee;
        }

        #' . $this->id_base . '-admin-form-wrapper li.post-type-taxonomy-warning .warning-text {
          display: block;
        }
        #' . $this->id_base . '-admin-form-wrapper .cfct-repeater-item input[type=text] {
          width: 616px
        }
        .' . $this->gfi( 'advanced-filter-options-toggle' ) . ' {
          font-size: .9em;
        }
      ' );
    }

    public function admin_js() {
      $this->js_base = str_replace( '-', '_', $this->id_base );

      return preg_replace( '/^(\t){4}/m', '', '
        cfct_builder.addModuleLoadCallback("' . $this->id_base . '", function(form) {

          ' . $this->js_base . '_get_selected_post_type_taxonomies = function() {
            var taxonomies = null;
            // merge available taxonomies from the chosen post types
            $(":input.post-type-select:checked, input[type=hidden].post-type-select").each(function() {
              var _taxes = $(this).attr("data-taxonomies").split(",");
              if (taxonomies == null) {
                taxonomies = _taxes;
              }
              else {
                taxonomies = cfct_array_intersect(taxonomies, _taxes);
              }
            })
            return taxonomies;
          }

          // do post-type selection change
          $("#' . $this->gfi( 'post_type_checks' ) . ' :input.post-type-select", form).change(function() {
            ' . $this->js_base . '_filter_taxonomy_select();
          });

          // add another taxonomy block
          $("#' . $this->id_base . '-add-tax-button").click(function() {
            var _this = $(this);
            var tax = $("#' . $this->id_base . '-taxonomy-select", form).val();
            if ( tax != "none") {
               ' . $this->js_base . '_set_loading();
              cfct_builder.fetch(
                "' . $this->id_base . '-get-new-taxonomy-block",
                {
                  taxonomy: tax,
                  post_types: $("#' . $this->id_base . '-post_type", form).val()
                },
                null,
                null,
                ' . $this->js_base . '_insert_taxonomy_block
              );
            }
            return false;
          });

          ' . $this->js_base . '_filter_taxonomy_select = function() {
            var taxonomies = ' . $this->js_base . '_get_selected_post_type_taxonomies();
            var tax_names = eval("(" + $("#' . $this->gfi( 'tax_defs' ) . '").val() + ")");
            var _tgt = $("#' . $this->id_base . '-taxonomy-select", form);
            var options = "";

            // create options for the taxonomoy select list
            if (taxonomies != null && taxonomies.length > 0) {
              options = "<option value=\"none\">' . __( $this->default_tax_select_text, 'carrington-build' ) . '</option>";
              for (i = 0; i < taxonomies.length; i++) {
                options += "<option value=\"" + taxonomies[i] + "\">" + tax_names[taxonomies[i]] + "</option>";
              }
            }
            else {
              options = "<option value=\"none\">' . __( 'no matching taxonomies available', 'carrington-build' ) . '</option>";
            }

            // assign new options to the taxonomy select list
            _tgt.html(options);
            ' . $this->js_base . '_prep_taxonomy_filter_list();
          }

          // generic repeater element remove button
          $(".cfct-module-admin-repeater-block .cfct-repeater-item .cfct-repeater-item-remove").live("click", function() {
            var _list = $(this).closest("ol");
            $(this).closest("li").remove();
            if (_list.find("li.cfct-repeater-item").size() == 1) {
              _list.addClass("no-items");
            }
            ' . $this->js_base . '_filter_taxonomy_select();
            return false;
          });

          // taxonomy filter selection callback
          ' . $this->js_base . '_insert_taxonomy_block = function(ret) {
            if (ret.success) {
              var _list = $("#' . $this->id_base . '-tax-filter-items ol", form);
              var _html = $(ret.html);
              _list.prepend(_html);

              // columnize
              _html.find("ul.categorychecklist").columnizeLists({ cols: 3 });

              // set no-items status
              if (_list.find("li.cfct-repeater-item").size() > 1) {
                _list.removeClass("no-items");
              }
              ' . $this->js_base . '_unset_loading();
              ' . $this->js_base . '_prep_taxonomy_filter_list();
            }
            else {
              // @TODO handle error
            }
          };

          // reset and prune the taxonomy filter list
          ' . $this->js_base . '_prep_taxonomy_filter_list = function() {
            // prune the taxonomy filter list of taxonomies that are already being displayed
            $("#' . $this->id_base . '-taxonomy-select", form)
              .val("")
              .find("option")
              .each(function() {
                var _this = $(this);
                if (_this.attr("data-taxonomy") == "") {
                  return;
                }

                if ( $("#' . $this->id_base . '-tax-filter-items li[data-taxonomy=" + _this.val() + "]").size() > 0 ) {
                  _this.remove();
                }
              });

            var taxonomies = ' . $this->js_base . '_get_selected_post_type_taxonomies();
            $("#' . $this->id_base . '-tax-filter-items ol li.cfct-repeater-item").not(".no-items-item").each(function() {
              var _this = $(this);
              var warning_class = "post-type-taxonomy-warning";

              if ($.inArray(_this.attr("data-taxonomy"), taxonomies) > -1) {
                _this.removeClass(warning_class).find(":input").attr("disabled", false); // apparently more consistent than removeAttr()
                ' . $this->js_base . '_bind_suggest(this);
              }
              else {
                _this.addClass(warning_class).find(":input").attr("disabled", "disabled");
                ' . $this->js_base . '_unbind_suggest(this);
              }
            });
          };

          ' . $this->js_base . '_set_loading = function() {
            $("#' . $this->gfi( 'tax-select-inputs' ) . ' span.' . $this->gfi( 'loading' ) . '").show();
          };

          ' . $this->js_base . '_unset_loading = function() {
            $("#' . $this->gfi( 'tax-select-inputs' ) . ' span.' . $this->gfi( 'loading' ) . '").hide();
          };

          ' . $this->js_base . '_bind_suggest = function(item) {
            var _parent = $(item);
            var e = _parent.find(".' . $this->id_base . '-tax-filter-type-ahead-search").unbind();

            // unattach any other suggests for this box
            $(".ac_results").remove();

            // hook our new suggest on there
            e.suggest(
              cfct_builder.opts.ajax_url + "?action=cf_taxonomy_filter_autocomplete&tax=" + encodeURI(_parent.attr("data-taxonomy")),
              {
                delay: 500,
                minchars: 2,
                multiple: true,
                onSelect: function() {
                  $(this).attr("value", $(this).val());
                }
              }
            );
            $(".ac_results").css({"z-index": "10005"});
          };

          ' . $this->js_base . '_unbind_suggest = function(item) {
            $(item).find(".' . $this->id_base . '-tax-filter-type-ahead-search").unbind().end().find(".ac_results").remove();
          }

          // Show/Hide for Pagination
          $("#' . $this->get_field_id( 'show_pagination' ) . '", form).change(function() {
            var _wrapper = $("#pagination-wrapper");
            if ($(this).is(":checked")) {
              _wrapper.show();
            }
            else {
              _wrapper.hide();
            }
          }).trigger("change");

          // columnize
          $("ul.categorychecklist", form).columnizeLists({ cols: 4 });

          // togglr
          $(".toggle", form).click(function() {
            var _tgt = $($(this).attr("href"));
            if (_tgt.is(":visible")) {
              $(this).find("span").text("' . __( 'Show', 'carrington-build' ) . '");
              _tgt.hide();
            }
            else {
              $(this).find("span").text("' . __( 'Hide', 'carrington-build' ) . '");
              _tgt.show();
            }
            return false;
          });

          // do initial taxonomy select filtering
          ' . $this->js_base . '_filter_taxonomy_select();
          ' . $this->js_base . '_prep_taxonomy_filter_list();
          $(".cfct-columnized-4x ul", form).columnizeLists({ cols: 4 });

        });

        cfct_builder.addModuleSaveCallback("' . $this->id_base . '",function(form) {
          // disable taxonomy filter dropdown so that it does not submit
          $("#' . $this->gfi( 'taxonomy-select' ) . '").attr("disabled", "disabled");
        });
      ' );
    }

# Helpers

    /**
     * Load required script
     *
     * @return void
     */
    protected function enqueue_scripts() {
      global $pagenow;
      if( is_admin() && in_array( $pagenow, array( 'post.php', 'edit.php' ) ) ) {
        wp_enqueue_script( 'suggest' );
      }
    }

    /**
     * Generates a simple dropdown
     *
     * @param string $field_name
     * @param array  $options
     * @param        int /string $value The current value of this field
     * @param array  $args Miscellaneous arguments
     *
     * @return string of <select> element's HTML
     **/
    protected function dropdown( $field_name, $options, $value = false, $args = '' ) {
      $defaults = array(
        'label'      => '', // The text for the label element
        'default'    => null, // Add a default option ('all', 'none', etc.)
        'excludes'   => array(), // values to exclude from options
        'class_name' => null // name to use in the class; defaults to $field_name
      );
      $args     = array_merge( $defaults, $args );
      extract( $args );

      $options = ( is_array( $options ) ) ? $options : array();

      // Set a label if there is one
      $html = ( !empty( $label ) ) ? '<label for="' . $this->gfi( $field_name ) . '">' . $label . ': </label>' : '';

      if( empty( $class_name ) ) {
        $class_name = $field_name;
      }
      // Start off the select element
      $html .= '
        <select class="' . $class_name . '-dropdown" name="' . $this->gfn( $field_name ) . ( $multi ? '[]' : '' ) . '" id="' . $this->gfi( $field_name ) . '"' . ( $multi ? ' multiple="multiple"' : '' ) . '>';

      // Set a default option that's not in the list of options (i.e., all, none)
      if( is_array( $default ) ) {
        $html .= '<option value="' . $default[ 'value' ] . '"' . selected( $default[ 'value' ], $value, false ) . '>' . esc_html( $default[ 'text' ] ) . '</option>';
      }

      // Loop through our options
      foreach( $options as $k => $v ) {
        if( !in_array( $k, $excludes ) ) {
          $selected = '';
          if( is_array( $value ) && in_array( $k, $value ) ) {
            // the selected() helper doesn't recognize arrays as potential values
            $selected = ' selected="selected"';
          } elseif( !empty( $value ) ) {
            $selected = selected( $k, $value, false );
          }
          $html .= '<option value="' . $k . '"' . $selected . '>' . esc_html( $v ) . '</option>';
        }
      }

      // Close off our select element
      $html .= '
        </select>';

      return $html;
    }

// Content Move Helpers

    public function get_referenced_ids( $data ) {
      $referenced_ids = array();
      $data           = $this->migrate_data( $data );

      // author is allowed to be "0" in which case we don't need to fuss
      if( !empty( $data[ $this->gfn( 'author' ) ] ) ) {
        $referenced_ids[ 'author' ] = array(
          'type'      => 'user',
          'type_name' => 'user',
          'value'     => $data[ $this->gfn( 'author' ) ]
        );
      }

      if( !empty( $data[ $this->gfn( 'tax_input' ) ] ) ) {
        $referenced_ids[ 'tax_input' ] = array();
        foreach( $data[ $this->gfn( 'tax_input' ) ] as $taxonomy => $term_ids ) {
          if( !empty( $term_ids ) ) {
            $referenced_ids[ 'tax_input' ][ $taxonomy ] = array();
            foreach( $term_ids as $id ) {
              $referenced_ids[ 'tax_input' ][ $taxonomy ][ ] = array(
                'type'      => 'taxonomy',
                'type_name' => $taxonomy,
                'value'     => $id
              );
            }
          }
        }
      }

      return $referenced_ids;
    }

    public function merge_referenced_ids( $data, $reference_data ) {
      $data = $this->migrate_data( $data );

      // author
      if( !empty( $reference_data[ 'author' ] ) ) {
        $data[ $this->gfn( 'author' ) ] = $reference_data[ 'author' ][ 'value' ];
      }

      if( !empty( $reference_data[ 'tax_input' ] ) ) {
        foreach( $reference_data[ 'tax_input' ] as $tax_type => $term_ids ) {
          $data[ $this->gfn( 'tax_input' ) ][ $tax_type ] = array();
          if( !empty( $term_ids ) ) {
            foreach( $term_ids as $term ) {
              $data[ $this->gfn( 'tax_input' ) ][ $tax_type ][ ] = $term[ 'value' ];
            }
          }
        }
      }

      return $data;
    }
  }

}
