<?php
/**
 * Festival News
 *
 * @author Usability Dynamics
 * @module wp-festival
 * @since wp-festival 2.0.0
 */

global $wp_query;

extract( $data = wp_festival2()->extend( array(
  'title' => '',
  'content' => '',
), (array)$wp_query->data ) );

?>

<?php if( $wp_query->have_posts() ) : ?>
<div class="container">
  <div class="posts-loop-module">
    <div class="row">
      <div class="col-md-12">
        <div class="carousel-wrap ">
          <h3><?php echo $title; ?><br/><small><?php echo $content; ?></small></h3>
          <!-- Full size carousel -->
          <div id="carousel-generic" class="carousel slide hidden-sm hidden-xs" data-ride="carousel">
            <div class="carousel-inner">
              <div class="item active">
                <div class="row">
                  <?php wp_festival2()->set_excerpt_filter( '25', 'length' ); $counter = 0; ?>
                  <?php while( $wp_query->have_posts() ) : $wp_query->the_post(); ?>
                    <?php if( $counter && !( $counter % 3 ) ) : ?>
                      </div></div>
                      <div class="item <?php $counter ? '' : 'active'; ?>">
                        <div class="row">
                    <?php endif; ?>
                    <div class="col-md-4 col-sm-4">
                      <?php $img = wp_festival2()->get_image_link_by_post_id( get_the_ID(), array( 'width' => '640', 'height' => '360', 'crop' => true ) ); ?>
                      <?php if( !empty( $img ) ) : ?>
                        <a href="<?php the_permalink(); ?>"><img class="img-responsive" src="<?php echo $img; ?>" alt="" /></a>
                      <?php endif; ?>
                      <div class="description">
                        <span class="date"><?php the_time('l, F j'); ?></span>
                        <span class="hr"></span>
                        <a href="<?php the_permalink(); ?>"><h5><?php the_title(); ?></h5></a>
                        <p><?php the_excerpt(); ?></p>
                      </div>
                    </div>
                    <?php $counter++; ?>
                  <?php endwhile; ?>
                  <?php wp_festival2()->set_excerpt_filter( false, 'length' ); ?>
                </div>
              </div>
            </div>
            <?php if( $counter > 3 ) : ?>
            <ol class="carousel-indicators">
              <?php $step = 0; ?>
              <?php for( $i = 0; $i < $counter; $i+=3 ) : ?>
                <li data-target="#carousel-generic" data-slide-to="<?php echo $step ?>" class="<?php echo $step++ ? '' : 'active'; ?>"></li>
              <?php endfor; ?>
            </ol>
            <?php endif; ?>
          </div>

          <!-- Small size carousel -->
          <div id="carousel-small" class="carousel slide hidden-md hidden-lg" data-ride="carousel-small">
            <div class="carousel-inner">
              <?php wp_festival2()->set_excerpt_filter( '25', 'length' ); $counter = 0; ?>
                <?php while( $wp_query->have_posts() ) : $wp_query->the_post(); ?>
                  <div class="item <?php echo $counter ? '' : 'active'; ?>">
                    <?php $img = wp_festival2()->get_image_link_by_post_id( get_the_ID(), array( 'width' => '738', 'height' => '350' ) ); ?>
                    <?php if( !empty( $img ) ) : ?>
                      <a href="<?php the_permalink(); ?>"><img class="img-responsive" src="<?php echo $img; ?>" alt="" /></a>
                    <?php endif; ?>
                    <div class="description">
                      <span class="date"><?php the_time('l, F j'); ?></span>
                      <span class="hr"></span>
                      <a href="<?php the_permalink(); ?>"><h5><?php the_title(); ?></h5></a>
                      <p><?php the_excerpt(); ?></p>
                    </div>
                  </div>
                  <?php $counter++; ?>
                <?php endwhile; ?>
              <?php wp_festival2()->set_excerpt_filter( false, 'length' ); ?>
            </div>
            <?php if( $counter > 1 ) : ?>
            <ol class="carousel-indicators">
              <?php $step = 0; ?>
              <?php for( $i = 0; $i < $counter; $i++ ) : ?>
                <li data-target="#carousel-small" data-slide-to="<?php echo $step ?>" class="<?php echo $step++ ? '' : 'active'; ?>"></li>
              <?php endfor; ?>
            </ol>
            <?php endif; ?>
          </div>
        </div><!-- /carousel-wrap -->
      </div>
    </div>
  </div>
</div>
<?php endif; ?>

