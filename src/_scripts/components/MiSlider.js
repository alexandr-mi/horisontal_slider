import $ from 'jquery'

export default class MiSlider {
  constructor( slider_class, args ) {

    if ( args ) {
      this.args = {
        // Display controls
        arrows: 'arrows' in args ? args.arrows : false,
        dotes: 'dotes' in args ? args.dotes : true,
        // Animation options
        animation_duration: 'animation_duration' in args ? args.animation_duration : 1,
        animation_ease: 'animation_ease' in args ? args.animation_ease : 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        // Additional class
        class_slider: 'class_slider' in args ? args.class_slider : '',
        class_slider_list: 'class_slider_list' in args ? args.class_slider_list : '',
        class_slider_item: 'class_slider_item' in args ? args.class_slider_item : '',
        class_slider_dotes: 'class_slider_dotes' in args ? args.class_slider_dotes : '',
        class_slider_dot: 'class_slider_dot' in args ? args.class_slider_dot : '',
        class_arrows: 'class_arrows' in args ? args.class_arrows : '',
        class_arrow_left: 'class_arrow_left' in args ? args.class_arrow_left : '',
        class_arrow_right: 'class_arrow_right' in args ? args.class_arrow_right : '',
      };
    }

    this.slider = $(slider_class);
    $(this.slider).addClass(this.args.class_slider).css('position', 'relative');
    this.slider_item_amount = $(this.slider)[0].children.length;
    this.slider_list_node = this.get_slider_list_node();
    this.slider_dotes_node = this.get_slider_dotes_node();
    this.slider_arrows_node = this.get_slider_arrows_node();
    this.slider_index = 0;
    this.isFirefox = /Firefox/.test(navigator.userAgent);
    this.slider_width = $(this.slider)[0].clientWidth;


    this.slider_position = 0;

    this.init();
  }

  get_slider_list_node() {
    let slider_list;

    slider_list = $('<div>')
      .addClass(`mi_slider__list ${ this.args.class_slider_list }`)
      .css(
        {
          width: `${100 * this.slider_item_amount}%`,
          height: '100%',
        })
      .append( () => this.get_slider_item_node() );

    return slider_list;
  }

  get_slider_item_node() {
    let slider_item = $(this.slider)[0].children;
    let slider_item_clone = $(slider_item).clone();

    $(slider_item_clone)
      .addClass(`mi_slider__item ${ this.args.class_slider_item }`)
      .css(
        {
          width: `${100 / this.slider_item_amount}%`,
          height: '100%'
        });

    return slider_item_clone
  }

  get_slider_dotes_node() {
    let slider_dotes;

    slider_dotes = $('<div>')
      .addClass(`mi_slider__dotes ${ this.args.class_slider_dotes }`)
      .append(() => {
        let slider_dot = '';


        for (let i = 0; i < this.slider_item_amount; i++) {
          slider_dot += `<div class="mi_slider__dot ${ i === 0 ? 'is_active' : '' } ${ this.args.class_slider_dot }"></div>`;
        }

        return slider_dot
      });

    return slider_dotes
  }

  get_slider_arrows_node() {
    let slider_arrows;

    slider_arrows = $('<div></div>')
      .addClass(`mi_slider__arrows ${ this.args.class_arrows }`)
      .append(() => {
        let arrows =
          `<div class="mi_slider__arrow mi_slider__arrow-prev ${ this.args.class_arrow_left }"></div>
           <div class="mi_slider__arrow mi_slider__arrow-next ${ this.args.class_arrow_right }"></div>`;

        return arrows
      });

    return slider_arrows
  }

  clear_slider() {
    $(this.slider).empty();
  }

  add_elements_to_slider() {
    $(this.slider).append(this.slider_list_node);
    if ( this.args.dotes ) { $(this.slider).append(this.slider_dotes_node); }
    if ( this.args.arrows ) { $(this.slider).append(this.slider_arrows_node); }
  }

  set_slider_position( distance, animation_time, animation_ease ) {

    if ( this.isFirefox ) {
      distance = Math.pow(distance, 3)
    }

    if ( isNaN(distance) ) {
      distance = 0
    }

    this.slider_position += distance;

    if ( this.slider_position <= 0 ) {
      this.slider_position = 0
    } else if ( this.slider_position >= this.slider_width * (this.slider_item_amount - 1)) {
      this.slider_position = this.slider_width * (this.slider_item_amount - 1);
    }

    $(this.slider_list).css({
      'transform': `translateX(-${this.slider_position}px)`,
      'transition' : `transform ${ animation_time || this.args.animation_duration }s ${ animation_ease || this.args.animation_ease }`
    });

    this.slider_index = parseInt((this.slider_position + this.slider_width/2)/this.slider_width);
    this.set_active_slider_dot( this.slider_index );
    this.parallax_visible_slider_item();
  }

