define(['core/js/adapt'], function(Adapt) {

  var NextButtonView = Backbone.View.extend({

    el: '<div class="next-btn__wrapper"></div>',

    template: Handlebars.templates['next-btn'],

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
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
    }

  });

  return NextButtonView;
});