App.BaseView = Ember.View.extend({
    error: '',
    errorChanged: function() {
        var message = this.get("error");
        if (message) {
            SiteJS.ToastError(message);
        }
    }.observes('error'),
    success: '',
    successChanged: function () {
        var message = this.get("success");
        if (message) {
            SiteJS.ToastSuccess(message);
        }
    }.observes('success'),
    warning: '',
    warningChanged: function () {
        var message = this.get("warning");
        if (message) {
            SiteJS.ToastWarning(message);
        }
    }.observes('warning'),
    info: '',
    infoChanged: function () {
        var message = this.get("info");
        if (message) {
            SiteJS.ToastInfo(message);
        }
    }.observes('info'),
    

    didInsertElement: function () {
        this._super();

        if (typeof SiteJS === "object") {
            var id = this.$().attr("id");
            SiteJS.Init(id ? "#" + id : "");
        }
    }
});