<?php get_header(); ?>

<?php get_template_part( 'attention', 'venue' ); ?>

<?php
  $venue = new \DiscoDonniePresents\Venue( get_the_ID(), false ); the_post();
  //echo '<pre>'; print_r( $venue->meta() ); echo '</pre>';
?>

<?php $image = wp_get_attachment_image( $venue->meta('imageLogo'), $size = 'sidebar_poster' ); ?>

<div class="<?php flawless_wrapper_class( 'tabbed-content' ); ?>" title="<?php echo esc_attr( get_the_title() ); ?>" itemscope itemtype="http://schema.org/Venue">

  <div class="cfct-block sidebar-left span4 first visible-desktop">
    <div class="cfct-module" style="padding: 0; margin: 0;">

    <div class="visible-desktop dd_featured_image_wrap <?php echo $image ? 'have_image' : 'no_image'; ?>">
      <?php echo $image; ?>
    </div>

    <ul class="dd_side_panel_nav">

      <li class="visible-desktop link first ui-tabs-selected"><a href="#section_event_details"><i class="icon-info-blue icon-dd"></i> Info</a></li>

      <li class="visible-desktop link">
        <a href="#section_event">
          <i class="icon-hdp_event icon-dd"></i> <?php _e('Events'); ?>
          <span class="comment_count"><?php echo count( $venue->events( array( 'period' => 'upcoming' ) ) ); ?></span>
        </a>
      </li>

      <li class="visible-desktop link">
        <a href="#section_hdp_photo_gallery">
          <i class="icon-hdp_photo_gallery icon-dd"></i> <?php _e('Photos'); ?>
          <span class="comment_count"><?php echo count( $venue->photos() ); ?></span>
        </a>
      </li>

      <li class="visible-desktop link">
        <a href="#section_hdp_video">
          <i class="icon-hdp_video icon-dd"></i> <?php _e('Videos'); ?>
          <span class="comment_count"><?php echo count( $venue->videos() ); ?></span>
        </a>
      </li>

      <?php if( $venue->meta('geo_located') ) { ?>
       <li class="visible-desktop link"><a href="#section_map"><i class="hdp_venue icon-dd"></i> Location Map</a></li>
      <?php } ?>

    </ul>

    <div class="visible-desktop" style="height: 50px;"></div>

    </div>
  </div>

  <div class="<?php flawless_block_class( 'main cfct-block span8' ); ?>">

    <div class="<?php flawless_module_class( 'taxonomy-archive' ); ?>">

      <div id="section_event_details">

        <header class="entry-title-wrapper term-title-wrapper">
          <?php flawless_breadcrumbs(); ?>
          <h1 class="entry-title"><?php echo $venue->post('post_title'); ?></h1>
        </header>

        <div class="entry-content clearfix">

          <?php if( $image ) { ?>
            <div class="poster-iphone hidden-desktop">
              <?php echo $image; ?>
            </div>
            <hr class="hidden-desktop"/>
          <?php } ?>

          <div class="category_description taxonomy">
          <?php the_content(); ?>
          </div>
          <hr class="dotted visible-desktop" style="margin-top:5px;"/>

          <?php
            if ( $venue->meta('geo_located') ) {
          ?>

            <div class="tax_address">
              <span>Address:</span>
              <?php echo $venue->meta('locationAddress'); ?>
            </div>

          <?php
            }
          ?>

          <?php if ( $venue->meta( 'socialLinks' ) ) { ?>
          <ul class="tax_meta">
            <?php foreach( $venue->meta( 'socialLinks' ) as $link ) : ?>
            <li><a href="<?php echo $link; ?>" target="_blank"><?php echo $link; ?></a></li>
            <?php endforeach; ?>
          </ul>
          <?php } ?>

        </div>

      </div>

      <div id="section_event">
        <h1><?php echo $venue->post('post_title'); ?> <?php _e('Events'); ?></h1>

        <ul id="hdp_results_header_event" class="hdp_results_header clearfix">
          <li class="hdp_event_time">Date</li>
          <li class="hdp_event_name">Name</li>
          <li class="hdp_event_city">City</li>
          <li class="hdp_event_state">State</li>
        </ul>

        <div id="dynamic_filter" class="dynamic_filter df_element df_top_wrapper df_element df_top_wrapper clearfix" dynamic_filter="hdp_event">
          <div class="df_element hdp_results clearfix">
            <ul class="df_element hdp_results_items">

              <?php if ( $venue->events() ): ?>

              <?php
                foreach( $venue->events() as $event ) {
                  include( locate_template('templates/loop/event.php') );
                }
              ?>

              <?php endif; ?>

            </ul>
          </div>
        </div>

      </div>

      <div id="section_hdp_photo_gallery">
        <h1><?php echo $venue->post('post_title'); ?> <?php _e('Photos'); ?></h1>

        <div id="dynamic_filter" class="dynamic_filter df_element df_top_wrapper df_element df_top_wrapper clearfix" dynamic_filter="hdp_photo_gallery">
          <div class="df_element hdp_results clearfix">
            <ul class="df_element hdp_results_items">

              <?php if ( $venue->photos() ): ?>

              <?php
                foreach( $venue->photos() as $photo ) {
                  include( locate_template('templates/loop/imagegallery.php') );
                }
              ?>

              <?php else: ?>

              <li><?php _e( 'No photos found' ); ?></li>

              <?php endif; ?>

            </ul>
          </div>
        </div>

      </div>

      <div id="section_hdp_video">
        <h1><?php echo $venue->post('post_title'); ?> <?php _e('Videos'); ?></h1>

        <div id="dynamic_filter" class="dynamic_filter df_element df_top_wrapper df_element df_top_wrapper clearfix" dynamic_filter="hdp_video">
          <div class="df_element hdp_results clearfix">
            <ul class="df_element hdp_results_items">

              <?php if ( $venue->videos() ): ?>

              <?php
                foreach( $venue->videos() as $video ) {
                  include( locate_template('templates/loop/videoobject.php') );
                }
              ?>

              <?php else: ?>

              <li><?php _e( 'No videos found' ); ?></li>

              <?php endif; ?>

            </ul>
          </div>
        </div>

      </div>

      <?php if( $venue->meta('geo_located') ) { ?>
        <div id="section_map" class="inner not-for-iphone not-for-ipad">
          <div id="event_location" style="height: 400px; width: 100%;"></div>
        </div>
      <?php } ?>

    </div>

  </div>

</div>

<?php echo '<script type="text/javascript">var hdp_current_venue = jQuery.parseJSON( ' . json_encode( json_encode( $venue ) ) . ' ); </script>'; ?>

<?php get_footer(); ?>
