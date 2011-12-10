(function() {
  var $, ScrollCal;
  $ = jQuery;
  $.fn.extend({
    scrollCal: function(options) {
      var settings;
      settings = {
        yearRange: [1990, 2024]
      };
      settings = $.extend(settings, options);
      return this.each(function() {
        return new ScrollCal(this, settings);
      });
    }
  });
  ScrollCal = (function() {
    ScrollCal.prototype.DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    ScrollCal.prototype.MONTH_LABELS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    ScrollCal.prototype.MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    ScrollCal.prototype.CURRENT_DATE = new Date();
    function ScrollCal(element, settings) {
      this.element = element;
      this.settings = settings;
      this.$el = $(this.element);
      this.months = this.settings.months;
      this.day = this.$el.data('day') || (this.CURRENT_DATE.getDay() + 8) % 7;
      this.month = this.$el.data('month') || this.CURRENT_DATE.getMonth();
      this.year = this.$el.data('year') || this.CURRENT_DATE.getFullYear();
      this.createCal();
      $('.scrollCal__mainFrame').html(this.generateMonthsCalForYear(this.year));
      $('.scrollCal__monthFrame').html(this.generateMonthSlider());
      $('.scrollCal__yearFrame').html(this.generateYearSlider(this.settings.yearRange));
      $('.scrollCal').offset({
        left: $(this.element).offset().left
      });
      $('.scrollCal__mainFrame').bind("mousewheel", function(e, delta) {
        var k, mh, sh, st;
        e.preventDefault();
        st = $(this).scrollTop();
        $(this).scrollTop(st - Math.ceil(delta * 100));
        sh = $('.scrollCal__calendar-wrapper').height();
        mh = $('.scrollCal__monthFrame').height();
        k = mh / sh;
        return $('.scrollCal__month-indicator').css({
          top: st * k
        });
      });
      $('.scrollCal__monthFrame').bind("mousewheel", function(e, delta) {
        var indicator, k, mh, sh, st;
        e.preventDefault();
        indicator = $(this).find('.scrollCal__month-indicator');
        st = parseInt(indicator.css('top'));
        sh = $('.scrollCal__calendar-wrapper').height();
        mh = $('.scrollCal__monthFrame').height();
        k = sh / mh;
        if (st >= 0 && st <= mh - 50) {
          $(this).find('.scrollCal__month-indicator').css('top', st - Math.floor(delta * 100));
          return $('.scrollCal__mainFrame').scrollTop(st * k);
        } else if (st < 0) {
          return $(this).find('.scrollCal__month-indicator').css('top', 0);
        } else if (st > mh - 50) {
          return $(this).find('.scrollCal__month-indicator').css('top', mh - 50);
        }
      });
      $('.scrollCal__yearFrame').bind("mousewheel", function(e, delta) {
        var st;
        e.preventDefault();
        st = $(this).scrollTop();
        return $(this).scrollTop(st - Math.ceil(delta * 100));
      });
    }
    ScrollCal.prototype.createCal = function() {
      return this.$el.after("<div class='scrollCal'>                  <div class='scrollCalSection scrollCal__mainFrame'></div>                  <div class='scrollCalSection scrollCal__monthFrame'></div>                  <div class='scrollCalSection scrollCal__yearFrame'></div>                </div>");
    };
    ScrollCal.prototype.generateMonthCal = function(year, month) {
      var day, firstDay, html, monthLength, monthName, startingDay, week, weekday, _i, _len, _ref;
      firstDay = new Date(year, month, 1);
      startingDay = (firstDay.getDay() + 6) % 7;
      monthLength = this.MONTH_DAYS[month];
      if (month === 1) {
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          monthLength = 29;
        }
      }
      monthName = this.MONTH_LABELS[month];
      html = [];
      html.push("<table class='scrollCal__calendar'>");
      html.push("<tr><th colspan='7'>" + monthName + "</th></tr>");
      html.push("<tr class='scrollCal__calendar-header'>");
      _ref = this.DAY_LABELS;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        day = _ref[_i];
        html.push("<td class='scrollCal__calendar-header-day'>" + day + "</td>");
      }
      html.push("</tr><tr>");
      day = 1;
      for (week = 0; week <= 6; week++) {
        for (weekday = 0; weekday <= 6; weekday++) {
          html.push("<td class='scrollCal__calendar-day'>");
          if (day <= monthLength && (week > 0 || weekday >= startingDay)) {
            html.push(day);
            day++;
          }
          html.push("</td>");
        }
        if (day > monthLength) {
          break;
        } else {
          html.push("</tr><tr>");
        }
      }
      html.push("</tr></table>");
      return html.join("");
    };
    ScrollCal.prototype.generateMonthsCalForYear = function(year) {
      var html, m;
      html = [];
      html.push("<div class='scrollCal__calendar-wrapper'>");
      for (m = 0; m <= 11; m++) {
        html.push(this.generateMonthCal(year, m));
      }
      html.push("</div>");
      return html.join("");
    };
    ScrollCal.prototype.generateMonthSlider = function() {
      var html, month, _i, _len, _ref;
      html = [];
      _ref = this.MONTH_LABELS;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        month = _ref[_i];
        html.push("<a class='scrollCal__month-item'>" + month + "</a>");
      }
      html.push("<div class='scrollCal__month-indicator'></div>");
      return html.join("");
    };
    ScrollCal.prototype.generateYearSlider = function(yearRange) {
      var html, y, _ref, _ref2;
      html = [];
      for (y = _ref = yearRange[0], _ref2 = yearRange[1]; _ref <= _ref2 ? y <= _ref2 : y >= _ref2; _ref <= _ref2 ? y++ : y--) {
        html.push("<a class='scrollCal__year-item'>" + y + "</a>");
      }
      return html.join("");
    };
    return ScrollCal;
  })();
}).call(this);
