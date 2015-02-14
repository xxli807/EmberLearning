App.ProvidersNewView = App.BaseView.extend({
    templateName: 'providers-new',

    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,

    didInsertElement: function () {
        this._super();
        var self = this;
        self.$(".btnNextStep").click(function () {
            $('.nav-tabs a[href="#providerSettings"]').tab('show');
        });

        self.$(".btnAllDay").click(function () {
            var row = $(this).closest("tr");

            var input = row.find(":hidden:first");
            var value = +self.get(input.prop("name"));
            if (!$(this).is(".active")) {
                value = 3;
            } else {
                value = 0;
            }
            row.find("button:not(.btnAllDay)").toggleClass("btn-success active", !$(this).is(".active"));
            self.set(input.prop("name"), value);
        });

        self.$(".btnWorkingAtAM").click(function () {
            var row = $(this).closest("tr");
            var btnAll = row.find(".btnAllDay");
            var input = row.find(":hidden:first");
            var value = +self.get(input.prop("name"));

            if (btnAll.is(".active")) {
                btnAll.removeClass("btn-success active");
                value = 0;
            }

            if (!$(this).is(".active")) {
                value += 1;
            } else {
                value -= 1;
            }
            self.set(input.prop("name"), value);
        });
        self.$(".btnWorkingAtPM").click(function () {
            var row = $(this).closest("tr");
            var btnAll = row.find(".btnAllDay");
            var input = row.find(":hidden:first");
            var value = +self.get(input.prop("name"));
            
            if (btnAll.is(".active")) {
                btnAll.removeClass("btn-success active");
                value = 0;
            }

            if (!$(this).is(".active")) {
                value += 2;
            } else {
                value -= 2;
            }
            self.set(input.prop("name"), value);
        });
    },

    actions: {
        addProvider: function (data) {
            var self = this;
            data = data || self;
            var workingTime = {
                monday: data.get("monday"),
                tuesday: data.get("tuesday"),
                wednesday: data.get("wednesday"),
                thursday: data.get("thursday"),
                friday: data.get("friday"),
                saturday: data.get("saturday"),
                sunday: data.get("sunday"),
            };

            var provider = {
                familyName: data.get("familyName"),
                givenName: data.get("givenName"),
                email: data.get("email"),
                phone: data.get("phone"),
                mobile: data.get("mobile"),
                //providerWorkingTimes: [workingTime]
            };

            Em.Logger.debug('Value of new provider:', provider);
            Em.Logger.debug('Value of new working time:', workingTime);

            provider = self.controller.store.createRecord("provider", provider);
            workingTime = self.controller.store.createRecord("providerWorkingTime", workingTime);
            //provider.get('providerWorkingTimes').addObject(workingTime);

            var box = SiteJS.ToastInfo("The data is submiting. Please wait a moment.");
            provider.save().then(function (result) {
                // Need to re-assign Id, a work we might be able to fix in the future when ember-data stablized
                provider.set("id", result.get("id"));
                workingTime.set("providerId", result.get("id"));
                provider.set('error', '');

                workingTime.save().then(function (result) {
                    // Need to re-assign Id, a work we might be able to fix in the future when ember-data stablized
                    workingTime.set("id", result.get("id"));
                    workingTime.set('error', '');

                    provider.get('providerWorkingTimes').insertAt(0, workingTime);
                    box.close();
                    self.set("success", 'This provider has been submit.');
                    self.controller.replaceRoute('providers.list', "all");
                }, function (result) {
                    workingTime.set("error", "Error: " + result.message);
                    self.set("error", result.message);
                });

            }, function (result) {
                provider.set("error", "Error: " + result.message);
                self.set("error", result.message);
            });
        }
    }

});