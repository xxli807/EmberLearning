var attr = DS.attr;
App.Provider = DS.Model.extend({
    error: attr('string'),

    familyName: attr('string'),
    givenName: attr('string'),
    fullName: function () {
        return this.get('familyName') + " " + this.get('givenName');
    }.property('familyName', 'givenName'),


    email: attr('string'),
    phone: attr('string'),
    mobile: attr('string'),
    providerWorkingTimes: DS.hasMany('providerWorkingTime'),
    bookings: DS.hasMany('booking'),

    hasID: function () {
        //ensure we don't display user actionable views when we don't have todoItemId yet
        return this.get("id") != null;
    }.property('id'),

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError == null);
    }.property('error'),
});

App.ProviderWorkingTime = DS.Model.extend({
    error: attr('string'),

    providerId: attr('number'),
    provider: DS.belongsTo('provider'),
    monday: attr('number'),
    tuesday: attr('number'),
    wednesday: attr('number'),
    thursday: attr('number'),
    friday: attr('number'),
    saturday: attr('number'),
    sunday: attr('number'),

    hasID: function () {
        //ensure we don't display user actionable views when we don't have todoItemId yet
        return this.get("id") != null;
    }.property('id'),

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError == null);
    }.property('error'),
});

App.ProviderSerializer = DS.RESTSerializer.extend({
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
        data.providerWorkingTimes = [];

        // Make the todos as a separate payload for extract Array to work on, 
        // this is to get the format the same as ember-data default has many relationship arrays
        payload.map(function (hash) {
            hash.type = type;
            hash.providerWorkingTimes.map(function (time) {
                time.type = App.ProviderWorkingTime;
                data.providerWorkingTimes.push(time); //add the todos to the data
            });
            hash.providerWorkingTimes = hash.providerWorkingTimes.mapProperty('id');
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

        data.providerWorkingTimes = [];

        if (payload.providerWorkingTimes != null) {
            payload.providerWorkingTimes.map(function (time) {
                time.type = App.ProviderWorkingTime;
                data.providerWorkingTimes.push(time);
            });
            payload.providerWorkingTimes = payload.providerWorkingTimes.mapProperty('id');
        }
        else {
            payload.providerWorkingTimes = [];
        }

        payload = data;
        return this._super.apply(this, arguments);
    },
});
App.ProviderWorkingTimeSerializer = DS.RESTSerializer.extend({
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
        // Make the todos as a separate payload for extract Array to work on, 
        // this is to get the format the same as ember-data default has many relationship arrays
        payload.map(function (hash) {
            hash.type = type;
        }, this);
        payload = data;
        return this._super.apply(this, arguments);
    },

    extractSingle: function (store, primaryType, payload, recordId, requestType) {
        var primaryTypeName = primaryType.typeKey;
        var typeName = primaryTypeName;
        var data = {};
        data[typeName] = payload;
        payload.type = App.ProviderWorkingTime;
        payload = data;
        return this._super.apply(this, arguments);
    },
});


//App.Provider.FIXTURES = [
//  { id: 1, providerId: 1, familyName: 'Trek', givenName: 'Glowacki', email: 'abc@abc.com', isDeactived: false },
//  { id: 2, providerId: 2, familyName: 'Tom', givenName: 'Dale', email: 'abc@abc.com', isDeactived: false }
//];
