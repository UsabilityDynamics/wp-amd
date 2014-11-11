<?php
/**
 * Plugin Name: Shameless Hacks
 * Plugin URI: http://usabilitydynamics.com/
 * Description: Load composer stuff.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1
 * Author URI: http://usabilitydynamics.com
 *
 */
add_filter( 'template_redirect', 'applyOutputHacks' );
add_filter( 'admin_init', 'applyOutputHacks' );

/**
 *
 */
function applyOutputHacks() {

	if( headers_sent() ) {
		return;
	}

	ob_start( function( $buffer ) {

		// We need this until we convert all Customizer Assets to use Media Library.
		$buffer = str_replace( 'http://dayafter.com/media/', 'http://media.dayafter.com/', $buffer );
		$buffer = str_replace( 'src="/media/', 'src="http://media.dayafter.com/', $buffer );
		$buffer = str_replace( '2014/10/d187aeac8ed1c105ea05ed2c8c0bdaf573', '2014/11/ab4314e5285094ba121212d7c8f032c949', $buffer );

		return $buffer;

	});


}