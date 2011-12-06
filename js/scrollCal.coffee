$ = jQuery

$.fn.extend
  scrollCal: (options) ->
    settings =
      months: 3
      
    settings = $.extend settings, options
    return @each () ->
      new ScrollCal this, settings

class ScrollCal
  DAY_LABELS: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
  MONTH_LABELS: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
  MONTH_DAYS: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  CURRENT_DATE: new Date()
    
  constructor: (@element, @settings) ->
    @$el = $(@element)
    @months = @settings.months
    @day = @$el.data('day') || (@CURRENT_DATE.getDay() + 8) % 7
    @month = @$el.data('month') || @CURRENT_DATE.getMonth()
    @year = @$el.data('year') || @CURRENT_DATE.getFullYear()
    
    @createCal()
    $('.scrollCal__mainFrame').html @generateCal(@year, @month)
    $('.scrollCal__monthFrame').html @generateMonthSlider()
    $('.scrollCal__yearFrame').html @generateYearSlider(@year)
    
    $('.scrollCal').offset(
      left: $(@element).offset().left
    )
    
  createCal: () ->
    @$el.after("<div class='scrollCal'>
                  <div class='scrollCal__mainFrame'></div>
                  <div class='scrollCal__monthFrame'></div>
                  <div class='scrollCal__yearFrame'></div>
                </div>")
                
  generateCal: (year, month) ->
    firstDay = new Date year, month, 1
    startingDay = (firstDay.getDay() + 6) % 7
    monthLength = @MONTH_DAYS[month]
    
    if month == 1 #Фикс для февраля
      if (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
        monthLength = 29
        
        
    monthName = @MONTH_LABELS[month]
    html = []
    html.push "<table class='scrollCal__calendar'>"
    html.push "<tr><th colspan='7'>#{monthName}</th></tr>"
    html.push "<tr class='scrollCal__calendar-header'>"
    for day in @DAY_LABELS
      html.push "<td class='scrollCal__calendar-header-day'>#{day}</td>"
    html.push "</tr><tr>" 
    
    
    day = 1
    for week in [0..6] #weeks
      for weekday in [0..6] #weekdays
        html.push "<td class='scrollCal__calendar-day'>"
        if day <= monthLength && (week > 0 || weekday >= startingDay)
          html.push day
          day++
        html.push "</td>"
      if day > monthLength
        break
      else
        html.push "</tr><tr>"
    html.push "</tr></table>"
    html.join ""
    
  generateMonthSlider: () ->
    html = []
    for month in @MONTH_LABELS
      html.push "<a class='scrollCal__month-item'>#{month}</a>"
    html.join ""
    
  generateYearSlider: (year) ->
    html = []
    for y in [year-6..year+6]
      html.push "<a class='scrollCal__year-item'>#{y}</a>"
    html.join ""
    
  