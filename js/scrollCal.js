(function() {
  var $, ScrollCal;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
      this.setYearInScroll(this.year);
      $('.scrollCal').offset({
        left: $(this.element).offset().left
      });
      $('.scrollCal__mainFrame').bind("mousewheel", function(e) {
        var delta, k, mh, sh, st;
        e.preventDefault();
        delta = e.originalEvent.wheelDelta;
        st = $(this).scrollTop();
        $(this).scrollTop(st - delta);
        sh = $('.scrollCal__calendar-wrapper').outerHeight();
        mh = $('.scrollCal__monthFrame').outerHeight();
        k = mh / sh;
        return $('.scrollCal__month-indicator').css({
          top: st * k
        });
      });
      $('.scrollCal__monthFrame').bind("mousewheel", function(e) {
        var delta, indicator, k, mh, posForIndicator, sh, st;
        e.preventDefault();
        delta = Math.floor(e.originalEvent.wheelDelta / 2);
        indicator = $(this).find('.scrollCal__month-indicator');
        st = parseInt(indicator.css('top'));
        sh = $('.scrollCal__calendar-wrapper').outerHeight();
        mh = $('.scrollCal__monthFrame').outerHeight();
        k = sh / mh;
        if (st - delta <= 0) {
          posForIndicator = 1;
        } else if (st - delta >= mh - 35) {
          posForIndicator = mh - 36;
        } else {
          posForIndicator = st - delta;
        }
        if (st >= 0 && st <= mh - 35) {
          $(this).find('.scrollCal__month-indicator').css('top', posForIndicator);
          return $('.scrollCal__mainFrame').scrollTop(st * k);
        }
      });
      $('.scrollCal__yearFrame').bind("mousewheel", __bind(function(e) {
        var delta;
        e.preventDefault();
        delta = e.originalEvent.wheelDelta;
        if (delta < 0) {
          if (this.year < this.settings.yearRange[1]) {
            $('.scrollCal__mainFrame').html(this.generateMonthsCalForYear(this.year + 1));
            return this.setYearInScroll(this.year + 1);
          }
        } else {
          if (this.year > this.settings.yearRange[0]) {
            $('.scrollCal__mainFrame').html(this.generateMonthsCalForYear(this.year - 1));
            return this.setYearInScroll(this.year - 1);
          }
        }
      }, this));
      $('.scrollCal__mainFrame').delegate("td.scrollCal__calendar-day", "click", __bind(function(e) {
        var dateString, day, month, year;
        day = parseInt($(e.target).text());
        month = $(e.target).closest('.scrollCal__calendar').data('month');
        year = $(e.target).closest('.scrollCal__calendar-wrapper').data('year');
        dateString = "" + day + " " + (this.MONTH_LABELS[month].substr(0, 3)) + ". " + year;
        return this.$el.val(dateString);
      }, this));
      $('.scrollCal__yearFrame').delegate("a.scrollCal__year-item", "click", __bind(function(e) {
        var year;
        year = parseInt($(e.target).data('year'));
        $('.scrollCal__mainFrame').html(this.generateMonthsCalForYear(year));
        return this.setYearInScroll(year);
      }, this));
    }
    ScrollCal.prototype.createCal = function() {
      var day, html, _i, _len, _ref;
      html = [];
      html.push("<table><tr>");
      _ref = this.DAY_LABELS;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        day = _ref[_i];
        html.push("<td class='scrollCal__calendar-header-day'>" + day + "</td>");
      }
      html.push("</tr></table>");
      return this.$el.after("<div class='scrollCal'>                  <div class='scrollCalSection scrollCal__weekdays'>" + (html.join('')) + "</div>                  <div class='scrollCalSection scrollCal__mainFrame'></div>                  <div class='scrollCalSection scrollCal__monthFrame'></div>                  <div class='scrollCalSection scrollCal__yearFrame'></div>                </div>");
    };
    ScrollCal.prototype.generateMonthCal = function(year, month) {
      var day, firstDay, html, monthLength, monthName, startingDay, week, weekday;
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
      html.push("<table class='scrollCal__calendar' data-month='" + month + "'>");
      html.push("<tr><th colspan='7'>" + monthName + "</th></tr>");
      html.push("<tr class='scrollCal__calendar-header'>");
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
      html.push("<div class='scrollCal__calendar-wrapper' data-year='" + year + "'>");
      for (m = 0; m <= 11; m++) {
        html.push(this.generateMonthCal(year, m));
      }
      html.push("</div>");
      return html.join("");
    };
    ScrollCal.prototype.generateMonthSlider = function() {
      var html, month, _i, _len, _ref;
      html = [];
      html.push("<div class='scrollCal__month-indicator'></div>");
      _ref = this.MONTH_LABELS;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        month = _ref[_i];
        html.push("<a class='scrollCal__month-item'>" + month + "</a>");
      }
      return html.join("");
    };
    ScrollCal.prototype.generateYearSlider = function(yearRange) {
      var html, y, _ref, _ref2;
      html = [];
      html.push("<div class='scrollCal__year-indicator'></div><div class='scrollCal__year-wrapper'>");
      for (y = _ref = yearRange[0], _ref2 = yearRange[1]; _ref <= _ref2 ? y <= _ref2 : y >= _ref2; _ref <= _ref2 ? y++ : y--) {
        html.push("<a class='scrollCal__year-item scrollCal__year_" + y + "' data-year='" + y + "'>" + y + "</a>");
      }
      html.push("</div>");
      return html.join("");
    };
    ScrollCal.prototype.setYearInScroll = function(year) {
      var delta, indicatorPosition, yearPosition, yearToSet;
      yearToSet = $(".scrollCal__year-item.scrollCal__year_" + year);
      yearPosition = yearToSet.position().top;
      indicatorPosition = $('.scrollCal__year-indicator').position().top - 10;
      delta = indicatorPosition - yearPosition;
      $('.scrollCal__year-wrapper').css('top', delta);
      return this.year = year;
    };
    return ScrollCal;
  })();
}).call(this);
