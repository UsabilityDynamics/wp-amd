/**
 * Sticky navigation class
 *
 * @class stickynav
 */
define( ['jquery'], function( $ ){

  var sticky = {

    navTop: 0,

    /**
     * Get the navigation top position
     *
     * @method getNavTop
     */
    getNavTop: function(){
      this.navTop = $( 'header .top-nav' ).offset().top;
      var padding = parseInt( $( 'header .top-nav' ).css( 'padding-top' ) );

      this.navTop += padding;
    },

    /**
     * Initialize the window scroll and detect when to stick the navigation
     *
     * @method eventScroll
     */
    eventScroll: function(){
      var elmTopNav = $( 'header .top-nav' );
      var that = this;

      $( window ).on( 'scroll', function(){

        var windowTop = $( window ).scrollTop();

        if( windowTop >= that.navTop ){
          elmTopNav.addClass( 'sticky-nav' );
        } else{
          elmTopNav.removeClass( 'sticky-nav' );
        }
      } );
    }
  };

  return {

    /**
     * Bootstrap the sticky navigation plugin
     *
     * @method init
     */
    init: function(){
      sticky.getNavTop();
      sticky.eventScroll();
    }
  }
} );