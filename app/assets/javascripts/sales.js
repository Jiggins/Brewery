// function to pass the @date variable to js so I don't have to fuck abut with
// controllers.
function showDateTimePicker(date) {
  $('#datetimepicker').datetimepicker({
    format: 'Y-MM-DD',
    defaultDate: date,
    inline: true
  });

  $('#datetimepicker').on('dp.change', function(event) {
    window.location = '/sales?date=' + event.date.format('Y-MM-DD');
  });
}
