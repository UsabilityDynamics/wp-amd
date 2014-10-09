<p>
  <label for="<?php echo $this->get_field_id( 'title' ); ?>">Title</label>
  <br><br>
  <input class="widefat" name="<?php echo $this->get_field_name( 'title' ); ?>" id="<?php echo $this->get_field_id( 'title' ); ?>" value="<?php echo $data[ 'title' ]; ?>" >
</p>

<p>
  <label for="<?php echo $this->get_field_id( 'description' ); ?>">Description</label>
  <br><br>
  <textarea class="widefat" name="<?php echo $this->get_field_name( 'description' ); ?>" id="<?php echo $this->get_field_id( 'description' ); ?>"><?php echo $data[ 'description' ]; ?></textarea>
</p>

<p>
  <label for="<?php echo $this->get_field_id( 'url' ); ?>">URL</label>
  <br><br>
  <input class="widefat" name="<?php echo $this->get_field_name( 'url' ); ?>" id="<?php echo $this->get_field_id( 'url' ); ?>" value="<?php echo $data[ 'url' ]; ?>" >
</p>

<p>
  <label for="<?php echo $this->get_field_id( 'background' ); ?>">Background</label>
  <br><br>
  <select name="<?php echo $this->get_field_name( 'background' ); ?>" id="<?php echo $this->get_field_id( 'background' ); ?>">
    <option value="0">Lighter</option>
    <option value="1" <?php if( $data[ 'background' ] ) echo 'selected="selected"'; ?> >Darker</option>
  </select>
</p>

<?php if( !empty( $data[ 'images' ][ 'meta' ][ 'sel_image' ] ) ): ?>
  <p>
    <img id="organizer-item-widget-selected-image" src="<?php echo $data[ 'images' ][ 'meta' ][ 'sel_image' ]; ?>" alt="Selected Image">
  </p>
<?php endif; ?>
<p>
  <label for="<?php echo $this->get_field_id( 'image' ); ?>"><strong>Select an image</strong></label>
  <br><br>

  <select class="widefat organizer-item-widget-image" name="<?php echo $this->get_field_name( 'image' ); ?>" id="<?php echo $this->get_field_id( 'image' ); ?>">
    <?php foreach( $data[ 'images' ][ 'data' ] as $key => $image ):
      ?>
      <option value="<?php echo $image[ 'src' ]; ?>" <?php if( $image[ 'selected' ] ) echo 'selected="selected"'; ?> ><?php echo $image[ 'name' ]; ?></option>
    <?php endforeach; ?>
  </select>
</p>

<input type="hidden" value="<?php echo $data[ 'images' ][ 'meta' ][ 'sel_image_id' ]; ?>" name="<?php echo $this->get_field_name( 'image_image_id' ); ?>" id="<?php echo $this->get_field_id( 'image_image_id' ); ?>">