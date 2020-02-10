define(['core/js/adapt', 'libraries/moment'], function(Adapt, moment) {
  function formatDuration(milli) {
    var t = moment.duration(milli);
    var hrs = t.get('hours');
    var min = t.get('minutes');
    var sec = t.get('seconds');
    hrs = hrs < 10 ? '0' + hrs : hrs;
    min = min < 10 ? '0' + min : min;
    sec = sec < 0 ? 0 : sec;
    sec = sec < 10 ? '0' + sec : sec;
    return hrs + ':' + min + ':' + sec;
  }

  return formatDuration;
});
