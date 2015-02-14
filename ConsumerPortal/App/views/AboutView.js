App.AboutView = App.BaseView.extend({
    templateName: 'about',
    didInsertElement: function () {
        this._super();
        var self = this;
        self.$('#wizardform').bootstrapWizard({
            tabClass: 'nav nav-tabs',
            onNext: function (tab, navigation, index) {
                var valid = false;
                $('[data-required="true"]', $($(tab.html()).attr('href'))).each(function () {
                    return (valid = $(this).parsley('validate'));
                });
                return valid;
            },
            onTabClick: function (tab, navigation, index) {
                return false;
            },
            onTabShow: function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;
                var $percent = ($current / $total) * 100;
                self.$('#wizardform').find('.progress-bar').css({ width: $percent + '%' });

                self.$('#wizardform').find('.submit').toggle(index == 2);
            }
        });

        self.$('#bookingCalendar').datepicker({
            //todayHighlight: true,
            beforeShowDay: function (date) {
                if (date.getMonth() == (new Date()).getMonth())
                    switch (date.getDate()) {
                        case 4:
                            return {
                                tooltip: 'Example tooltip',
                                classes: 'workingDay am'
                            };
                        case 8:
                            return {
                                tooltip: 'Example tooltip',
                                classes: 'workingDay',
                                enabled: false
                            };
                        case 12:
                            return "workingDay pm";
                        case 13:
                            return false;
                    }
            }
        }).on("changeDate", function(e) {
            var date = e.date;
            alert(date);
        });

        var superFillFunction = self.$('#bookingCalendar').data("datepicker").fill;

        self.$('#bookingCalendar').data("datepicker").fill = function() {
            superFillFunction.call(this);

            //this.picker.find('.datepicker-days tbody').find("td.disabled").css("color", "red");

            //this.picker.find('.datepicker-days tbody').find("td").append("<div class='pull-right workingTime'>ap</div>");
        };
        self.$('#bookingCalendar').data("datepicker").update();
    }
});