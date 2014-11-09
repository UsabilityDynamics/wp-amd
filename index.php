<?php
/**
 * WordPress Site Loader
 */
try {

  header( 'PageSpeed: off' );
	define('WP_USE_THEMES', true);

  /** Make sure we have a proper wp-config file */
  if( !file_exists( __DIR__ . '/wp-config.php' ) ) {
    throw new Exception( 'Site not installed.' );
  }

  /** Make sure we have our vendor libraries installed, and if we - include them */
  if( !file_exists( __DIR__ . '/wp-blog-header.php' ) ) {
    throw new Exception( 'Site vendor libraries not installed.' );
  }else{
    require_once( __DIR__ . '/wp-blog-header.php' );
  }

} catch( Exception $e ) {

  /** There was an issue, we need to bail */
  header( 'HTTP/1.1 500 Internal Server Error' );
  echo '<h1>Site Error</h1>';
  echo '<p>' . $e->getMessage() . '</p>';
  die();

}
