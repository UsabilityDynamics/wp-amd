<?php

/** 
 * SET ABSPATH TO YOUR WORPDRESS ROOT DIRECTORY
 * Note,
 * you can use already existing wordpress core in 
 * /vendor/usabilitydynamics/lib-wp-phpunit/wordpress
 */
define( 'ABSPATH', dirname( __FILE__ ) . '/vendor/usabilitydynamics/lib-wp-phpunit/wordpress/' );

/** 
 * SET DATABASE CREDENTIALS 
 */
define( 'DB_NAME', 'unit_tests' );
define( 'DB_USER', 'root' );
define( 'DB_PASSWORD', '' );
define( 'DB_HOST', 'localhost' );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

/** 
 * SET DOMAIN AND EMAIL. 
 * IT WILL BE USED FOR SETTING YOUR SITE_URL AND HOME_URL
 */
// Example value: http://example.com
define( 'WP_TESTS_DOMAIN', 'http://unit-tests.dev' );
// Example value: test@example.com
define( 'WP_TESTS_EMAIL', 'test@unit.dev' );

/** THAT'S ALL. DO NOT MODIFY CODE BELOW. */

define( 'WP_TESTS_TITLE', 'PHPUnit Test Blog' );
define( 'WP_TESTS_NETWORK_TITLE', 'PHPUnit Test Network' );
define( 'WP_TESTS_SUBDOMAIN_INSTALL', true );
$base = '/';

define( 'WPLANG', '' );
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_DISPLAY', true );

/* Cron tries to make an HTTP request to the blog, which always fails, because tests are run in CLI mode only */
define( 'DISABLE_WP_CRON', true );

define( 'WP_ALLOW_MULTISITE', false );
if ( WP_ALLOW_MULTISITE ) {
	define( 'WP_TESTS_BLOGS', 'first,second,third,fourth' );
}
if ( WP_ALLOW_MULTISITE && !defined('WP_INSTALLING') ) {
	define( 'SUBDOMAIN_INSTALL', WP_TESTS_SUBDOMAIN_INSTALL );
	define( 'MULTISITE', true );
	define( 'DOMAIN_CURRENT_SITE', WP_TESTS_DOMAIN );
	define( 'PATH_CURRENT_SITE', '/' );
	define( 'SITE_ID_CURRENT_SITE', 1);
	define( 'BLOG_ID_CURRENT_SITE', 1);
	//define( 'SUNRISE', TRUE );
}

$table_prefix  = 'test_';

define( 'WP_PHP_BINARY', 'php' );