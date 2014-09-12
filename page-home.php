<?php
/*
 * Template Name: Homepage
 */
get_header();

the_post();

ob_start();
dynamic_sidebar('header_widget_area');
$artist_lineup = ob_get_clean();

$artist_lineup = str_replace('}{', '},{', $artist_lineup);
$artist_lineup = '[' . $artist_lineup .']';

$artist_lineup = json_decode( $artist_lineup, true );
?>

<header>
  <section class="presenter-logos">
    <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/presenter-logos.png" alt="Disco Donnie Presents ultimo">
  </section>

  <h1 class="main-logo">
    <a href="/">
      <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/logo.png" alt="Monster Block Party">
    </a>
  </h1>

</header>

<?php if (! empty( $artist_lineup) ): ?>

<div class="diamond-box-container">

  <div class="container">
    <div class="diamond-box diamond-box-left">
      <div class="inner">
        <span class="icon-calendar"></span>

        <?php echo date( 'l', strtotime( $artist_lineup[0]['data'][ 'date' ] ) ); ?>
        <strong><?php echo date( 'M d', strtotime( $artist_lineup[0]['data'][ 'date' ] ) ); ?></strong>
      </div>
    </div>

    <div class="diamond-box diamond-box-right diamond-box-last">
      <div class="inner">
        <span class="icon-location"></span>

        <?php
          $loc = $artist_lineup[0]['data'][ 'location' ];
          $loc = explode( ' ', $loc );
          $last_word = array_pop( $loc );

          $loc = implode( ' ', $loc );
        ?>

        <?php echo $loc; ?>
        <strong><?php echo $last_word; ?></strong>
      </div>
    </div>

    <div class="faux-line faux-line-left"></div>
    <div class="faux-line faux-line-right"></div>
  </div>
</div>

<?php endif; ?>

<div class="clearfix"></div>
<div class="content-faux">
  <div class="content-container clearfix">
    <div class="triangle-top"></div>

    <div class="content-inner">
      <a href="https://www.eventbrite.com/e/freaks-beats-and-treats-2014-featuring-dj-bl3nd-tickets-13056683893" class="buy-tickets" target="_blank">
        <div class="inner">
          Buy
          <strong>Tickets</strong>
        </div>
      </a>

      <p class="main-content">&nbsp;</p>

      <h2>#FreaksBeatsTreats</h2>
      <hr>

      <div class="stream">
        <div class="container">
          <?php the_content(); ?>
        </div>
      </div>

    </div>
  </div>
</div>


<?php
  get_template_part('page-home', 'contest');
  get_footer();
?>



