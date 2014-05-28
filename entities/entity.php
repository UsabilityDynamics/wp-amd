<?php

namespace DiscoDonniePresents {

  if ( !class_exists( 'DiscoDonniePresents\Entity' ) ) {

    class Entity {

      /**
       *
       * @var type
       */
      public $_id;

      /**
       *
       * @var type
       */
      public $_post;

      /**
       *
       * @var type
       */
      public $_meta;

      /**
       *
       * @var type
       */
      public $_taxonomies;

      /**
       *
       * @param type $id
       */
      public function __construct( $id = null ) {

        if ( !$id ) {
          $id = get_the_ID();
        }

        $this->_id   = $id;

        $this->_post = $this->load_post();

        $this->_meta = $this->load_meta();

        $this->_taxonomies = $this->load_taxonomies();

      }

      /**
       *
       * @return type
       */
      private function load_post() {
        return get_post( $this->_id );
      }

      /**
       *
       * @return type
       */
      private function load_meta() {
        return get_metadata( 'post', $this->_id );
      }

      /**
       *
       * @return boolean
       */
      private function load_taxonomies() {

        $_taxonomies = get_post_taxonomies( $this->_id );

        $_return = array();

        if ( !empty( $_taxonomies ) ) {

          foreach( (array)$_taxonomies as $taxonomy_slug ) {

            $_return[$taxonomy_slug] = wp_get_post_terms( $this->_id, $taxonomy_slug );

          }

          if ( !empty( $_return ) ) return $_return;

        }

        return false;

      }

      /**
       * Getter for meta
       * @param type $key
       * @return type
       */
      public function meta( $key, $value = null ) {
        if ( !$value ) return $this->_meta[ $key ][0];

        $this->_meta[ $key ] = array( $value );
      }

      /**
       *
       */
      public function type() {
        return $this->_type;
      }

      /**
       *
       */
      public function post( $field ) {
        return $this->_post->{$field};
      }

      public function taxonomies( $slug, $format = 'link', $separator = ', ' ) {

        if ( empty( $this->_taxonomies[ $slug ] ) ) return false;

        switch( $format ) {

          case 'link':

            $links = array();

            foreach( $this->_taxonomies[ $slug ] as $term ) {
              $links[] = '<a href="'.get_term_link( $term->slug, $slug ).'">'.$term->name.'</a>';
            }

            return implode( $separator, $links );

            break;

          default: break;

        }

        return false;
      }

      /**
       *
       * @param type $param
       */
      public function toElastic($param) {

      }

    }

  }

}