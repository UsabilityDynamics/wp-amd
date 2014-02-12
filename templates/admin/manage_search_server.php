<?php
/**
 * Server Configuration template
 * @author korotkov@ud
 */

$search_settings = wp_disco()->get('search');
?>
<div class="wrap">

  <h2><?php _e('Server Configuration', DOMAIN_CURRENT_SITE) ?></h2>

  <p class="description"><?php _e('ElasticSearch server configuration area.', DOMAIN_CURRENT_SITE) ?></p>

  <form action="" method="post">
    <table class="form-table">
      <tbody>
        <tr valign="top">
          <th scope="row">
            <label for="server_address"><?php _e('Server Address', DOMAIN_CURRENT_SITE); ?></label>
          </th>
          <td>
            <input type="text" class="regular-text" value="<?php echo $search_settings['server'] ?>" id="server_address" name="configuration[search.server]">
            <p class="description"><?php _e('e.g. http://127.0.0.1:9200/ (with the trailing slash)', DOMAIN_CURRENT_SITE); ?></p>
          </td>
        </tr>
        <tr valign="top">
          <th scope="row">
            <label for="search_index"><?php _e('Search Index', DOMAIN_CURRENT_SITE); ?></label>
          </th>
          <td>
            <input type="text" class="regular-text" value="<?php echo $search_settings['index'] ?>" id="search_index" name="configuration[search.index]">
            <p class="description"><?php _e('The ElasticSearch Index you are about to use.', DOMAIN_CURRENT_SITE); ?></p>
          </td>
        </tr>
      </tbody>
    </table>
    <?php submit_button(); ?>
  </form>

</div>