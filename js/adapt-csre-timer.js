define([
  'core/js/adapt',
  './nextButtonView',
  './countdownView',
  './helpers',
  './timer'
], function(Adapt, NextButtonView, CountdownView, helpers) {
  /**
   * Data model for plug-in
   */
  var TimerModel = Backbone.Model.extend({
    defaults: function() {
      return {
        startTime: null,
        requiredTime: null,
        previousTime: null,
        remainingTime: null,
        timerComplete: false,
        error: false
      };
    }
  });

  /**
   * Main plug-in module extending Backbone's Event.
   */
  var CourseTimer = _.extend(
    {
      timerModel: new TimerModel(),

      setErr: function() {
        this.timerModel.set('error', true);
      },

      initialize: function() {
        this.listenToOnce(Adapt, {
          'app:dataReady': this.onAppDataReady
        });
      },

      onAppDataReady: function() {
        this.setUpTimer();
        this.setEventListeners();
        this.setDrawerView();
      },

      setUpTimer: function() {
        var timerConfig = helpers.getTimerConfig();
        if (!timerConfig) {
          return this.setErr();
        }

        try {
          scormAPI = require('extensions/adapt-contrib-spoor/js/scorm');
          window.SCORMAPI_TEST = scormAPI; // TODO: Comment out in production
        } catch (e) {
          console.warn('Unable to load SCORM API:', e);
          return this.setErr();
        }

        this.timerModel.set({
          startTime: scormAPI.startTime,
          requiredTime: timerConfig._requiredTime,
          previousTime: scormAPI.getValue('cmi.core.total_time')
        });

        Adapt.trigger('courseTimer:startTimer', this.timerModel);
      },

      setDrawerView: function() {
        var drawerItem = {
          title: 'Course Timer',
          description: 'Time left in course.'
        };

        Adapt.drawer.addItem(drawerItem, 'courseTimer:showDrawer');
      },

      setEventListeners: function() {
        this.listenTo(Adapt, {
          'componentView:postRender': this.componentPostRender,
          'courseTimer:showDrawer': this.loadDrawerView,
          'courseTimer:attemptQuizNavigation': this.attemptQuizNavigation
        });
      },

      loadDrawerView: function() {
        Adapt.drawer.triggerCustomView(
          new CountdownView({ model: this.timerModel }).$el
        );
      },

      /**
       * Listen for component renders and check to see if
       * it has been tagged as a next button container.
       */
      componentPostRender: function(view) {
        var config = view.model.get('_courseTimer');

        if (config && config._nextButtonContainer) {
          buttonView = new NextButtonView({ model: this.timerModel });
          view.$('.component-body-inner').append(buttonView.el);
        }
      },

      attemptQuizNavigation: function() {
        if (this.timerModel.get('timerComplete')) {
          window.API.LMSRedirect('adv');
        }
      }
    },
    Backbone.Events
  );

  CourseTimer.initialize();

  return CourseTimer;
});
