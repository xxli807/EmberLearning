App.ProviderEditView = App.BaseView.extend({
    templateName: 'provider-edit',

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

        var data = self.controller.content;
        var workingTime = data.get("providerWorkingTimes").get("firstObject");
        if (workingTime) {
            self.set("monday", +workingTime.get("monday"));
            self.set("tuesday", +workingTime.get("tuesday"));
            self.set("wednesday", +workingTime.get("wednesday"));
            self.set("thursday", +workingTime.get("thursday"));
            self.set("friday", +workingTime.get("friday"));
            self.set("saturday", +workingTime.get("saturday"));
            self.set("sunday", +workingTime.get("sunday"));

            self.$(".btnAllDay").each(function (i, el) {
                var row = $(el).closest("tr");
                var btnAm = row.find(".btnWorkingAtAM");
                var btnPm = row.find(".btnWorkingAtPM");
                var input = row.find(":input:hidden:first");
                var value = +self.get(input.prop("name")) || 0;

                $(el).toggleClass("btn-success active", value == 3);
                btnAm.toggleClass("btn-success active", value == 3 || value == 1);
                btnPm.toggleClass("btn-success active", value == 3 || value == 2);
            });
        }

        self.$(".btnNextStep").click(function () {
            $('.nav-tabs a[href="#providerSettings"]').tab('show');
        });

        self.$(".btnAllDay").click(function () {
            var row = $(this).closest("tr");

            var input = row.find(":input:hidden:first");
            var value = +self.get(input.prop("name")) || 0;
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
            var input = row.find(":input:hidden:first");
            var value = +self.get(input.prop("name")) || 0;

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
            var input = row.find(":input:hidden:first");
            var value = +self.get(input.prop("name")) || 0;

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
        editProvider: function (data) {
            var self = this;
            data = data || self.controller.content;
            //var workingTime = data.get("providerWorkingTimes").get("firstObject");
            var workingTime = {
                providerId: data.get("id"),
                monday: self.get("monday"),
                tuesday: self.get("tuesday"),
                wednesday: self.get("wednesday"),
                thursday: self.get("thursday"),
                friday: self.get("friday"),
                saturday: self.get("saturday"),
                sunday: self.get("sunday"),
            };
            workingTime = self.controller.store.createRecord("providerWorkingTime", workingTime);


            var provider = data;

            Em.Logger.debug('Value of new provider:', provider);
            Em.Logger.debug('Value of new working time:', workingTime);

            var box = SiteJS.ToastInfo("The data is submiting. Please wait a moment.");
            provider.save().then(function () {
                provider.set('error', '');
                workingTime.save().then(function (result) {
                    // Need to re-assign Id, a work we might be able to fix in the future when ember-data stablized
                    workingTime.set("id", result.get("id"));
                    workingTime.set('error', '');
                    //provider.get('providerWorkingTimes').insertAt(0, workingTime);
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