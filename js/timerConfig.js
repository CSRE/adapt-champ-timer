define(['core/js/adapt'], function(Adapt) {
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
