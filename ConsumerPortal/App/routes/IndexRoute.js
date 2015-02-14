App.IndexRoute = Ember.Route.extend({
    afterModel: function (posts, transition) {
        var isAdmin = $("#isAdmin").val() == "True";
        if (isAdmin) {
            this.transitionTo('providers.list');
        } else {
            this.transitionTo('bookings.new');
        }
    }
});