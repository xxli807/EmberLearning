App.BookingsNewView = App.BaseView.extend({
    templateName: 'bookings-new',

    providerId: 0,
    providerIdChanged: function () {
        var providerId = this.get('providerId');
        if (providerId) {
        }
    }.observes('providerId'),
    bookingDate: new Date(),
    atAM: false,
    atPM: false,

    bookingDateTime: function () {
        return this.get('bookingDate').toLocaleDateString() + (this.get('atAM') ? " A.M." : this.get('atPM') ? " P.M." : "");
    }.property('bookingDate', 'atAM', 'atPM'),

    providers: function () {
        var providers = this.controller.content;
        var first = providers.get("firstObject") || null;
        this.set('providerId', first == null ? null : first.get("id"));
        return providers;
    }.property(),

    providerName: function () {
        var providerId = this.get('providerId');
        var providers = this.get('providers');

        var provider = providers.filter(function (item, index, self) {
            return item.id == providerId;
        })[0];

        return provider ? provider.fullName : "";
    }.property('providerId'),

    workingDays: function () {
        var providerId = this.get('providerId');
        var providers = this.get('providers');
        var provider = providers.filter(function (item, index, self) {
            return item.id == providerId;
        })[0];
        var datas = {};
        if (provider) {
            var workingTime = provider.get("providerWorkingTimes").get("firstObject") || null;
            var date = moment();
            var maxDate = moment().add(2, 'months');
            var settings = 0;
            while (!date.isAfter(maxDate) && workingTime) {
                switch (date.day()) {
                    case 0:
                        settings = workingTime.get("sunday");
                        break;
                    case 1:
                        settings = workingTime.get("monday");
                        break;
                    case 2:
                        settings = workingTime.get("tuesday");
                        break;
                    case 3:
                        settings = workingTime.get("wednesday");
                        break;
                    case 4:
                        settings = workingTime.get("thursday");
                        break;
                    case 5:
                        settings = workingTime.get("friday");
                        break;
                    case 6:
                        settings = workingTime.get("saturday");
                        break;
                    default:
                        settings = 0;
                        break;
                }
                if (settings > 0) {
                    datas[date.format('DD/MM/YYYY')] = settings == 3 ? [1, 1, ''] :
                        settings == 1 ? [1, 0, , ''] :
                        settings == 2 ? [0, 1, ''] :
                        [0, 0, , ''];
                }

                date = date.add(1, 'days');
            }
        }

        return datas;
    }.property('providerId'),
    workingDaysChanged: function () {
        var bookingCalendar = this.$('#bookingCalendar').datepicker();
        bookingCalendar && bookingCalendar.datepicker("update", new Date());
    }.observes('workingDays'),

    disabledDays: function () {
        var providerId = this.get('providerId');
        var datas = {};
        return datas;
    }.property('providerId'),

    isWorkingDay: function () {
        var workingDays = this.get('workingDays');
        var bookingDate = this.get('bookingDate');
        var dateString = moment(bookingDate).format("DD/MM/YYYY");
        var workingDay = workingDays[dateString];
        return workingDay;
    }.property('workingDays', 'bookingDate'),

    isDisabledDay: function () {
        var disabledDays = this.get('disabledDays');
        var bookingDate = this.get('bookingDate');
        var dateString = moment(bookingDate).format("DD/MM/YYYY");
        var disabledDay = disabledDays[dateString];
        return disabledDay;
    }.property('disabledDays', 'bookingDate'),



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
                var isLastStep = index == 2;
                self.$('#wizardform').find('.progress-bar').css({ width: $percent + '%' });

                self.$('#wizardform').find('.submit').toggle(isLastStep);
                if (isLastStep) {
                }
            }
        });
        var workingDays = self.get("workingDays");
        var disabledDays = self.get("disabledDays");
        var currentDate = new Date();

        self.$('#doctorName').change(function () {
            workingDays = self.get("workingDays");
            disabledDays = self.get("disabledDays");
            //bookingCalendar && bookingCalendar.datepicker("update", currentDate);
        }).change();


        var bookingCalendar = self.$('#bookingCalendar').datepicker({
            //todayHighlight: true,
            beforeShowDay: function (date) {
                var dateString = moment(date).format("DD/MM/YYYY");
                var workingDay = self.get("workingDays")[dateString];
                var disabledDay = disabledDays[dateString];

                if (disabledDay) {
                    return {
                        enabled: false,
                        tooltip: disabledDay[1]
                    };
                } else if (workingDay) {
                    return {
                        enabled: true,
                        classes: "workingDay " + (workingDay[0] == 1 ? " am" : "") + (workingDay[1] == 1 ? " pm" : ""),
                        tooltip: workingDay[2]
                    };
                } else {
                    return {
                        enabled: true,
                        classes: "",
                        tooltip: null
                    };
                }
            }
        }).on("changeDate", function (e) {
            var date = moment(e.date);
            var minDate = moment(new Date());
            var maxDate = moment(new Date()).date(1).add(2, "M");
            if (date.isBefore(minDate) || maxDate.isBefore(date)) {
                bookingCalendar.datepicker("update", currentDate);
                e.result = false;
                return false;
            }
            currentDate = e.date;

            self.set("bookingDate", currentDate);
            var dateString = moment(date).format("DD/MM/YYYY");
            var workingDay = self.get("workingDays")[dateString];
            var disabledDay = disabledDays[dateString];
            self.set("atAM", false);
            self.set("atPM", false);
            if (workingDay) {
                if (workingDay[0] == 1) {
                    self.set("atAM", true);
                } else if (workingDay[1] == 1) {
                    self.set("atPM", true);
                }
            }

        }).on("changeMonth, changeYear", function (e) {
            var date = moment(e.date);
            var minDate = moment(new Date());
            var maxDate = moment(new Date()).date(1).add(2, "M");
            if (date.isBefore(minDate) || maxDate.isBefore(date)) {
                bookingCalendar.datepicker("update", currentDate);
                e.result = false;
                return false;
            }
        });

        //var superFillFunction = bookingCalendar.data("datepicker").fill;
        //bookingCalendar.data("datepicker").fill = function () {
        //    superFillFunction.call(this);
        //};
        bookingCalendar.datepicker("update", currentDate);


    },

    actions: {
        addBooking: function (data) {
            var self = this;
            data = data || self;
            var booking = {
                familyName: data.get("familyName"),
                givenName: data.get("givenName"),
                contactEmail: data.get("contactEmail"),
                contactPhone: data.get("contactPhone"),
                visitReason: data.get("visitReason"),
                bookingDate: data.get("bookingDate"),
                atAM: data.get("atAM"),
                atPM: data.get("atPM"),
                providerId: data.get("providerId"),
            };

            Em.Logger.debug('Value of new booking:', booking);

            booking = self.controller.store.createRecord("booking", booking);

            var box = SiteJS.ToastInfo("The data is submiting. Please wait a moment.");
            booking.save().then(function (result) {
                // Need to re-assign Id, a work we might be able to fix in the future when ember-data stablized
                booking.set("id", result.get("id"));
                booking.set("status", result.get("status"));
                booking.set("bookingNumber", result.get("bookingNumber"));
                booking.set('error', '');
                box.close();
                self.set("success", 'Your Booking has been submit. \nPlease wait the contact message. \nPlease record your booking number "' + booking.get("bookingNumber") + '"');
                self.controller.replaceRoute('booking.status', booking.get("id"));
            }, function (result) {
                booking.set("error", "Error: " + result.message);
                self.set("error", result.message);
            });
        }
    }
});