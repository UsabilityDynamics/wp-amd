<!DOCTYPE html>
<html>
  <head>
    <title><?php wp_title( '|', true, 'right' ); ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
  </head>
  <body>
    <article class="container">
      <h1 class="site-title"><?php bloginfo( 'name' ); ?></h1>
      <p class="site-description"><?php bloginfo( 'description' ); ?></p>
    </article>
    <footer class="header"></footer>
  </body>
  <?php wp_footer(); ?>
</html>
