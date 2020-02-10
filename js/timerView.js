define(['core/js/adapt', 'core/js/views/componentView'], function(
  Adapt,
  ComponentView
) {
  var TimerView = ComponentView.extend({
    preRender: function() {
      if (!this.model.get('displayTitle')) {
        this.model.set({ displayTitle: "You've Finished the Review!" });
      }

      if (!this.model.get('body')) {
        this.model.set({
          body:
            '<p>If you are ready to take the quiz, click the link below.</p><p>If you would like to review previous modules, click the home button and come back to this section when you are ready.</p>'
        });
      }
    },

    postRender: function() {
      this.setReadyStatus();

      if (Adapt.courseTimerModule.get('timerComplete')) {
        this.setCompletionStatus();
      } else {
        this.listenToOnce(
          Adapt.champCourseTimer,
          'change:timerComplete',
          this.setCompletionStatus
        );
      }
    },

    remove: function() {
      ComponentView.prototype.remove.call(this);
    },

    template: 'timer',

    events: {
      'click button': 'onButtonClick'
    },

    onButtonClick: function() {
      Adapt.trigger('courseTimer:clickNext');
    }
  });

  Adapt.register('timer', TimerView);
});
