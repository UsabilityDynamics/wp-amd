<?php
/**
 * Flawless
 *
 * Premium WordPress Theme - functions and definitions.
 *
 * @module Flawless
 * @namespace Flawless
 *
 * @author team@UD
 * @version 0.1.1
 */
namespace Flawless {

  /**
   * Flawless
   *
   * Premium WordPress Theme - functions and definitions.
   *
   * @final
   *
   * @version 0.1.1
   * @author team@UD
   * @class Flawless
   * @since 0.0.2
   */
  final class Flawless {

    /**
     * Flawless core version.
     *
     * @static
     * @property $version
     * @type {Object}
     */
    public static $version = '0.1.1';

    /**
     * Singleton Instance Reference.
     *
     * @public
     * @static
     * @property $instance
     * @type {Object}
     */
    public static $instance;

    /**
     * Instance Meta.
     *
     * @private
     * @static
     * @property $_state
     * @type {Object}
     */
    private $state = stdClass;

    /**
     * Initializes Theme
     *
     * Sets up global $flawless variable, loads defaults and binds primary actions.
     *
     *      var $instance = new Flawless();
     *      $instance->Loader = require( 'core/controllers/flawless/loader.php' );
     *
     * @method __construct
     * @for Flawless
     * @constructor
     *
     * @version  0.0.6
     *
     * @author potanin@UD
     * @return \Flawless\Flawless
     */
    public function __construct() {

      // Save context reference.
      self::$instance = &$this;

      $this->state = json_decode( json_encode( array(
        'settings' => array(),
        'structure' => array(),
        'computed' => array(
          'have_static_home'  => ( get_option( 'show_on_front' ) == 'page' ? true : false ),
          'using_permalinks'  => ( get_option( 'permalink_structure' ) != '' ? true : false ),
          'have_blog_home'    => ( get_option( 'show_on_front' ) == 'page' || get_option( 'page_for_posts' ) ? true : false ),
          'protocol'          => ( is_ssl() ? 'https://' : 'http://' ),
          'deregister_empty_widget_areas'  => flase,
          'asset_directories' => apply_filters( 'flawless::asset_locations', array(
            trailingslashit( get_template_directory() ) . 'core' => trailingslashit( get_template_directory_uri() ) . 'core',
            trailingslashit( get_template_directory() ) . 'ux' => trailingslashit( get_template_directory_uri() ) . 'ux',
            trailingslashit( get_stylesheet_directory() ) . 'ux' => trailingslashit( get_stylesheet_directory_uri() ) . 'ux',
            trailingslashit( get_stylesheet_directory() ) . 'core' => trailingslashit( get_stylesheet_directory_uri() ) . 'core',
          )),
          'paths' =>  array(
            'root'        => untrailingslashit( get_template_directory() ),
            'controllers' => trailingslashit( get_template_directory() ) . 'core/controllers',
            'modules'     => trailingslashit( get_template_directory() ) . 'core/modules',
            'extend'      => trailingslashit( get_template_directory() ) . 'core/extend',
            'helpers'     => trailingslashit( get_template_directory() ) . 'core/helpers',
            'vendor'      => trailingslashit( get_template_directory() ) . 'core/vendor',
            'models'      => trailingslashit( get_template_directory() ) . 'static/models',
            'schemas'     => trailingslashit( get_template_directory() ) . 'static/schemas',
            'templates'   => trailingslashit( get_template_directory() ) . 'templates',
            'fonts'       => trailingslashit( get_template_directory() ) . 'ux/styles',
            'images'      => trailingslashit( get_template_directory() ) . 'ux/styles',
            'views'       => trailingslashit( get_template_directory() ) . 'ux/views',
            'scripts'     => trailingslashit( get_template_directory() ) . 'ux/scripts'
          )
        ),
        'loader' => array()
      )));

      define( 'Flawless_Core_Version', self::$version );
      define( 'Flawless_Version', self::$version );
      define( 'Flawless_Option_Key', 'settings::' . Flawless_Core_Version );
      define( 'Flawless_Directory', basename( TEMPLATEPATH ) );
      define( 'Flawless_Path', untrailingslashit( get_template_directory() ) );
      define( 'Flawless_URL', untrailingslashit( get_template_directory_uri() ) );
      define( 'Flawless_Transdomain', 'flawless' );

      // Get Loader Class.
      require_once( $this->state->computed->paths->controllers . '/loader.php' );

      // Load Controllers, Modules, Helpers and Schemas.
      new Loader( array(
        'controllers' => array(
          'Flawless\\'          => array( $this->state->computed->paths->controllers ),
          'UsabilityDynamics\\' => array( $this->state->computed->paths->vendor ),
          'JsonSchema\\'        => array( $this->state->computed->paths->vendor . '/justinrainbow' )
        ),
        'modules' => array(
          'modules' => $this->state->computed->paths->modules,
          'extend'  => $this->state->computed->paths->extend
        ),
        'helpers' => array(
          'helpers' => $this->state->computed->paths->helpers . '/template.php'
        ),
        'models' => array(
          'component' => $this->state->computed->paths->root . '/component.json',
        ),
        'schemas' => array(
          'settings' => $this->state->computed->paths->schemas . '/settings.json',
          'features' => $this->state->computed->paths->schemas . '/features.json',
          'headers'  => $this->state->computed->paths->schemas . '/headers.json',
          'state'    => $this->state->computed->paths->schemas . '/state.json'
        )
      ));

      // Controllers.
      $this->API      = new API();
      $this->Asset    = new Asset();
      $this->Content  = new Content();
      $this->Settings = new Settings();
      $this->Legacy   = new Legacy();
      $this->Loader   = new Loader();
      $this->Utility  = new Utility();
      $this->Theme    = new Theme();
      $this->Views    = new Views();
      $this->Log      = new Log();

      // Compute additional data once controllers are loaded.
      $this->state->computed->theme_data = Loader::get_file_data( is_child_theme() ? untrailingslashit( get_stylesheet_directory() ) . '/style.css' : TEMPLATEPATH . '/style.css' );

      // Setup Primary Actions.
      add_action( 'after_setup_theme', array( $this, 'after_setup_theme' ) );
      add_action( 'init', array( $this, 'init_upper' ), 0 );
      add_action( 'init', array( $this, 'init_lower' ), 500 );

      // Earliest available callback.
      do_action( 'flawless::loaded', $this );

    }

