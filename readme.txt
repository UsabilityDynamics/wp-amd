=== WP-AMD - Global JS and CSS handling ===
Contributors: usability_dynamics, andypotanin, jbrw1984, maxim.peshkov, anton-korotkoff, ideric, smoot328
Donate link: http://usabilitydynamics.com/
Tags: JS, CSS, Global JS, Global CSS, JS handling, CSS handling, Customizer, customize, theme.
Requires at least: 4.0
Tested up to: 4.5.3
Stable tag: 1.2.2

== Description ==

The plugin allows to add/update custom global javascript and CSS on your site in real time using version control.

Visit project on GitHub: https://github.com/UsabilityDynamics/wp-amd

= Features =

* Adds backend JavaScript editor with version control.
* Adds frontend CSS editor with version control.
* Adds ability to modify CSS in preview mode in real time.
* Dependencies can be included ( jquery, backbone, etc ).
* Plugin can be loaded as a WordPress plugin or as a Composer module (dependency).
* Theme's dependency.

= Translations =

* English (UK)

== Installation ==

1. Download and activate the plugin through the 'Plugins' menu in WordPress.
2. Visit Appearance -> Script Editor page to add/update global javascript.
2. Visit Appearance -> Style Editor page to add/update global CSS.
4. Or visit Appearance -> Customize -> Custom Styles to update CSS in preview mode.

== Changelog ==

= 1.2.2 =
* Fixed the bug related to removing all rewrite rules ( breaking permalinks ).

= 1.2.1 =
* Updated vendor libraries. Old versions occurred conflicts when other UD plugins were activated.
* Fixed Content-Type response headers.
* Fixed typos.
* Fixed PHP Warnings and Notices.
* Fixed dependency saving/updating, which did not work when forms were saved via AJAX.
* Fixed incorrect plugin_url usage.
* Fixed WPML translation issue with js and css not being properly included.
* Other improvements and fixes.


= 1.1.0 =
* Added disk caching, with location configurable via "wp-amd:script:disk_cache" filter.
* Added Metaboxes, Screen Options and Screen Help. (WIP)
* Added filters that allow override of default asset locations. e.g. /assets/scripts/app.js instead of /assets/wp-amd.js
* Added Twitter Bootstrap CSS and JS as available dependencies.
* Added Font Awesome as an available CSS dependency.
* Added Normalize as an available CSS dependency.
* Added support for dependency-dependencies.
* Fixed bug with Style and Script post types not properly registering their titles.
* Forces third-party JavaScript libraries to be loaded in footer by default.
* Added Knockout.js and UDX Requires
* Several minor documentation fixes.

= 1.0.4 =
* Fixed Custom Styles Editor resizable issue on Customize page.
* Fixed plugin's styles/scripts order loading on front end.
* Removed extra console log data.

= 1.0.3 =
* Fixed rewrite rules for assets links.
* Fixed warnings and notices.

= 1.0.1 =
* Added theme's dependency.
* Fixed and updated Dependencies metabox.
* Fixed script/style dependencies registration.
