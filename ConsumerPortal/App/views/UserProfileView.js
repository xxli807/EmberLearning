App.UserProfileView = App.BaseView.extend({
    tagName: "section",
    classNames: ["hbox", "stretch"],
    templateName: 'user-profile',
    didInsertElement: function () {
        this._super();
    }
});