  move_slider_on_scroll( distance, animation_time, animation_ease ) {
    window.requestAnimationFrame(() => {
      this.set_slider_position( distance, animation_time, animation_ease );
    });
  }

  move_slider_on_dot_click( index ) {

    let position = ( this.slider_width * index ) - this.slider_position;

    this.set_slider_position( position );
  }

  move_slider_on_prev() {
    let position = this.slider_width*(this.slider_index - 1) - this.slider_position;
    this.move_slider_on_scroll( position );
  }
  move_slider_on_next() {
    let position = this.slider_width*(this.slider_index + 1) - this.slider_position;
    this.move_slider_on_scroll( position );
  }

  set_active_slider_dot( index ) {
    $(this.slider_dot).removeClass('is_active');
    $(this.slider_dot[index]).addClass('is_active');
  }

  get_visible_slider_item() {

    let left_border = this.slider_position/this.slider_width;
    let left_index = parseInt(left_border);
    let left_percent = (Number((left_border%1).toFixed(3)) + 1)/2;

    let right_border = ((this.slider_position + this.slider_width)/this.slider_width) - 0.001;
    let right_index = parseInt(right_border);
    let right_percent = (Number(right_border%1).toFixed(3))/2;

    let result = [];


    if ( left_index === right_index ) {
      if ( left_index === 0 ) {
        result.push({ index: left_index, percent: left_percent }, { index: right_index + 1, percent: 0.1 })
      } else {
        result.push({ index: right_index - 1, percent: 0.999 }, { index: right_index, percent: right_percent })
      }
      result.push({ index: left_index, percent: left_percent })
    } else {
      result.push({ index: left_index, percent: left_percent }, { index: right_index, percent: right_percent })
    }

    return result
  }

  parallax_visible_slider_item() {
    let data = this.get_visible_slider_item();

    for (let i = 0; i < data.length; i++) {

      let index = data[i].index;
      let item_percent = data[i].percent;
      let item = this.parallax__elemen[index];
      let k = item_percent * this.slider_width;

      if ( item.length > 0 ) {
        for (let j = 0; j < item.length; j++) {
          let item_range = Number(item[j].getAttribute('parallax-range'));

          let translate = (k * item_range) - (item_range*this.slider_width)/2;

          $(item[j]).css("transform", `translateX(${ -translate }px)`);
        }
      };
    }
  }

  create_element_variables() {
    this.slider_list = $('.mi_slider__list');
    this.slider_item = $('.mi_slider__item');
    this.slider_dotes = $('.mi_slider__dotes');
    this.slider_dot = $('.mi_slider__dot');
    this.slider_prev = $('.mi_slider__arrow-prev');
    this.slider_next = $('.mi_slider__arrow-next');


    this.parallax__elemen = [];

    for (let i = 0; i < this.slider_item_amount; i++) {

      let parallax = $(this.slider_item[i])[0].querySelectorAll('.parallax');
      this.parallax__elemen[i] = [...parallax];

    }
  }

  on_event_listener() {

    $( window ).resize( () => {

      this.slider_width = $(this.slider)[0].clientWidth;
    });

    $(this.slider).on('wheel', ( e ) => {

      let scroll_size = e.originalEvent.deltaY;


      this.set_slider_position( scroll_size )

    });

    $(this.slider_dot).on('click', ( e ) => {
      let dot = e.currentTarget;
      let index = $(dot).index();

      this.set_active_slider_dot( index );

      this.move_slider_on_dot_click( index )
    });

    $(this.slider).on('touchstart', (e) => {
      this.slider_touch_move = e.changedTouches[0].clientX;
    });

    $(this.slider).on('touchmove', (e) => {
      let slider_touch_move = e.changedTouches[0].clientX;

      let touch_distance = -(slider_touch_move - this.slider_touch_move);

      this.slider_touch_move = slider_touch_move;

      this.set_slider_position( touch_distance*2 );
    });

    $(this.slider_prev).on('click', () => {
      this.move_slider_on_prev()
    });
    $(this.slider_next).on('click', () => {
      this.move_slider_on_next()
    });

  }

  init() {
    this.clear_slider();
    this.add_elements_to_slider();
    this.create_element_variables();

    this.parallax_visible_slider_item();
    this.on_event_listener();
  }
}
