define(['core/js/adapt'], function(Adapt) {

  function getTimerConfig() {
    var spoorConfig = Adapt.config.get('_spoor');
    var timerConfig = Adapt.config.get('_courseTimer');

    if (
      spoorConfig &&
      spoorConfig._isEnabled &&
      timerConfig &&
      timerConfig._isEnabled
    ) {
      return timerConfig;
    }
    return null;
  }

  function formatForCountdown(milli) {
    var min = String(Math.max(parseInt(milli / 60000, 10), 0));
    var sec = String(Math.max(parseInt((milli % 60000) / 1000, 10),0));
    min = min.length > 1 ? min : '0' + min;
    sec = sec.length > 1 ? sec : '0' + sec;
    return  min + ':' + sec;
  }

  return {
    getTimerConfig: getTimerConfig,
    formatForCountdown: formatForCountdown
  }

})