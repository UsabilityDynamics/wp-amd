<?php
/**
 * Template for archives and categories.
 *
 *
 * @author Usability Dynamics, Inc. <info@usabilitydynamics.com>
 * @package WP-Disco
*/

  //** Bail out if page is being loaded directly and flawless_theme does not exist */
  if(!function_exists('get_header')) {
    die();
  }

  if( !have_posts() && $flawless[ 'no_search_result_page' ] ) {
    die( wp_redirect(get_permalink($flawless[ 'no_search_result_page' ])) );
  }

?>

<?php get_template_part( 'templates/header', 'search' ) ?>

<?php get_template_part( 'templates/aside/attention', 'search' ); ?>

<div class="<?php wp_disco()->wrapper_class( ); ?>">

  <?php wp_disco()->widget_area( 'left_sidebar' ); ?>

  <div class="<?php wp_disco()->block_class( 'main cfct-block' ); ?>">
    <div class="<?php wp_disco()->module_class(); ?>">

      <header class="entry-title-wrapper">
        <?php wp_disco()->breadcrumbs(); ?>
        <?php wp_disco()->page_title(); ?>
      </header>

      <?php get_template_part( 'templates/article/loop', 'blog' ); ?>

    </div><!-- flawless_module_class() -->

  </div>

  <?php wp_disco()->widget_area( 'right_sidebar' ); ?>

</div>

<?php get_template_part( 'templates/footer', 'search' ) ?>
