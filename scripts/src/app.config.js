/**
 * This file is a prototype for the kind of file that will be generated automatically by extracting all Scripts
 * and removing them from HTML responses on-the-fly.
 *
 * Libs declared in <head> - start loading right away via deps
 * Shims Will usually be blank and rely on UDX definitions.
 *
 * Config (locale) properties become instantly accessible to head and body scripts.
 *
 * Context can be set but it makes it more difficult to reference it later.
 *
 */
require({
  baseUrl: '/assets/scripts',
  config: define( 'app.config', {
    analytics: window.analytics = {},
    wp_menufication: window.wp_menufication = {
      "element": "#wp_menufication",
      "enable_menufication": "on",
      "headerLogo": "http://umesouthpadre.com/media/2014/01/020a9ba2dd708c48353fe9bc3f4aecb190.png",
      "headerLogoLink": "http://umesouthpadre.com/",
      "menuLogo": "",
      "menuText": "",
      "triggerWidth": "770",
      "addHomeLink": null, "addHomeText": "",
      "addSearchField": null, "hideDefaultMenu": "on",
      "onlyMobile": null, "direction": "left",
      "theme": "dark",
      "disableCSS": "on",
      "childMenuSupport": "on",
      "childMenuSelector": "sub-menu, children",
      "activeClassSelector": "current-menu-item, current-page-item, active",
      "enableSwipe": "on",
      "doCapitalization": null, "supportAndroidAbove": "3.5",
      "disableSlideScaling": null, "toggleElement": "",
      "customMenuElement": "",
      "customFixedHeader": "",
      "addToFixedHolder": "",
      "page_menu_support": null, "wrapTagsInList": "",
      "allowedTags": "DIV, NAV, UL, OL, LI, A, P, H1, H2, H3, H4, SPAN, FORM, INPUT, SEARCH",
      "customCSS": "",
      "is_page_menu": "",
      "enableMultiple": "",
      "is_user_logged_in": ""
    },
    ajaxurl: window.ajaxurl = "http://umesouthpadre.com/manage/admin-ajax.php"
  }),
  paths: {
    'jquery': [ 'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.0.min' ],
    'jquery.migrate': [ 'http://umesouthpadre.com/wp-includes/js/jquery/jquery-migrate.min' ],
    'jquery.menufication': [ 'http://umesouthpadre.com/vendor/usabilitydynamics/wp-menufication/scripts/jquery.menufication.min' ],
    'menufication-setup': [ '/vendor/usabilitydynamics/wp-menufication/scripts/menufication-setup' ],
    'jquery.ui.widget': [ 'http://umesouthpadre.com/wp-includes/js/jquery/ui/jquery.ui.widget.min' ],
    'jquery.ui.accordion': [ 'http://umesouthpadre.com/wp-includes/js/jquery/ui/jquery.ui.accordion.min' ],
    'admin-bar': [ 'http://discodonniepresents.com/wp-includes/js/admin-bar.min' ],
    'jquery.flexslider' : [ 'http://umesouthpadre.com/assets/scripts/jquery.flexslider' ],
    'jquery.socialstream' : [ '/vendor/usabilitydynamics/wp-festival/lib/modules/social-stream/scripts/jquery.social.stream.1.5.5.custom' ],
    'jquery.socialstream.wall' : [ '/vendor/usabilitydynamics/wp-festival/lib/modules/social-stream/scripts/jquery.social.stream.wall.1.3' ],
    'jquery.masonry' : [ 'http://umesouthpadre.com/wp-includes/js/jquery/jquery.masonry.min' ]
  },
  deps: [ 'jquery', 'app.bootstrap' ],
  shim: {
    'menufication-setup': {
      deps: [ 'jquery' ]
    },
    'jquery.menufication': {
      deps: [ 'jquery' ]
    },
    'jquery.flexslider': {
      deps: [ 'jquery' ]
    },
    'jquery.socialstream': {
      deps: [ 'jquery' ]
    },
    'jquery.socialstream.wall': {
      deps: [ 'jquery.socialstream' ]
    },
    'jquery.masonry': {
      deps: [ 'jquery' ]
    }
  }
});

/**
 * Bootstraps Application, requiring <head> scripts
 *
 */
define( 'app.bootstrap', [ 'jquery.menufication', 'menufication-setup' ], function() {
  console.debug( 'app.bootstrap', 'loaded' );

  window._gaq = window._gaq || [];

  window._gaq.push( [ '_setAccount', 'UA-31265686-7' ] );

  window._gaq.push(
    [ '_setAllowLinker', true ],
    [ '_setDomainName', 'umesouthpadre.com' ],
    [ '_setCustomVar', 3, 'year', '2013', 3 ],
    [ '_trackPageview' ]
  );

  (function() {
    var ga = document.createElement( 'script' );
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://stats.g.doubleclick.net/dc.js';
    var s = document.getElementsByTagName( 'script' )[0];
    s.parentNode.insertBefore( ga, s );
  })();

  window._prum = [
    [ 'id', '528c4342abe53dc362000000' ],
    [ 'mark', 'firstbyte', (new Date()).getTime() ]
  ];

  (function() {
    var s = document.getElementsByTagName( 'script' )[0];
    var p = document.createElement( 'script' );
    p.async = 'async';
    p.src = '//rum-static.pingdom.net/prum.min.js';
    s.parentNode.insertBefore( p, s );
  })();

  // Load main theme logic.
  require( [ 'app.main', 'twitter.bootstrap', 'udx.wp.spa' ] );

});
