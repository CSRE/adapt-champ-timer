define(function() {
  var TimerModel = Backbone.Model.extend({
    defaults: {
      startTime: null,
      requiredTime: null,
      previousTime: null,
      remainingTime: null,
      timerComplete: false,
      error: false,
      developmentMode: false
    }
  });

  return new TimerModel();
});
