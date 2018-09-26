import $ from 'jquery'

window.addEventListener("load", () => {

  function toggleNav() {
    $($nav).toggleClass('active');
  }

  function hideNav() {
    if ( $nav.hasClass('active') ) {
      toggleNav();
    };
  }

  let $nav = $('.nav');
  let $nav_btn = $('.nav__btn');

  $($nav_btn).on('click', () => {
    toggleNav();
  });

  $(window).on('click', (e) => {
    let target = e.target;

    if ( !$nav.is(target) && $nav.has(target).length === 0 ) {
      hideNav();
    }

  });

  $(window).on('touchmove', (e) => {
    let target = e.target;

    if ( !$nav.is(target) && $nav.has(target).length === 0 ) {
      hideNav();
    }
  });

});
