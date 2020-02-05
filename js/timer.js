define(['core/js/adapt', './helpers', 'libraries/moment'], function(Adapt, helpers, moment) {

  var timer = _.extend({

    // Save interval id so it can be cleared later
    intervalId: null,
      
    initialize: function() {
      this.listenToOnce(Adapt, {
        'courseTimer:startTimer': this.startTimer,
        'courseTimer:stopTimer': this.stopTimer
      });
    },
    
    stopTimer: function() {
      clearInterval(this.intervalId);
    },
    
    /**
     * Start a new timer and update the model every second, allowing for other parts
     * of the plug-in to listen to model changes. The timer compares dates instead 
     * of incrementing a variable for two reasons. A startTime date object is returned 
     * from the SCORM wrapper API so it is good starting point. Second, comparing dates 
     * is likely more reliable than keeping track by incrementing an integer using 
     * setInterval.
     */
    startTimer: function(model) {

      var opts = model.attributes;

      var targetTime;

      /**
       * Update target time to account for previous time 
       * completed or set full time in milliseconds
       */
      if (opts.previousTime) {
        var prevDuration = moment.duration(opts.previousTime);

        targetTime = moment
          .duration(opts.requiredTime, 'minutes')
          .subtract(prevDuration)
          .as('seconds');

      } else {
        targetTime = opts.requiredTime * 60;
      }
      
      /**
       * Callback function to be run on each interval that will
       * update the timer model and check to see if timer has
       * completed.
       */
      var onInterval = _.bind(function() {
        var totalTime = moment().diff(opts.startTime, 'seconds');

        var remainingTime = moment
          .duration(targetTime, 'seconds')
          .subtract(totalTime, 'seconds')
          .as('milliseconds');

        var formattedTime = helpers.formatForCountdown(remainingTime);

        model.set({ remainingTime: formattedTime });

        /**
         * Timer is complete, clear interval 
         * and set completion flag to true.
         */
        if (remainingTime <= 0) {
          clearInterval(this.intervalId);
          model.set({ timerComplete: true });
        }
      }, this);

      /**
       * Start timer and save interval id so it can be
       * cleared once the timer has completed.
       */
      this.intervalId = setInterval(onInterval, 1000);

    },

  },
  Backbone.Events);

  timer.initialize();

  return timer;
})