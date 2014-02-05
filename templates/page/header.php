<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="main">
 *
 * @author Usability Dynamics
 * @module festival  
 * @since festival 0.1.0
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
  <head>
    <title><?php wp_title( '|', true, 'right' ); ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <?php wp_head(); ?>
  </head>
  
  <body <?php body_class(); ?> style="background-image: url(<?php echo get_background_image(); ?>)" data-post-type="<?php get_post_type(); ?>" data-requires="site">

    <header class="header">
      <div class="container">
          <?php wp_festival()->aside( 'header' ); ?>
      </div>
    </header>

    <header class="banner-poster">
      <div class="container">
        <?php wp_festival()->aside( 'banner' ); ?>
      </div>
    </header>

    <?php get_template_part( 'templates/nav/top', get_post_type() ); ?>
    
    <div class="container-wrap" style="background-color:<?php echo get_option( 'content_bg_color', '#fcfcf9' ); ?>">
    