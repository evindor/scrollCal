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
    
    @setYearInScroll(@year)
    
    $('.scrollCal').offset(
      left: $(@element).offset().left
    )
    
    $('.scrollCal__mainFrame').bind "mousewheel", (e) ->
      e.preventDefault()
      delta = e.originalEvent.wheelDelta
      st = $(this).scrollTop()
      $(this).scrollTop(st - delta)
      sh = $('.scrollCal__calendar-wrapper').outerHeight()
      mh = $('.scrollCal__monthFrame').outerHeight()
      k  = mh/sh
      $('.scrollCal__month-indicator').css({top: st*k})
    
    $('.scrollCal__monthFrame').bind "mousewheel", (e) ->
      e.preventDefault()
      delta = Math.floor e.originalEvent.wheelDelta / 2
      indicator = $(this).find('.scrollCal__month-indicator')
      st = parseInt indicator.css('top')
      sh = $('.scrollCal__calendar-wrapper').outerHeight()
      mh = $('.scrollCal__monthFrame').outerHeight()
      k  = sh/mh
      if st - delta <= 0
        posForIndicator = 1
      else if st - delta >= mh - 35
        posForIndicator = mh - 36
      else
        posForIndicator = st - delta
      if st >= 0 && st <= mh - 35
        $(this).find('.scrollCal__month-indicator').css('top', posForIndicator)
        $('.scrollCal__mainFrame').scrollTop(st * k)
        
    $('.scrollCal__yearFrame').bind "mousewheel", (e) =>
      e.preventDefault()
      delta = e.originalEvent.wheelDelta
      if delta < 0
        if @year < @settings.yearRange[1]
          $('.scrollCal__mainFrame').html @generateMonthsCalForYear(@year + 1)
          @setYearInScroll(@year + 1)
      else
        if @year > @settings.yearRange[0]
          $('.scrollCal__mainFrame').html @generateMonthsCalForYear(@year - 1)
          @setYearInScroll(@year - 1)
      #st = $(this).scrollTop()
      #$(this).scrollTop(st - delta)
    
    $('.scrollCal__mainFrame').delegate "td.scrollCal__calendar-day", "click", (e) =>
      day = parseInt $(e.target).text()
      month = $(e.target).closest('.scrollCal__calendar').data('month')
      year = $(e.target).closest('.scrollCal__calendar-wrapper').data('year')
      dateString = "#{day} #{@MONTH_LABELS[month].substr(0,3)}. #{year}"
      @$el.val(dateString)
      
    $('.scrollCal__yearFrame').delegate "a.scrollCal__year-item", "click", (e) =>
      year = parseInt $(e.target).data('year')
      $('.scrollCal__mainFrame').html @generateMonthsCalForYear(year)
      @setYearInScroll(year)
      
  createCal: () ->
    html = []
    html.push "<table><tr>"
    for day in @DAY_LABELS
      html.push "<td class='scrollCal__calendar-header-day'>#{day}</td>"
    html.push "</tr></table>"
    @$el.after("<div class='scrollCal'>
                  <div class='scrollCalSection scrollCal__weekdays'>#{html.join('')}</div>
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
    html.push "<table class='scrollCal__calendar' data-month='#{month}'>"
    html.push "<tr><th colspan='7'>#{monthName}</th></tr>"
    html.push "<tr class='scrollCal__calendar-header'>"
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
    html.push "<div class='scrollCal__calendar-wrapper' data-year='#{year}'>"
    for m in [0..11]
      html.push @generateMonthCal(year, m)
    html.push "</div>"
    html.join ""
    
  generateMonthSlider: () ->
    html = []
    html.push "<div class='scrollCal__month-indicator'></div>"
    for month in @MONTH_LABELS
      html.push "<a class='scrollCal__month-item'>#{month}</a>"
    html.join ""
    
  generateYearSlider: (yearRange) ->
    html = []
    html.push "<div class='scrollCal__year-indicator'></div><div class='scrollCal__year-wrapper'>"
    for y in [yearRange[0]..yearRange[1]]
      html.push "<a class='scrollCal__year-item scrollCal__year_#{y}' data-year='#{y}'>#{y}</a>"
    html.push "</div>"
    html.join ""
    
  setYearInScroll: (year) ->
    yearToSet = $(".scrollCal__year-item.scrollCal__year_#{year}")
    yearPosition = yearToSet.position().top
    indicatorPosition = $('.scrollCal__year-indicator').position().top - 10
    delta = indicatorPosition - yearPosition
    $('.scrollCal__year-wrapper').css('top', delta)
    @year = year
  