$ = jQuery

$.fn.extend
  scrollCal: (options) ->
    settings =
      yearRange: [1990, 2024] 
      
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
    $('.scrollCal__mainFrame').html @generateMonthsCalForYear(@year)
    $('.scrollCal__monthFrame').html @generateMonthSlider()
    $('.scrollCal__yearFrame').html @generateYearSlider(@settings.yearRange)
    
    $('.scrollCal').offset(
      left: $(@element).offset().left
    )
    
    $('.scrollCal__mainFrame').bind "mousewheel", (e, delta) ->
      e.preventDefault()
      st = $(this).scrollTop()
      $(this).scrollTop(st - Math.ceil(delta*100))
      sh = $('.scrollCal__calendar-wrapper').height()
      mh = $('.scrollCal__monthFrame').height()
      k  = mh/sh
      $('.scrollCal__month-indicator').css({top: st*k})
    
    $('.scrollCal__monthFrame').bind "mousewheel", (e, delta) ->
      e.preventDefault()
      indicator = $(this).find('.scrollCal__month-indicator')
      st = parseInt indicator.css('top')
      sh = $('.scrollCal__calendar-wrapper').height()
      mh = $('.scrollCal__monthFrame').height()
      k  = sh/mh
      if st >= 0 && st <= mh - 50
        $(this).find('.scrollCal__month-indicator').css('top', st - Math.floor(delta*100))
        $('.scrollCal__mainFrame').scrollTop(st * k)
      else if st < 0
        $(this).find('.scrollCal__month-indicator').css('top', 0)
      else if st > mh - 50
        $(this).find('.scrollCal__month-indicator').css('top', mh - 50)
        
    $('.scrollCal__yearFrame').bind "mousewheel", (e, delta) ->
      e.preventDefault()
      st = $(this).scrollTop()
      $(this).scrollTop(st - Math.ceil(delta*100))
    
  createCal: () ->
    @$el.after("<div class='scrollCal'>
                  <div class='scrollCalSection scrollCal__mainFrame'></div>
                  <div class='scrollCalSection scrollCal__monthFrame'></div>
                  <div class='scrollCalSection scrollCal__yearFrame'></div>
                </div>")
                
  generateMonthCal: (year, month) ->
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
  
  generateMonthsCalForYear: (year) ->
    html = []
    html.push "<div class='scrollCal__calendar-wrapper'>"
    for m in [0..11]
      html.push @generateMonthCal(year, m)
    html.push "</div>"
    html.join ""
    
  generateMonthSlider: () ->
    html = []
    for month in @MONTH_LABELS
      html.push "<a class='scrollCal__month-item'>#{month}</a>"
    html.push "<div class='scrollCal__month-indicator'></div>"
    html.join ""
    
  generateYearSlider: (yearRange) ->
    html = []
    for y in [yearRange[0]..yearRange[1]]
      html.push "<a class='scrollCal__year-item'>#{y}</a>"
    html.join ""
    
  