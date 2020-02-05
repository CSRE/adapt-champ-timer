define(['core/js/adapt'], function(Adapt) {
  
  var CountdownView = Backbone.View.extend({
    el: '<div class="countdown__wrapper"></div>',

    template: Handlebars.templates['countdown'],

    initialize: function() {
      this.listenTo(this.model, 'change:remainingTime', this.render);
      this.listenTo(Adapt, 'drawer:closed', this.onClose);
      this.render();
    },

    render: function() {
      var html = this.template(this.model.toJSON());
      this.$el.html(html);
      return this;
    },

    events: {
      'click button': 'onButtonClick'
    },

    onButtonClick: function() {
      Adapt.trigger('courseTimer:attemptQuizNavigation');
    },

    onClose: function() {
      this.remove();
    }
  });

  return CountdownView;
});