var attr = DS.attr;
App.User = DS.Model.extend({
    error: attr('string'),

    userId: attr('number'),
    familyName: attr('string'),
    givenName: attr('string'),
    email: attr('string'),
    isDeactived: attr('boolean'),

    fullName: function () {
        //ensure we don't display user actionable views when we don't have todoItemId yet
        return this.get("familyName") + " " + this.get("givenName");
    }.property('familyName', 'givenName'),

    hasID: function () {
        //ensure we don't display user actionable views when we don't have todoItemId yet
        return this.get("userId") != null;
    }.property('userId'),

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError == null);
    }.property('error'),
});

App.UserSerializer = DS.WebAPISerializer.extend({
    primaryKey: 'userId',
    normalizeHash: {
        users: function (hash) {
            hash.userId = hash.id;
            return hash;
        },
        user: function (hash) {
            hash.userId = hash.id;
            return hash;
        },
    }
});


 