define(['core/js/adapt', './CountdownView'], function(Adapt, CountdownView) {
  var timerDrawer = _.extend(
    {
      init: function() {
        this.listenToOnce(Adapt, {
          'app:dataReady': this.addToDrawer
        });
      },

      addToDrawer: function() {
        var drawerItem = {
          title: 'Course Timer',
          description: 'Time left in course.'
        };

        Adapt.drawer.addItem(drawerItem, 'courseTimer:showDrawer');

        this.listenTo(Adapt, {
          'courseTimer:showDrawer': this.showDrawer
        });
      },

      showDrawer: function() {
        Adapt.drawer.triggerCustomView(new CountdownView().$el);
      }
    },
    Backbone.Events
  );

  timerDrawer.init();

  return timerDrawer;
});
