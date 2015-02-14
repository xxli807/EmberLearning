App.HeaderView = App.BaseView.extend({
    templateName: 'header',
    isAdmin: $("#isAdmin").val() == "True",
    didInsertElement: function () {
        this._super();

        this.$(".btnLogOut").click(function () {
            var params = {
                antiForgeryToken: $("#antiForgeryToken").val()
            };
            var action = "/Account/LogOff";
            $.post(action, params)
                .done(function (json) {
                    window.location = "/home/index";
                })
                .error(function () {
                    window.location = "/home/index";
                });
            return false;
        });
    }
});