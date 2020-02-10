define(['core/js/adapt'], function(Adapt) {
  var CountdownView = Backbone.View.extend({
    el: '<div class="countdown__wrapper"></div>',

    template: Handlebars.templates['countdown'],

    initialize: function() {
      this.listenTo(
        Adapt.courseTimerModule,
        'change:remainingTime',
        this.render
      );
      this.listenTo(Adapt, 'drawer:closed', this.onClose);
      this.render();
    },

    render: function() {
      var html = this.template(
        _.extend(Adapt.courseTimerModule.toJSON(), {
          courseComplete: Adapt.course.get('_isComplete')
        })
      );
      this.$el.html(html);
      return this;
    },

    events: {
      'click button': 'onButtonClick'
    },

    onButtonClick: function() {
      Adapt.trigger('courseTimer:clickNext');
    },

    onClose: function() {
      this.remove();
    }
  });

  return CountdownView;
});
