/**
 * Main Application Scripts
 *
 * @example
 *
 *      // Some Locale String.
 *      require( 'site.locale' ).someWord
 *
 *      // AJAX URL.
 *      require( 'site.model' ).ajax
 *
 */
define( 'app.main', [ 'jquery', 'skrollr' ], function( jQuery ) {
  console.debug( 'app.main', 'loaded' );

  // ghetto fix because w/o it breaks mobile by preventing scrolling - potanin
  if( window.innerWidth > 700 ) {
    //console.log( 'window.screen.availWidth', window.screen.availWidth );

    //window.skrollr.init( { forceHeight: false });     

    // Sticky elements implementation
    require( [ 'sticky' ], function() {

      jQuery( ".navbar-top" ).sticky({
        //topSpacing: st
      });

    });

  }

  // Bind Cross Domain Tracking for EventBrite.
  jQuery( 'a[data-track], a[href*=eventbrite]' ).click( function( e ) {
    console.debug( 'app.main', 'external click' );
    e.preventDefault();
    _gaq.push([ '_link', 'https://www.eventbrite.com/e/ume-2014-tickets-9467005067' ]);
    return true;
  });

});

