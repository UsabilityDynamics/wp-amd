<?php
/**
 * Festival Bootstrap
 *
 * @version 0.1.0
 * @author Usability Dynamics
 * @namespace UsabilityDynamics
 */
namespace UsabilityDynamics\Festival2 {

  /**
   * Festival Bootstrap
   *
   * @author Usability Dynamics
   */
  final class Bootstrap {

    /**
     * Instance.
     *
     * @var $instance
     */
    static private $instance;

    /**
     * Class Initializer
     *
     * @author Usability Dynamics
     * @since 0.1.0
     */
    public function __construct() {

      if( !class_exists( '\UsabilityDynamics\Festival2' ) ) {
        wp_die( '<h1>Fatal Error</h1><p>Festival Theme not found.</p>' );
      }

      // Instantaite Disco.
      $this->theme = new \UsabilityDynamics\Festival2;

      // Init our widgets
      add_action( 'widgets_init', array( __CLASS__, 'register_widgets' ) );

    }

    /**
     * Determine if instance already exists and Return Theme Instance
     *
     */
    public static function get_instance() {
      return null === self::$instance ? self::$instance = new self() : self::$instance->theme;
    }

    /**
     * Register our specific widgets
     */
    public static function register_widgets(){
      if( !class_exists( 'UsabilityDynamics_Festival2_Widget_Posts_Slider' ) ){
        require_once( __DIR__ . '/modules/posts-slider/posts-slider.php' );
      }
      register_widget( 'UsabilityDynamics_Festival2_Widget_Posts_Slider' );

      if( !class_exists( 'UsabilityDynamics_Festival2_Widget_Feature_Item' ) ){
        require_once( __DIR__ . '/modules/feature-item/feature-item.php' );
      }
      register_widget( 'UsabilityDynamics_Festival2_Widget_Feature_Item' );

      if( !class_exists( 'UsabilityDynamics_Festival2_Widget_Callout_Item' ) ){
        require_once( __DIR__ . '/modules/callout-item/callout-item.php' );
      }
      register_widget( 'UsabilityDynamics_Festival2_Widget_Callout_Item' );

      if( !class_exists( 'UsabilityDynamics_Festival2_Widget_News_Block' ) ){
        require_once( __DIR__ . '/modules/news-block/news-block.php' );
      }
      register_widget( 'UsabilityDynamics_Festival2_Widget_News_Block' );

      if( !class_exists( 'UsabilityDynamics_Festival2_Widget_Company_Item' ) ){
        require_once( __DIR__ . '/modules/company-item/company-item.php' );
      }
      register_widget( 'UsabilityDynamics_Festival2_Widget_Company_Item' );

      if( !class_exists( 'UsabilityDynamics_Festival2_Widget_Video' ) ){
        require_once( __DIR__ . '/modules/video/video.php' );
      }
      register_widget( 'UsabilityDynamics_Festival2_Widget_Video' );

      // Add shortcode for callout item widget
      add_shortcode( 'widget_callout_item', function( $atts ) {
        // Configure defaults and extract the attributes into variables
        extract( shortcode_atts( array(
          'action' => '',
          'text' => '',
          'url' => ''
        ), $atts ) );

        ob_start();

        the_widget( 'UsabilityDynamics_Festival2_Widget_Callout_Item', $atts, $args );

        $output = ob_get_clean();

        return $output;

      });

      // Add shortcode for news block widget
      add_shortcode( 'widget_news_block', function( $atts ) {
        // Configure defaults and extract the attributes into variables
        extract( shortcode_atts( array(
          'featured' => '',
        ), $atts ) );

        ob_start();

        the_widget( 'UsabilityDynamics_Festival2_Widget_News_Block', $atts, $args );

        $output = ob_get_clean();

        return $output;

      });


      // Add shortcode for video widget
      add_shortcode( 'widget_video', function( $atts ) {
        // Configure defaults and extract the attributes into variables
        extract( shortcode_atts( array(
          'code' => '',
        ), $atts ) );

        ob_start();

        the_widget( 'UsabilityDynamics_Festival2_Widget_Video', $atts, $args );

        $output = ob_get_clean();

        return $output;

      });

    }

  }

}
