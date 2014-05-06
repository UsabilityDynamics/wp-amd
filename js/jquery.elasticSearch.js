/**
 * jQuery ElasticSearch Filter Implementation
 *
 * Copyright © 2012 Usability Dynamics, Inc. (usabilitydynamics.com)
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

;(function( $ ) {

  "use strict";

  /**
   * ElasticSeach
   *
   * @param {type} settings
   * @returns {@this;|_L6.$.fn.ddpElasticSuggest}
   */
  $.fn.elasticSearch = function( settings ) {

    var

      /**
       * Reference to this
       * @type @this;
       */
      self = this,

      /**
       * Defaults
       * @type object
       */
      options = $.extend({
        debug: false,
        timeout: 30000
      }, settings ),

      /**
       * Debug functions
       * @type type
       */
      _console = {

        /**
         * Log
         *
         * @param {type} a
         * @param {type} b
         */
        log: function( a, b ) {
          if ( typeof console === 'object' && options.debug ) {
            console.log( a, b );
          }
        },

        /**
         * Debug
         *
         * @param {type} a
         * @param {type} b
         */
        debug: function( a, b ) {
          if ( typeof console === 'object' && options.debug ) {
            console.debug( a, b );
          }
        },

        /**
         * Error
         *
         * @param {type} a
         * @param {type} b
         */
        error: function( a, b ) {
          if ( typeof console === 'object' && options.debug ) {
            console.error( a, b );
          }
        }
      },

      /**
       * Global viewmodel
       *
       * @type function
       */
      viewModel = function() {

        /**
         * Reference to this
         * @type @this;
         */
        var self = this;

        /**
         * Autocompletion Object
         */
        this.autocompletion = {

          /**
           * Documents Collection
           */
          documents: ko.observableArray( [] ),

          /**
           * Types
           */
          types: ko.observable( {} ),

          /**
           * Visibility flag
           */
          loading: ko.observable( false )
        };

        /**
         * Autocompletion docs count
         */
        this.autocompletion.count = ko.computed(function() {
            return self.autocompletion.documents().length;
        });

        /**
         * Autocompletion visibility
         */
        this.autocompletion.visible = ko.computed(function() {
            return self.autocompletion.documents().length && !self.autocompletion.loading();
        });

        /**
         * Filter Object
         */
        this.filter = {

          /**
           * Filtered documents collection
           */
          documents: ko.observableArray([]),

          /**
           * Total filtered documents
           */
          total: ko.observable(0),

          /**
           * Filter facets collection
           */
          facets: ko.observableArray([]),

          /**
           * More button docs count
           */
          moreCount: ko.observable(0),

          /**
           * Human facet labels
           */
          facetLabels: ko.observable({})
        };

        /**
         * Filtered docs count
         */
        this.filter.count = ko.computed(function() {
          return self.filter.documents().length;
        });

        /**
         * Determine whether filter has more documents to show oe not
         */
        this.filter.has_more_documents = ko.computed(function() {
          return self.filter.total() > self.filter.count();
        });

      },

      /**
       * Knockout custom bindings
       * @type Object
       */
      bindings = {

        /**
         * Suggester for sitewide search
         */
        elasticSuggest: {

          /**
           * Default settings
           */
          settings: {

            /**
             * Minimum number of chars to start search for
             */
            min_chars: 3,

            /**
             * Fields to return
             */
            return_fields: [
              'post_title',
              'permalink'
            ],

            /**
             * Fields to search on
             */
            search_fields: ['post_title'],

            /**
             * Typing timeout
             */
            timeout: 100,

            /**
             * Doc types to search in
             */
            document_type: {
              unknown:'Unknown'
            },

            /**
             * Default search direction
             */
            sort_dir:'asc',

            /**
             * Default request size
             */
            size:20,

            /**
             * Autocompletion form selector
             */
            selector:'#autocompletion',

            /**
             * Ability to change query before execution
             */
            custom_query: {}
          },

          /**
           * Container for setTimeout reference
           */
          timeout: null,

          /**
           * Build query
           */
          buildQuery: function( query_string ) {

            /**
             * Validate
             */
            if ( !query_string || !query_string.length ) {
              _console.error( 'Wrong query string', query_string );
            }

            /**
             * Validate
             */
            if ( !this.settings.search_fields ) {
              _console.error( 'Autocompletion fields are empty', this.settings.search_fields );
            }

            /**
             * Return query object with the ability to extend or change it
             */
            return $.extend({
              query:{
                multi_match:{
                  operator: "and",
                  query: query_string,
                  fields: this.settings.search_fields
                }
              },
              fields: this.settings.return_fields,
              sort: {
                _type: {
                  order: this.settings.sort_dir
                }
              },
              size: this.settings.size
            }, this.settings.custom_query );
          },

          /**
           * Autocomplete submit function
           */
          submit: function( viewModel, element ) {
            _console.log( 'Typing search input', arguments );

            /**
             * Stop submitting if already ran
             */
            if ( this.timeout ) {
              window.clearTimeout( this.timeout );
            }

            /**
             * Do nothing if not enough chars typed
             */
            if ( element.val().length < this.settings.min_chars ) {
              viewModel.autocompletion.loading(false);
              viewModel.autocompletion.documents([]);
              return true;
            }

            _console.log( 'Search fired for ', element.val() );

            /**
             * Run search query with timeout
             */
            viewModel.autocompletion.loading(true);
            this.timeout = window.setTimeout(

              /**
               * API method
               */
              api.search,

              /**
               * Typing timeout
               */
              this.settings.timeout,

              /**
               * Build and pass query
               */
              this.buildQuery( element.val() ),

              /**
               * Types
               */
              Object.keys(this.settings.document_type),

              /**
               * Success handler
               *
               * @param {type} data
               * @param {type} xhr
               */
              function( data, xhr ) {
                _console.debug( 'Autocompletion Search Success', arguments );

                viewModel.autocompletion.documents( data.hits.hits );
                viewModel.autocompletion.loading(false);
              },

              /**
               * Error handler
               */
              function() {
                _console.error( 'Autocompletion Search Error', arguments );

                viewModel.autocompletion.loading(false);
              }
            );
          },

          /**
           * Suggester Initialization
           */
          init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            _console.debug( 'elasticSuggest init', arguments );

            var
              /**
               * Suggest binding object to work with
               */
              Suggest = bindings.elasticSuggest;

            /**
             * Apply settings passed
             */
            Suggest.settings = $.extend( Suggest.settings, valueAccessor() );

            /**
             * Set types
             */
            viewModel.autocompletion.types( Suggest.settings.document_type );

            /**
             * Fire autocomplete function on input typing
             */
            $(element).on('keyup', function(){
              Suggest.submit( viewModel, $(this) );
            });

            /**
             * Prevent form submitting on Enter key
             */
            $(element).keypress(function(e) {
              var code = e.keyCode || e.which;
              if(code == 13)
                return false;
            });

            /**
             * Control dropdown visibility
             */
            $('html').on('click', function(){
              viewModel.autocompletion.documents([]);
            });
            $(Suggest.settings.selector).on('click', function(e){
              e.stopPropagation();
            });
          }

        },

        /**
         * Regular filter binding
         */
        elasticFilter: {

          /**
           * Filter defaults
           */
          settings: {

            /**
             * Default period direction
             */
            period: 'upcoming',

            /**
             * Default field that is responsible for date filtering
             */
            period_field: 'date',

            /**
             * Default sort option
             */
            sort_by: 'date',

            /**
             * Default sorting direction
             */
            sort_dir: 'asc',

            /**
             * Default number of document per page
             */
            per_page: 20,

            /**
             * Offset number
             */
            offset: 0,

            /**
             * Bool flag for more button
             */
            is_more: false,

            /**
             * Facets set
             */
            facets: {},

            /**
             * Default type
             */
            type: 'unknown',

            /**
             * Fields to return
             */
            return_fields: null,

            /**
             * Ability to query before execution
             */
            custom_query: {},

            /**
             * Control location
             */
            location: false,

            /**
             * Facet size
             */
            facet_size: 100,

            /**
             * Facet input name base
             */
            facet_input: 'terms',

            /**
             * Date Range input name base
             */
            date_range_input: 'date_range',

            /**
             * Default loading indicator selector
             */
            loader_selector: '.df_overlay_back, .df_overlay'
          },

          /**
           * Store initial value of per page
           */
          initial_per_page: 20,

          /**
           * Store current filter options to use after re-rendering
           */
          current_filters: null,

          /**
           * DOM Element of filter form
           */
          form: null,

          /**
           * Loading indicator
           */
          loader: null,

          /**
           * DSL Query builder function
           * @return DSL object that should be passed as query argument to ElasticSearch
           */
          buildQuery: function() {

            /**
             * Reference to this
             */
            var self = this;

            /**
             * Get form filter data
             */
            this.current_filters = this.form.serializeObject();

            /**
             * Clean object from empty/null values
             */
            cleanObject( this.current_filters );

            _console.log('Current filter data:', this.current_filters);

            /**
             * Start building the Query
             */
            var filter = {
              bool: {
                must: []
              }
            };

            /**
             * Determine filter period
             */
            if ( this.settings.period ) {

              var period = { range: {} };

              switch( this.settings.period ) {

                case 'upcoming':

                  period.range[this.settings.period_field] = {
                     gte:'now'
                  };

                  filter['bool']['must'].push( period );

                  break;

                case 'past':

                  period.range[this.settings.period_field] = {
                     lte:'now'
                  };

                  filter['bool']['must'].push( period );

                  break;

                default: break;
              }
            }

            /**
             * Determine date range if is set
             */
            if ( !$.isEmptyObject( this.current_filters[this.settings.date_range_input] ) ) {
              var range = { range: {} };
              range.range[this.settings.period_field] = this.current_filters[this.settings.date_range_input];
              filter['bool']['must'].push( range );
            }

            /**
             * Build filter terms based on filter form
             */
            if ( this.current_filters[this.settings.facet_input] ) {
              $.each( this.current_filters[this.settings.facet_input], function(key, value) {
                if ( value !== "0" ) {
                  var _term = {};
                  _term[key] = value;
                  filter['bool']['must'].push({
                    term: _term
                  });
                }
              });
            }

            /**
             * Build facets
             */
            var facets = {};
            $.each( this.settings.facets, function( field, _ /* not used here */ ) {
              facets[field] = {
                terms: { field: field, size: self.settings.facet_size }
              };
            });

            /**
             * Build sort option
             */
            var sort = [];
            if ( this.settings.sort_by ) {

              var sort_type = {};

              switch( this.settings.sort_by ) {

                case 'distance':

                  var lat = Number($.cookie('elasticSearch_latitude'))?Number($.cookie('elasticSearch_latitude')):0;
                  var lon = Number($.cookie('elasticSearch_longitude'))?Number($.cookie('elasticSearch_longitude')):0;

                  sort.push({
                    _geo_distance: {
                      location: {
                        lat: lat, lon: lon
                      },
                      order: this.settings.sort_dir,
                      unit: "m"
                    }
                  });

                  break;
                default:

                  sort_type[this.settings.sort_by] = {
                    order: this.settings.sort_dir
                  };
                  sort.push(sort_type);

                  break;
              }
            }

            /**
             * Return ready DSL object with the ability to extend it
             */
            return $.extend({
              size: this.settings.per_page,
              from: this.settings.offset,
              query: {
                filtered: {
                  filter: filter
                }
              },
              fields: this.settings.return_fields,
              facets: facets,
              sort: sort
            }, this.settings.custom_query );
          },

          /**
           * Submit filter request
           */
          submit: function( viewModel ) {

            /**
             * Reference to this
             * @type @this;
             */
            var self = this;

            /**
             * Show loader indicator
             */
            this.loader.show();

            /**
             * Run search request
             */
            api.search(

              /**
               * Build and pass DSL Query
               */
              this.buildQuery(),

              /**
               * Documents type
               */
              this.settings.type,

              /**
               * Search success handler
               *
               * @param {type} data
               * @param {type} xhr
               */
              function( data, xhr ) {
                _console.log('Filter Success', arguments);

                /**
                 * If is a result of More request then append hits to existing.
                 * Otherwise just replace.
                 */
                if ( self.settings.is_more ) {
                  var current_hits = viewModel.filter.documents();

                  $.each( data.hits.hits, function(k, hit) {
                    current_hits.push( hit );
                  });

                  viewModel.filter.documents( current_hits );
                } else {
                  viewModel.filter.documents( data.hits.hits );
                }

                /**
                 * Store total
                 */
                viewModel.filter.total( data.hits.total );

                /**
                 * Update facets
                 */
                viewModel.filter.facets([]);
                $.each( data.facets, function( key, value ) {
                  value.key = key;
                  viewModel.filter.facets.push(value);
                });

                /**
                 * Hide loader indicator
                 */
                self.loader.hide();

                /**
                 * Trigger custom event on success
                 */
                $(document).trigger( 'elasticFilter.submit.success', arguments );
              },

              /**
               * Error Handler
               */
              function() {
                _console.error('Filter Error', arguments);
                self.loader.hide();
              }
            );

          },

          /**
           * Flush filter settings
           */
          flushSettings: function() {
            this.settings.is_more  = false;
            this.settings.offset   = 0;
            this.settings.per_page = this.initial_per_page;
          },

          /**
           * Initialize elasticFilter binding
           */
          init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            _console.debug( 'elasticFilterFacets init', arguments );

            var
              /**
               * Filter object to work with
               */
              Filter  = bindings.elasticFilter,

              /**
               * Filter form
               */
              form    = $( element ),

              /**
               * Filter controls
               */
              filters = $( 'input,select', form );

            /**
             * Define settings
             */
            Filter.settings         = $.extend( Filter.settings, valueAccessor() );
            Filter.loader           = $( Filter.settings.loader_selector );
            Filter.form             = form;
            Filter.initial_per_page = Filter.settings.per_page;
            viewModel.filter.facetLabels( Filter.settings.facets );

            /**
              * If no coords passed
              */
            if ( !Filter.settings.location ) {

              /**
               * If no coords in cookies
               */
              if ( !Number( $.cookie('elasticSearch_latitude') ) || !Number( $.cookie('elasticSearch_longitude') ) ) {

                /**
                 * If geo API exists
                 */
                if ( navigator.geolocation ) {

                  /**
                   * Get position
                   */
                  navigator.geolocation.getCurrentPosition(

                    /**
                     * Success handler
                     */
                    function( position ) {
                      _console.log( 'GeoLocation Success', arguments );

                      /**
                       * Remember coords
                       */
                      $.cookie('elasticSearch_latitude', position.coords.latitude );
                      $.cookie('elasticSearch_longitude', position.coords.longitude );

                      /**
                       * Run filter again with new coords
                       */
                      Filter.submit( viewModel );
                    },

                    /**
                     * Error handler
                     */
                    function() {
                      _console.log( 'GeoLocation Erros', arguments );
                    },

                    /**
                     * Options
                     */
                    {enableHighAccuracy: true,maximumAge: 0}
                  );
                }
              }
            } else {
              /**
               * Remember passed coords
               */
              $.cookie('elasticSearch_latitude', Filter.settings.location.latitude );
              $.cookie('elasticSearch_longitude', Filter.settings.location.longitude );
            }

            /**
             * Render new facets
             */
            $(document).on('elasticFilter.submit.success', function() {
              if ( Filter.current_filters && Filter.current_filters.terms ) {
                $.each( Filter.current_filters.terms, function(key, value) {
                  /**
                   * WOW! Closure!
                   */
                  $( '[name="'+(function(){return Filter.settings.facet_input;}).call(this)+'['+key+']"]', form ).val( value );
                });
              }
              $(document).trigger( 'elasticFilter.facets.render', [form] );
            });

            _console.log( 'Current Filter settings', Filter.settings );

            /**
             * Bind change event
             */
            filters.live('change', function(){
              Filter.flushSettings();
              Filter.submit( viewModel );
            });

            /**
             * Initial filter submit
             */
            Filter.submit( viewModel );
          }

        },

        /**
         * Elastic filter sorting controls binding
         */
        elasticSortControl: {

          /**
           * Default settings
           */
          settings: {
            button_class:'df_element',
            active_button_class:'df_sortable_active'
          },

          /**
           * Initialize current binding
           */
          init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            _console.log( 'elasticSortControl Init', arguments );

            var
              /**
               * Filter object to work with
               */
              Filter = bindings.elasticFilter,

              /**
               * Reference to tis sorter object
               */
              Sorter = bindings.elasticSortControl;

            /**
             * Set settings
             */
            Sorter.settings = $.extend( Sorter.settings, valueAccessor() );

            /**
             * Bind buttons events
             */
            var buttons = $('.'+Sorter.settings.button_class, element);
            $(document).on('elasticFilter.submit.success', function() {

              buttons.unbind('click');

              buttons.on('click', function() {

                buttons.removeClass(Sorter.settings.active_button_class);
                $(this).addClass(Sorter.settings.active_button_class);

                var data = $(this).data();

                if ( !data.direction ) {
                  $(this).data('direction', Filter.settings.sort_dir);
                }

                $(this).data('direction', data.direction==='asc'?'desc':'asc');

                Filter.flushSettings();
                Filter.settings.sort_by = data.type;
                Filter.settings.sort_dir = data.direction;
                Filter.submit( viewModel );
              });
            });
          }
        },

        /**
         * Elastic filter time control binding
         */
        elasticTimeControl: {

          /**
           * Default settings
           */
          settings: {
            button_class:'df_element',
            active_button_class:'df_sortable_active'
          },

          /**
           * Initialize current binding
           */
          init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            _console.log( 'elasticTimeControl Init', arguments );

            var
              /**
               * Filter object to work with
               */
              Filter = bindings.elasticFilter,

              /**
               * Time controll object
               */
              Time = bindings.elasticTimeControl;

            /**
             * Set settings
             */
            Time.settings = $.extend( Time.settings, valueAccessor() );

            /**
             * Bind button events
             */
            var buttons = $( '.' + Time.settings.button_class, element );
            $(document).on( 'elasticFilter.submit.success', function() {

              buttons.unbind( 'click' );

              buttons.on( 'click', function() {

                buttons.removeClass( Time.settings.active_button_class );
                $(this).addClass( Time.settings.active_button_class );

                var data = $(this).data();

                Filter.flushSettings();
                if ( data.direction ) {
                  Filter.settings.sort_dir = data.direction;
                }
                Filter.settings.period = $(this).data('type');
                Filter.submit( viewModel );
              });
            });
          }
        },

        /**
         * Show More button binding
         */
        filterShowMoreControl: {

          /**
           * Default settings
           */
          settings: {
            count: 10
          },

          /**
           * Initialize current binding
           */
          init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            _console.log( 'filterShowMoreControl init', arguments );

            var
              /**
               * Show more object
               */
              ShowMore = bindings.filterShowMoreControl,

              /**
               * Filter object
               */
              Filter = bindings.elasticFilter;

            /**
             * Set settings
             */
            ShowMore.settings = $.extend( ShowMore.settings, valueAccessor() );
            viewModel.filter.moreCount( ShowMore.settings.count );

            /**
             * Bind button events
             */
            $(element).on('click', function(){
              Filter.settings.per_page = ShowMore.settings.count;
              Filter.settings.offset   = viewModel.filter.count();
              Filter.settings.is_more  = true;
              Filter.submit( viewModel );
            });
          }
        },

        /**
         * Foreach for Object
         */
        foreachprop: {

          /**
           * Transform object to array
           * @param {type} obj
           * @returns {Array}
           */
          transformObject: function (obj) {
              var properties = [];
              for (var key in obj) {
                  if (obj.hasOwnProperty(key)) {
                      properties.push({ key: key, value: obj[key] });
                  }
              }
              return properties;
          },

          /**
           * Initialize binding
           */
          init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = ko.utils.unwrapObservable(valueAccessor()),
            properties = ko.bindingHandlers.foreachprop.transformObject(value);
            ko.applyBindingsToNode(element, { foreach: properties }, bindingContext);
            return { controlsDescendantBindings: true };
          }
        }

      },

      /**
       * HTTP Client
       * @type object
       */
      client = null,

      /**
       * The API. Currently does search only
       * @type type
       */
      api = {

        /**
         * Do Search request
         * @param {type} query
         * @param {type} type
         * @param {type} success
         * @param {type} error
         */
        search: function( query, type, success, error ) {
          _console.log( 'API Search', arguments );

          if ( !type ) {
            type = '';
          }

          if ( client )
            client.post( 'documents/'+type+'/search', JSON.stringify( query ), success, error );
          else _console.error( 'API Search Error', 'Client is undefined' );
        }

      },

      /**
       * Init Client and Apply Bindings
       * @returns {_L6.$.fn.ddpElasticSuggest}
       */
      init = function() {
        _console.debug( 'Plugin init', {self:self, options:options});

        /**
         * Needs KO
         */
        if ( typeof ko === 'undefined' ) {
          _console.error( typeof ko, 'Knockout.js is required.' );
        }

        /**
         * Needs HTTP client
         */
        if ( typeof ejs.HttpClient === 'undefined' ) {
          _console.error( typeof ejs.HttpClient, 'HttpClient is required.' );
        }

        /**
         * Register bindings
         */
        for( var i in bindings ) {
          ko.bindingHandlers[i] = bindings[i];
        }
        _console.debug( 'Bindings registered', ko.bindingHandlers );

        /**
         * Init Client
         */
        client = ejs.HttpClient( options.endpoint );
        if ( options.access_key ) {
          client.addHeader( 'x-access-key', options.access_key );
        }
        _console.debug( 'Client init', client );

        /**
         * Apply view model
         */
        ko.applyBindings( new viewModel(), self[0] );

        return self;
      };

    return init();

  };

  /**
   * Form Serialize Object
   */
  $.fn.serializeObject = function() {
    var self = this,
        json = {},
        push_counters = {},
        patterns = {
          "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
          "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
          "push": /^$/,
          "fixed": /^\d+$/,
          "named": /^[a-zA-Z0-9_]+$/
        };

    this.build = function(base, key, value) {
      base[key] = value;
      return base;
    };

    this.push_counter = function(key) {
      if (push_counters[key] === undefined) {
        push_counters[key] = 0;
      }
      return push_counters[key]++;
    };

    $.each($(this).serializeArray(), function() {

      if (!patterns.validate.test(this.name)) {
        return;
      }

      var k,
          keys = this.name.match(patterns.key),
          merge = this.value,
          reverse_key = this.name;

      while ((k = keys.pop()) !== undefined) {

        reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

        if (k.match(patterns.push)) {
          merge = self.build([], self.push_counter(reverse_key), merge);
        }

        else if (k.match(patterns.fixed)) {
          merge = self.build([], k, merge);
        }

        else if (k.match(patterns.named)) {
          merge = self.build({}, k, merge);
        }
      }

      json = $.extend(true, json, merge);
    });

    return json;
  };

  /**
   * Clean object from empty values
   * @param {type} target
   * @returns {unresolved}
   */
  var cleanObject = function ( target ) {
    Object.keys( target ).map( function ( key ) {
      if ( target[ key ] instanceof Object ) {
        if ( ! Object.keys( target[ key ] ).length && typeof target[ key ].getMonth !== 'function') {
          delete target[ key ];
        }
        else {
          cleanObject( target[ key ] );
        }
      }
      else if ( target[ key ] === "" || target[ key ] === null ) {
        delete target[ key ];
      }
    } );
    return target;
  };

})(jQuery);