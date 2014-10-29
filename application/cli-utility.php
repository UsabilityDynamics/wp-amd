<?php
/**
 * Plugin Name: CLI
 * Plugin URI: http://usabilitydynamics.com/plugins/
 * Description: Main plugin to handle all site specific bootstrap tasks
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.2
 * Author URI: http://usabilitydynamics.com
 */

/** If we have wp-cli, load the file for our migration */
if( defined( 'WP_CLI' ) && class_exists( 'WP_CLI_Command' ) && !class_exists( 'DDP_Utility_CLI' ) ) {

	/**
	 * Our WP-CLI command to migrate their site
	 */
	class DDP_Utility_CLI extends WP_CLI_Command {

		/**
		 * Display active themes accross the network including relative path.
		 *
		 * ## OPTIONS
		 *
		 * <stage>
		 * : Which migration stage we want to do, defaults to all
		 *
		 * ## EXAMPLES
		 *
		 *     wp utility themes
		 *
		 * @synopsis [<stage>]
		 */
		function themes( $args ) {
			global $wpdb, $current_blog;

			//WP_CLI::line( 'DB_NAME: ' . DB_NAME );
			//WP_CLI::line( 'DB_USER: ' . DB_USER );
			//WP_CLI::line( 'DB_HOST: ' . DB_HOST );

			// WP_CLI::line( 'Generating list of sites with themes.' );

			$_results = array();

			foreach( (array) wp_get_sites( array( 'public' => true, 'network_id' => null ) ) as $site ) {

				switch_to_blog( $site[ 'blog_id' ] );

				$_template = wp_get_theme( get_option( 'template' ) );
				$_stylesheet= wp_get_theme( get_option( 'stylesheet' ) );
				$_status = array();

				$_templateActual = get_option( 'stylesheet' ) !== get_option( 'template' ) ? get_option( 'template' ) : null;

				if( $_templateActual && !is_dir( $_template->get_stylesheet_directory() ) ) {
					$_status[] = 'Template missing.';
				}

				if( !is_dir( $_stylesheet->get_stylesheet_directory() ) ) {
					$_status[] = 'Theme missing.';
				}

				$_network = (array) wp_get_network( $site['site_id'] );

				$_results[ $site['domain'] ] = array(
					'network' => $_network['domain'],
					'site' => $site['domain'],
					'theme' => get_option( 'stylesheet' ), // . ' ' . $_stylesheet->get( 'Version' ),
					'template' => $_templateActual,
					'path' => str_replace( getcwd(), '.', $_template->get_stylesheet_directory() ),
					'status' => join( ' ', $_status )
				);

			}

			\WP_CLI\Utils\format_items( 'table', $_results,  array( 'network', 'site', 'theme', 'template', 'path', 'status' ) );

		}


		/**
		 * Display active themes accross the network including relative path.
		 *
		 * ## OPTIONS
		 *
		 * <stage>
		 * : Which migration stage we want to do, defaults to all
		 *
		 * ## EXAMPLES
		 *
		 *     wp utility dns
		 *
		 * @synopsis [<stage>]
		 */
		function dns( $args ) {
			global $wpdb, $current_blog;

			//WP_CLI::line( 'DB_NAME: ' . DB_NAME );
			//WP_CLI::line( 'DB_USER: ' . DB_USER );
			//WP_CLI::line( 'DB_HOST: ' . DB_HOST );

			// WP_CLI::line( 'Generating list of sites with themes.' );

			$_results = array();

			foreach( (array) wp_get_sites( array( 'network_id' => null ) ) as $site ) {

				switch_to_blog( $site[ 'blog_id' ] );

				$_template = wp_get_theme( get_option( 'template' ) );
				$_stylesheet= wp_get_theme( get_option( 'stylesheet' ) );
				$_status = array();

				$_templateActual = get_option( 'stylesheet' ) !== get_option( 'template' ) ? get_option( 'template' ) : null;

				if( $_templateActual && !is_dir( $_template->get_stylesheet_directory() ) ) {
					$_status[] = 'Template missing.';
				}

				if( !is_dir( $_stylesheet->get_stylesheet_directory() ) ) {
					$_status[] = 'Theme missing.';
				}

				$_network = (array) wp_get_network( $site['site_id'] );

				$_results[ $site['domain'] ] = array(
					'network' => $_network['domain'],
					'site' => $site['domain'],
					'ip' => gethostbyname( $site['domain'] ),
					'status' => ''
				);

			}

			\WP_CLI\Utils\format_items( 'table', $_results,  array( 'network', 'site', 'ip', 'status' ) );

			//die( '<pre>' . print_r( $_results, true ) . '</pre>');

		}

		/**
		 * Test stuff.
		 *
		 * ## OPTIONS
		 *
		 * <stage>
		 * : Which migration stage we want to do, defaults to all
		 *
		 * ## EXAMPLES
		 *
		 *     wp utility test
		 *     wp utility test all
		 *
		 * @synopsis [<stage>]
		 */
		function test( $arg, $args ) {
			$this->_init();
			$type = false;

			WP_CLI::line( 'DB_NAME: ' . DB_NAME );
			WP_CLI::line( 'DB_USER: ' . DB_USER );
			WP_CLI::line( 'DB_HOST: ' . DB_HOST );

		}

		/**
		 * Attempts the migration
		 *
		 * ## OPTIONS
		 *
		 * <stage>
		 * : Which migration stage we want to do, defaults to all
		 *
		 * ## EXAMPLES
		 *
		 *     wp utility migrate
		 *     wp utility migrate artist
		 *
		 * @synopsis [<stage>]
		 */
		function migrate( $args ) {
			$this->_init();
			$type = false;

			if ( isset( $args ) && is_array( $args ) && count( $args ) ) {
				$type = array_shift( $args );
			}

			/** All we're going to do is call the import command */
			$migration = new \EDM\Application\Migration( $type );
		}

		/**
		 * Setup our limits
		 */
		private function _init() {
			set_time_limit( 0 );
			ini_set( 'memory_limit', '2G' );
		}

	}

	/** Add the commands from above */
	WP_CLI::add_command( 'utility', 'DDP_Utility_CLI' );

}
