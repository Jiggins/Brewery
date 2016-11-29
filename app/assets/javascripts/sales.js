// function to pass the @date variable to js so I don't have to fuck abut with
// controllers.
function showDateTimePicker(date) {
  $('#date').datetimepicker({
    format: 'Y-MM-DD',
    defaultDate: date,
    inline: true,
    showTodayButton: true
  });

  $('#start-date-picker').datetimepicker({
    format: 'Do, MMM Y',
  });

  $('#end-date-picker').datetimepicker({
    defaultDate: date,
    format: 'Do, MMM Y',
    useCurrent: false
  });

  $("#start-date-picker").on("dp.change", function (e) {
    $('#end-date-picker').data("DateTimePicker").minDate(e.date);
  });

  $("#end-date-picker").on("dp.change", function (e) {
    $('#start-date-picker').data("DateTimePicker").maxDate(e.date);
  });
}

$(window).load(function() {

  // MAKE CHARTS FULL SCREEN
  $('#dayChart').add('#weekChart').add('#monthChart').add('#yearChart').click(function(){

    $(this).parents('.chart').toggleClass('fullScreen');

  });
});
