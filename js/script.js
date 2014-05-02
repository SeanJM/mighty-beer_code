function setNav() {
  var exe = {
    mobile: function () {
      var setNavArray = [];
      var nav = $('#nav-control');
      $('[data-setNav]').each(function () {
        setNavArray.push({
          el: $(this),
          top: $(this).offset().top,
          value: $(this).attr('data-setNav')
        });
      });
      function navColor() {
        var out,
            i         = 0,
            scrollTop = $(window).scrollTop()+(nav.height()/2),
            offset;

        while (typeof setNavArray[i] !== 'undefined') {
          offset = setNavArray[i].el.offset().top;
          // Check to make sure the offset is correct
          // the JavaScript event for filling the array
          // can occur before the CSS loads all the images
          // This way, no matter when the array is filled
          // it will always have the correct top offset
          if (setNavArray[i].top !== offset) {
            setNavArray[i].top = offset;
          }
          if (scrollTop >= setNavArray[i].top) {
            out = 'setNav_' + setNavArray[i].value;
          }
          i++;
        }

        nav.attr('class',nav.attr('class').replace(/(\s|)setNav_[a-z]+(\s|)/,''));
        nav.addClass(out);
      }
      dingo.touchmove['body'] = function (options) {
        navColor();
      }
      dingo.scroll['window'] = function (options) {
        navColor();
      }
      dingo.scroll['window']();
    },
    desktop: function () {
      var navBg   = $('#nav-bg');
      var topInit = navBg.height()*-1;
      var navStop = $('.navStop').eq(0);
      function transition() {
        dingo.scroll['window'] = function (options) {
          var scrollTop  = $(window).scrollTop();
          if (scrollTop >= navStop.outerHeight()) {
            animate($('#nav')).start();
          } else if ($('#nav').hasClass('_animated-in')) {
            animate($('#nav')).end();
          }
        }
      }
      transition();
    }
  }
  if (dingo.isMobile()) {
    exe.mobile();
  } else {
    exe.desktop();
  }
}

function clickDelay() {
  $('body').addClass('click-delay');
  setTimeout(function () {
    $('body').removeClass('click-delay');
  },300);
}

function closeNav() {
  animate($('#app-container')).end();
}

function openNav() {
  animate($('#app-container')).start();
}

function toggleNav() {
  if ($('#app-container').hasClass('_animated-in')) {
    closeNav();
  } else {
    openNav();
  }
  clickDelay();
}

// Prevents the nav from popping up if the user
// scrolls and the 'touchend' event occurs on the
// nav and that was not their intention.
dingo.touchstart['nav-control'] = function (options) {
  dingo.touchend['nav-control'] = function (options) {
    toggleNav();
    dingo.touchend['nav-control'] = false;
  }
}

dingo.mouseup['nav-control'] = function (options) {
  toggleNav();
}

function bodyNav(options) {
  if ($(options.event.target).closest('.main').size() || $(options.event.target).closest('.nav').size()) {
    if ($('#app-container').hasClass('_animated-in')) {
      // This is for mobile safari, if too many things are
      // happening at the same time, the links fail to function
      setTimeout(closeNav,300);
    }
    if ($(options.event.target).closest('.nav').size()) {
      clickDelay();
    }
  }
  if (options.el.hasClass('click-delay')) {
    options.event.preventDefault();
  }
}

dingo.touchend['body'] = function (options) {
  bodyNav(options);
}

dingo.mouseup['body'] = function (options) {
  bodyNav(options);
}

$(function () {
  dingo.init();
  setNav();
});