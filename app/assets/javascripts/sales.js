// function to pass the @date variable to js so I don't have to fuck abut with
// controllers.
function showDateTimePicker(date) {
  $('#datetimepicker').datetimepicker({
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

  $('#datetimepicker').on('dp.change', function(event) {
    window.location = '/sales?date=' + event.date.format('Y-MM-DD');
  });

  $("#start-date-picker").on("dp.change", function (e) {
    $('#end-date-picker').data("DateTimePicker").minDate(e.date);
  });

  $("#end-date-picker").on("dp.change", function (e) {
    $('#start-date-picker').data("DateTimePicker").maxDate(e.date);
  });

  $(".form-control").change(function() {
    console.log("#start-date-picker: " + $('#start-date-picker').data("DateTimePicker").date());
    console.log("#end-date-picker: "   + $('#end-date-picker').data("DateTimePicker").date());

    if ($('#start-date-picker').value != '' && $('#end-date-picker').value != '') {
      $('#sales-export-button').removeClass('disabled');
    }
    else {
      $('#sales-export-button').addClass('disabled');
    }
  });
}

$(window).load(function() {

  // MAKE CHARTS FULL SCREEN
  $('#dayChart').add('#weekChart').add('#monthChart').add('#yearChart').click(function(){

    $(this).parents('.chart').toggleClass('fullScreen');

  });
});