    /**
     * Setups up core theme functions.
     *
     * Adds image header section and default headers.
     *
     * @method after_setup_theme
     * @for Flawless
     *
     * @action after_setup_theme ( 10 )
     * @since 0.0.2
     */
    public function after_setup_theme() {
      self::log( 'Executed: Flawless::after_setup_theme();' );
      do_action( 'flawless::theme_setup', $this );
      do_action( 'flawless::theme_setup::after', $this );
    }

    /**
     * Run on init hook, loads all other hooks and filters
     *
     * Ran as early as possible, before:
     * - widgets_init ( 1 )
     *
     * @method init_upper
     * @for Flawless
     *
     * @since 0.0.2
     */
    public function init_upper() {
      self::log( 'Executed: Flawless::init_upper();' );

      // Admin Action Wrappers.
      add_action( 'admin_menu', array( $this, 'admin_menu' ) );
      add_action( 'admin_init', array( $this, 'admin_init' ) );

      // Frontend Actions.
      add_action( 'template_redirect', array( $this, 'template_redirect' ), 0 );

      // Initializer Hook.
      do_action( 'flawless::init_upper', $this );

      // Compiled JavaScript library.
      wp_register_script( 'flawless-app', get_stylesheet_directory_uri() . '/public/scripts/app.min.js', array( 'flawless-framework' ), Flawless_Version, true );

    }

