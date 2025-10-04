(function ($) {
    "use strict";
  
    $(function () {
      var header = $(".start-style");
      $(window).scroll(function () {
        var scroll = $(window).scrollTop();
  
        if (scroll >= 10) {
          header.removeClass("start-style").addClass("scroll-on");
        } else {
          header.removeClass("scroll-on").addClass("start-style");
        }
      });
    });
  
    //Menu On Hover
  
    $("body").on("mouseenter mouseleave", ".nav-item", function (e) {
      if ($(window).width() > 767) {
        var _d = $(e.target).closest(".nav-item");
        _d.addClass("show");
        setTimeout(function () {
          _d[_d.is(":hover") ? "addClass" : "removeClass"]("show");
        }, 1);
      }
    });
    $("body").on("click", ".nav-item", function (e) {
      if ($(window).width() <= 767) {
        var p = $(e.target).closest(".nav-item");
        var s = $(e.target).closest(".nav-link");
        if (s.hasClass("show")) {
          p.addClass("show");
        } else {
          p.removeClass("show");
        }
      }
    });

    var nav = $(".nav-item");
    $("body").on("click", ".nav-item", function (e) {
        if ($(window).width() <= 750) {
        var p = $(e.target).closest(".nav-item");
        var s = $(e.target).closest(".nav-link");
        for (let i = 0; i < nav.length; i++) {
            let item = $(nav[i]);
            if (item.hasClass("show")) {
            item.removeClass("show");
            }
        }

        if (s.hasClass("show")) {
            p.addClass("show");
        } else {
            p.removeClass("show");
        }
        }
    });
    
 
  })(jQuery);