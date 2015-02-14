var attr = DS.attr;
App.Booking = DS.Model.extend({
    error: attr('string'),
    isDone: attr('boolean'),
    //isDeleted: attr('boolean'),

    bookingNumber: attr('string'),

    familyName: attr('string'),
    givenName: attr('string'),
    fullName: function () {
        return this.get('familyName') + " " + this.get('givenName');
    }.property('familyName', 'givenName'),

    contactEmail: attr('string'),
    contactPhone: attr('string'),
    visitReason: attr('string'),

    //bookingId: attr('number'),
    bookingDate: attr('date'),
    atAM: attr('boolean'),
    atPM: attr('boolean'),
    startTime: attr('date'),
    endTime: attr('date'),
    bookingDateTime: function() {
        var date = this.get("bookingDate");
        var start = this.get("startTime");
        var atAM = this.get("atAM");

        if (this.get("isScheduled")) {
            return moment(start).format("YYYY/MM/DD hh:mm");
        } else {
            return moment(date).format("YYYY/MM/DD") + (atAM ? " A.M." : " P.M.");
        }
    }.property('bookingDate', 'startTime', 'atAM', 'atPM'),

    providerId: attr('number'),
    provider: DS.belongsTo('provider'),
    providerName: function () {
        var provider = this.get("provider");
        return provider ? provider.get("fullName") : "";
    }.property('provider'),

    status: attr('string'),
    isApplied: function () {
        return this.get('status') === "Applied";
    }.property('status'),

    isRejected: function () {
        return this.get('status') === "Rejected";
    }.property('status'),

    isCanceled: function () {
        return this.get('status') === "Canceled";
    }.property('status'),

    isScheduled: function () {
        return this.get('status') === "Scheduled";
    }.property('status'),

    hasID: function () {
        //ensure we don't display user actionable views when we don't have todoItemId yet
        return this.get("id") != null;
    }.property('id'),

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError == null);
    }.property('error'),

});

App.BookingSerializer = DS.RESTSerializer.extend({
    primaryKey: 'id',
    //// ember-data-1.0.0-beta2 does not handle embedded data like they once did in 0.13, so we've to update individually if present
    //// once embedded is implemented in future release, we'll move this back to WebAPISerializer.
    //// see https://github.com/emberjs/data/blob/master/TRANSITION.md for details
    extractArray: function (store, primaryType, payload) {
        var primaryTypeName = primaryType.typeKey;

        var typeName = primaryTypeName,
            type = store.modelFor(typeName);

        var data = {};
        data[typeName] = payload;
        data.providers = [];
        payload.map(function (hash) {
            hash.type = type;
            var provider = hash.provider;
            if (provider) {
                //hash.provider = store.find("provider", provider);
                provider.type = App.Provider;
                data.providers.push(provider);
            }
        }, this);
        payload = data;
        return this._super.apply(this, arguments);
    },

    extractSingle: function (store, primaryType, payload, recordId, requestType) {
        var primaryTypeName = primaryType.typeKey;
        var typeName = primaryTypeName,
            type = store.modelFor(typeName);
        var data = {};
        data[typeName] = payload;
        payload.type = type;
        data.providers = [];
        var provider = payload.provider;
        if (provider) {
            //hash.provider = store.find("provider", provider);
            provider.type = App.Provider;
            data.providers.push(provider);
        }

        payload = data;
        return this._super.apply(this, arguments);
    },
});



//App.Booking.FIXTURES = [
//  { id: 1, bookingId: 1, date: new Date(), chiefComplaint: 'I have been having chest pain lately.', status: "Pending", userId: 1, user: 1, providerId: 1, provider: 1 },
//  { id: 2, bookingId: 2, date: new Date(), chiefComplaint: 'I have been having chest pain lately.', status: "Approved", userId: 1, user: 1, providerId: 1, provider: 1 },
//  { id: 3, bookingId: 3, date: new Date(), chiefComplaint: 'I have been having chest pain lately.', status: "Canceled", userId: 1, user: 1, providerId: 1, provider: 1 },
//];
