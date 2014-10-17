<?php
/**
 *  Blog Loop
 */
?>

<?php get_template_part( 'templates/header' ); ?>

<?php get_template_part( 'templates/aside/header-image' ); ?>

  <main id="main" class="main" role="main">

    <section id="blog-loop">

      <?php
      // Doesn`t work this:
      // echo wp_festival2()->nav( 'blog', 1 );

      // Instead of this we list the categories with the wp function.
      $args = array(
        'parent' => 0,
        'orderby' => 'term_id'
      );
      $categories = get_categories( $args );

      $selected_text = null;
      
      ?>

      <nav class="category">
        <a <?php if( get_permalink( get_option('page_for_posts' ) ) == home_url( add_query_arg( array() ) ) ) { echo 'class="selected" '; $selected_text = 'All'; } ?> href="<?php echo get_permalink( get_option('page_for_posts' ) ) ?>">All</a>
        <?php foreach( $categories as $category ): ?>
          <a <?php if( get_category_link( $category->term_id ) == home_url( add_query_arg( array() ) ) ) { echo 'class="selected" '; $selected_text = $category->name; } ?> href="<?php echo get_category_link( $category->term_id ); ?>"><?php echo $category->name; ?></a>
        <?php endforeach; ?>
      </nav>

      <div class="mobile-nav">
        <a href="#" class="selected-category nav-closed"><?php echo $selected_text; ?>
          <span class="icon-triangle-down"></span></a>
        <?php if( $selected_text != 'All' ): ?>
          <a href="<?php echo get_permalink( get_option('page_for_posts' ) ) ?>">All</a>
        <?php endif; ?>
        <?php
        foreach( $categories as $category ):
          if( $selected_text != $category->name ): ?>
            <a href="<?php echo get_category_link( $category->term_id ); ?>"><?php echo $category->name; ?></a>
          <?php endif; ?>
        <?php endforeach; ?>
      </div>


      <div class="posts-list-container container" id="blog">

        <?php if( have_posts() ) : $i = 0; ?>
          <?php while( have_posts() ) : the_post();
            $i++; ?>
            <?php get_template_part( 'templates/article/content', wp_festival2()->get_query_template() ); ?>
            <?php if( $i % 3 == 0 ): ?>
              <div class="clearfix hidden-sm hidden-xs hidden-md"></div>
            <?php endif; ?>
          <?php endwhile; ?>
        <?php endif; ?>

      </div>

      <div class="clearfix"></div>

    </section>

    <section class="blog-pagination">
      <?php //wp_festival2()->page_navigation(); ?>
    </section>

    <!-- <section class="schedule-reserve container-fluid">
      <div class="row">
        <a href="#" class="col-xs-12 col-sm-6 schedule">
          <span>Lorem ipsum dolor sit amet, consectur</span>

          <h2>View Schedule</h2>
        </a>
        <a href="#" class="col-xs-12 col-sm-6 reserve">
          <span>Lorem ipsum dolor sit amet, consectur</span>

          <h2>Reserve Table</h2>
        </a>
      </div>
    </section> -->

  </main>

<?php get_template_part( 'templates/footer' ); ?>