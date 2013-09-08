<?php
/**
 * Template for archives and categories.
 *
 *
 * @author Usability Dynamics, Inc. <info@usabilitydynamics.com>
 * @module Flawless
*/

  //** Bail out if page is being loaded directly and Flawless does not exist */
  if(!function_exists('get_header')) {
    die();
  }

  if( !have_posts() && $flawless[ 'no_search_result_page' ] ) {
    die( wp_redirect(get_permalink($flawless[ 'no_search_result_page' ])) );
  }

?>

<?php get_template_part( 'templates/header',  'search' ) ?>

<?php get_template_part( 'templates/attention', 'search' ); ?>

<div class="<?php flawless_wrapper_class(); ?>">

  <?php flawless_widget_area( 'left_sidebar' ); ?>

  <div class="<?php flawless_block_class( 'main cfct-block' ); ?>">
    <div class="<?php flawless_module_class(); ?>">

      <header class="entry-title-wrapper">
        <?php flawless_breadcrumbs(); ?>
        <?php flawless_page_title(); ?>
      </header>

      <?php get_template_part( 'templates/loop', 'blog' ); ?>

    </div><!-- flawless_module_class() -->

  </div>

  <?php flawless_widget_area( 'right_sidebar' ); ?>

</div>

<?php get_template_part( 'templates/footer' ); ?>