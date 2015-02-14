App.BookingsRoute = Ember.Route.extend({
});

App.BookingRoute = Ember.Route.extend({
    model: function (params) {
        return this.store.find('booking', params.booking_id)|| {};
    },
});

App.BookingsNewRoute = Ember.Route.extend({
    model: function(params) {
        return this.store.findAll('provider');
    },
});

App.BookingsSearchRoute = Ember.Route.extend({
    model: function (params) {
        return {};
    },
});

App.BookingsListRoute = Ember.Route.extend({
    model: function () {
        var datas = this.store.findAll('booking');
        return datas;
    },
});

App.BookingEditRoute = Ember.Route.extend({
    model: function (params) {
        var booking = this.modelFor("booking");
        var providers = this.store.findAll("provider").then(function(result) {
            return { booking: booking, providers: result };
        });
        return providers;
    },
});

