<?php 
/**
 * Module: Artist-List
 * Template: A-List
 * Description: Primary List
 *
 */

global $wp_query;

extract( $wp_query->data );

$enable_links = ( isset( $enable_links ) && $enable_links == 'true' ) ? true : false;
$enable_dates = ( isset( $enable_dates ) && $enable_dates == 'true' ) ? true : false;
$date = false;
if( $enable_dates ) {
  if( !empty( $custom_date[ get_the_ID() ] ) ) {
    $date = strtotime( $custom_date[ get_the_ID() ] );
  } else {
    $date = wp_festival()->get_artist_perfomance_date( get_the_ID() );
  }
}

$fcolor = !empty( $font_color ) ? "color: {$font_color} !important;" : "";

// Try to get Image
$src = wp_festival()->get_artist_image_link( get_the_ID(), array(
  'type' => $artist_image,
  'width' => $map[ 2 ], 
  'height' => $map[ 3 ],
) );
 
?>
<article class="artist-preview" data-type="<?php get_post_type(); ?>">
  <?php if( $enable_dates ) : ?>
    <div class="date">
      <?php if( $date ) : ?>
        <span class="week-day" style="<?php echo $fcolor; ?>"><?php echo date( 'l', $date ); ?>,</span> <span class="month"><?php echo date( 'M', $date ); ?></span> <span class="day"><?php echo date( 'j', $date ); ?></span>
        <span class="hr"></span>
        <div class="clearfix"></div>
      <?php endif; ?>
    </div>
  <?php endif; ?>
  <?php if( $enable_links ) : ?>
    <a href="<?php the_permalink(); ?>">
  <?php endif; ?>
    <div class="image">
      <img class="img-responsive" src="<?php echo $src; ?>" alt="<?php the_title(); ?>" />
      <div class="caption"><?php the_title(); ?></div>
    </div>
  <?php if( $enable_links ) : ?>
    </a>
  <?php endif; ?>
</article>