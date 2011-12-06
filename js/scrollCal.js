(function() {
  var $, ScrollCal;
  $ = jQuery;
  $.fn.extend({
    scrollCal: function(options) {
      var settings;
      settings = {
        months: 3
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
      $('.scrollCal__mainFrame').html(this.generateCal(this.year, this.month));
      $('.scrollCal__monthFrame').html(this.generateMonthSlider());
      $('.scrollCal__yearFrame').html(this.generateYearSlider(this.year));
      $('.scrollCal').offset({
        left: $(this.element).offset().left
      });
    }
    ScrollCal.prototype.createCal = function() {
      return this.$el.after("<div class='scrollCal'>                  <div class='scrollCal__mainFrame'></div>                  <div class='scrollCal__monthFrame'></div>                  <div class='scrollCal__yearFrame'></div>                </div>");
    };
    ScrollCal.prototype.generateCal = function(year, month) {
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
    ScrollCal.prototype.generateMonthSlider = function() {
      var html, month, _i, _len, _ref;
      html = [];
      _ref = this.MONTH_LABELS;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        month = _ref[_i];
        html.push("<a class='scrollCal__month-item'>" + month + "</a>");
      }
      return html.join("");
    };
    ScrollCal.prototype.generateYearSlider = function(year) {
      var html, y, _ref, _ref2;
      html = [];
      for (y = _ref = year - 6, _ref2 = year + 6; _ref <= _ref2 ? y <= _ref2 : y >= _ref2; _ref <= _ref2 ? y++ : y--) {
        html.push("<a class='scrollCal__year-item'>" + y + "</a>");
      }
      return html.join("");
    };
    return ScrollCal;
  })();
}).call(this);
