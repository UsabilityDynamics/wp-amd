<?php
/**
 * Listing Box for Regular Posts
 *
 * Rendered when displaying search results and archive listsings.
 *
 * @author Usability Dynamics
 * @module festival
 * @since festival 0.1.0
 */
?>
<article <?php post_class( 'listing-default' ); ?> data-type="<?php get_post_type(); ?>">
  <header class="entry-header">
    <h2 class="entry-title"><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h2>
  </header>
  <blockquote class="entry-excerpt"><?php the_excerpt(); ?></blockquote>
  <section class="footer entry-meta">
    <span class="entry-date"><?php the_time( 'F j' ); ?></span>
  </section>
</article>