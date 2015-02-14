App.ProvidersRoute = Ember.Route.extend({
    //model: function () {
    //    return this.store.find('provider');
    //},
});
App.ProvidersCalendarRoute = Ember.Route.extend({
    model: function () {
        var bookings = this.store.findAll('booking');
        var model = { allBookings: bookings };
        return bookings;
    },
});
App.ProvidersListRoute = Ember.Route.extend({
    model: function () {
        var providers = this.store.findAll('provider');
        return providers;
    },
});

App.ProviderRoute = Ember.Route.extend({
    model: function (params) {
        return this.store.find('provider', params.provider_id);
    },
});
App.ProviderEditRoute = Ember.Route.extend({
    afterModel: function(posts, transition) {
        var len = posts.get('length');
    }
});