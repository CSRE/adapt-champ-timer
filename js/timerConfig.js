define(['core/js/adapt', 'libraries/moment'], function(Adapt, moment) {
  function getTimerConfig() {
    var timerConfig = {};

    // Set timer requirement
    var timerComponentModel = _.find(Adapt.components.models, function(model) {
      return model.attributes._component === 'timer';
    });

    if (!timerComponentModel) {
      throw new Error('Unable to find timer component model');
    }

    timerConfig.REQUIRED_TIME = timerComponentModel.get('_time');

    // Set SCORM attributes
    scormAPI = require('extensions/adapt-contrib-spoor/js/scorm');
    timerConfig.START_TIME = scormAPI.startTime;
    timerConfig.PREVIOUS_TIME = scormAPI.getValue('cmi.core.total_time');

    /**
     * Update target time to account for previous time
     * completed or set full time in milliseconds.
     */
    if (timerConfig.PREVIOUS_TIME !== 'undefined') {
      var prevDuration = moment.duration(timerConfig.PREVIOUS_TIME);

      timerConfig.TARGET_TIME = moment
        .duration(timerConfig.REQUIRED_TIME, 'minutes')
        .subtract(prevDuration)
        .as('seconds');
    } else {
      timerConfig.TARGET_TIME = parseInt(timerConfig.REQUIRED_TIME, 10) * 60;
    }

    // Set env
    var devTools = Adapt.config.get('_devtools');
    timerConfig.__DEV__ = devTools && devTools._isEnabled;

    if (timerConfig.__DEV__) {
      window.__SCORMAPI_TEST__ = scormAPI;
    }

    return timerConfig;
  }

  return getTimerConfig;
});