    /**
     * Run on init hook, intended to load functionality towards the end of init.
     *
     * Scripts are loaded here so they can be overwritten by regular init.
     * Enqueue front-end assets.
     *
     * @method init_lower
     * @for Flawless
     *
     * @filter init ( 500 )
     * @since 0.0.2
     */
    public function init_lower() {
      self::log( 'Executed: Flawless::init_lower();' );

      // Do not load these styles if we are on admin side or the WP login page.
      if ( strpos( $_SERVER[ 'SCRIPT_NAME' ], 'wp-login.php' ) ) {
        return;
      }

      add_action( 'wp_enqueue_scripts', array( $this, 'wp_enqueue_scripts' ), 100 );
      add_action( 'wp_print_styles', array( $this, 'wp_print_styles' ), 100 );

      do_action( 'flawless::init_lower', $this );

    }

    /**
     * Admin Menu Handler
     *
     * @method admin_menu
     * @for Flawless
     */
    public function admin_menu() {
      self::log( 'Executed: Flawless::admin_menu();' );
      do_action( 'flawless::admin_menu', $this );
    }

    /**
     * Displays first-time setup splash screen
     *
     *
     * @since 0.0.2
     */
    public function admin_init() {
      self::log( 'Executed: Flawless::admin_init();' );
      do_action( 'flawless::admin_init', $this );
    }

    /**
     * Primary function for handling front-end actions
     *
     * @filter template_redirect ( 0 )
     * @since 0.0.2
     */
    public function template_redirect() {
      self::log( 'Executed: Flawless::template_redirect();' );

      // Load Template helpers.
      require_once( $this->state->computed->paths->helpers . '/template.php' );

      // Call template redirection - the front-end initializer.
      do_action( 'flawless::template_redirect', $this );
    }

    /**
     * Front-end script loading
     *
     * Loads all local and remote assets, checks conditionally loaded assets, etc.
     * Modifies body class based on loaded assets.
     *
     * @method wp_enqueue_scripts
     * @for Flawless
     *
     * @filter wp_enqueue_scripts ( 100 )
     * @since 0.0.2
     */
    public function wp_enqueue_scripts() {
      self::log( 'Executed: Flawless::wp_enqueue_scripts();' );

      // Enqueue Scripts in context.
      do_action( 'flawless::wp_enqueue_scripts', $this );

      // Load extra local assets in context.
      do_action( 'flawless::extra_local_assets', $this );

      // Enqueue compiled front-end library.
      wp_enqueue_script( 'flawless-app' );

    }

    /**
     * Enqueue Frontend Styles. Loaded late so plugin styles can be used for compiling and so theme CSS has more specificity.
     *
     * @method wp_print_styles
     * @for Flawless
     *
     * @filter wp_print_styles ( 100 )
     * @since 0.0.6
     */
    public function wp_print_styles() {
      self::log( 'Executed: Flawless::wp_print_styles();' );

      // Enqueue client-side styles.
      wp_enqueue_style( 'flawless-app', get_stylesheet_directory_uri() . '/public/styles/app.min.css', array(), Flawless_Version );

      // Print extra styles in context.
      do_action( 'flawless::wp_print_styles', $this );

    }

    /**
     * Get Setting.
     *
     * @method get
     *
     * @for Flawless
     * @author potanin@UD
     * @since 0.1.1
     */
    public function get( $key, $default ) {
      return Flawless::get_instance()->Settings->get( $key, $default );
    }

    /**
     * Set Setting.
     *
     * @method get
     * @for Flawless
     *
     * @author potanin@UD
     * @since 0.1.1
     */
    public function set( $key, $value ) {
      return Flawless::get_instance()->Settings->set( $key, $value );
    }

    /**
     * Class Logger
     *
     * (Not implemented, should reference Utility::log() or something);
     *
     * @method log
     * @for Flawless
     *
     * @author potanin@UD
     * @since 0.1.1
     */
    public function log( $data ) {}

    /**
     * Get the Flawless Singleton
     *
     * Concept based on the CodeIgniter get_instance() concept.
     *
     * @example
     *
     *      var settings = Flawless::get_instance()->Settings;
     *      var api = Flawless::$instance()->API;
     *
     * @static
     * @return object
     *
     * @method get_instance
     * @for Flawless
     *
     */
    public static function &get_instance() {
      return self::$instance;
    }

  }

  // Initialize the theme.
  new Flawless();

}
