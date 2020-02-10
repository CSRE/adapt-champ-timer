define([
  'core/js/adapt',
  'libraries/moment',
  './timerConfig',
  './formatDuration',
  './timerView',
  './timerDrawer'
], function(Adapt, moment, getTimerConfig, formatDuration) {
  var CourseTimerModule = Backbone.Model.extend({
    /**
     * Module constants should be read-only after they are initialized.
     */
    START_TIME: null, // Start date for this session
    PREVIOUS_TIME: null, // Previously accumulated time saved in SCORM
    REQUIRED_TIME: null, // Total time required accross all sessions
    TARGET_TIME: null, // Target for this session
    INTERVAL_ID: null, // Save interval id so it can be cleared later
    __DEV__: false, // Development environment flag

    /**
     * Default model settings that may be updated and listened to.
     */
    defaults: {
      remainingTime: '', // Formatted time left in timer
      timerComplete: false, // Save completion status of timer
      error: false // Error flag
    },

    initialize: function() {
      this.listenTo(Adapt, {
        'app:dataReady': this._timerSetup,
        'courseTimer:clickNext': this._onNext
      });

      this.listenTo(Adapt.course, {
        'change:_isComplete': this._onCourseComplete
      });
    },

    /**
     * Start a new timer
     */
    _timerSetup: function() {
      /**
       * Configure timer from component,
       * spoor and devtools settings.
       */
      try {
        _.extend(this, getTimerConfig());
      } catch (e) {
        return this.set({ error: true });
      }

      /**
       * Update target time to account for previous time
       * completed or set full time in milliseconds.
       */
      if (this.PREVIOUS_TIME !== 'undefined') {
        var prevDuration = moment.duration(this.PREVIOUS_TIME);

        this.TARGET_TIME = moment
          .duration(this.REQUIRED_TIME, 'minutes')
          .subtract(prevDuration)
          .as('seconds');
      } else {
        this.TARGET_TIME = parseInt(this.REQUIRED_TIME, 10) * 60;
      }

      /**
       * Start timer and save interval id so it can be
       * cleared once the timer has completed.
       */
      this.INTERVAL_ID = setInterval(this._onInterval.bind(this), 1000);
    },

    /**
     * Callback function to be run on each interval that will
     * update the timer model and check to see if timer has
     * completed.
     */
    _onInterval: function() {
      // Difference between 'now' and start time.
      var totalTime = moment().diff(this.START_TIME, 'seconds');

      var remainingTime = moment
        .duration(this.TARGET_TIME, 'seconds')
        .subtract(totalTime, 'seconds')
        .as('milliseconds');

      this.set('remainingTime', formatDuration(remainingTime));

      if (remainingTime <= 0) {
        this._stopTimer();
      }
    },

    _stopTimer: function() {
      clearInterval(this.INTERVAL_ID);
      this.set('timerComplete', true);

      if (Adapt.course.get('_isComplete')) {
        this._onCourseComplete();
      }
    },

    _onNext: function() {
      if (Adapt.course.get('_isComplete')) {
        window.API.LMSRedirect('adv');
      } else {
        var timerWarning = {
          title: 'Incomplete Course Requirements',
          body:
            'You still have <strong>' +
            this.attributes.remainingTime +
            '</strong> left before you can move forward in the course. ' +
            'Please take this opportunity to review the chapter.',
          confirmText: 'Continue',
          _isCancellable: false,
          _showIcon: true
        };

        Adapt.trigger('notify:alert', timerWarning);
      }
    },

    _onCourseComplete: function() {
      if (!this.attributes.timerComplete) {
        this._stopTimer();
      }

      // TODO: See if they are on last component or not first
      var timerNotify = {
        title: 'Course Requirements Complete',
        body:
          'You have completed all course requirements and can move on to the quiz/exam. ' +
          'If you would like to continue reviewing course material, choose Cancel below. ' +
          'When you are ready to move on choose the menu (top right) and then Course Timer ' +
          'and select Take Chapter Quiz.',
        _prompts: [
          {
            promptText: 'Cancel',
            _callbackEvent: 'notify:close'
          },
          {
            promptText: 'Continue Course',
            _callbackEvent: 'courseTimer:clickNext'
          }
        ]
      };

      Adapt.trigger('notify:prompt', timerNotify);
    }
  });

  /**
   * Attach to global Adapt instance for use
   * in component and drawer views.
   */
  Adapt.courseTimerModule = new CourseTimerModule();
});
