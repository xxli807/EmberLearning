App.BookingEditView = App.BaseView.extend({
    templateName: 'booking-edit',

    booking: function () {
        var booking = this.controller.content.booking;
        booking && this.set("providerId", +booking.get("providerId"));

        if (booking && arguments.length > 1) {
            this.controller.content.booking = booking;
        }

        return booking;
    }.property(),
    status: function (status) {
        var booking = this.get("booking");

        if (booking && arguments.length > 1) {
            booking.set("status", status);
        }

        return booking == null ? "" : booking.get("status");
    }.property('booking'),
    bookingNumber: function () {
        var booking = this.get("booking");
        return booking == null ? "" : booking.get("bookingNumber");
    }.property('booking'),
    bookingDateTime: function () {
        var booking = this.get("booking");
        var date = booking.get("bookingDate");
        var am = booking.get("atAM");
        var ret = date ? date.toLocaleDateString() : '';
        ret += am ? " A.M." : " P.M.";
        return ret;
    }.property('booking'),

    consumerName: function () {
        var booking = this.get("booking");
        return booking == null ? false : booking.get("fullName");
    }.property('booking'),
    contactPhone: function () {
        var booking = this.get("booking");
        return booking == null ? "" : booking.get("contactPhone");
    }.property('booking'),
    contactEmail: function () {
        var booking = this.get("booking");
        return booking == null ? "" : booking.get("contactEmail");
    }.property('booking'),
    bookingDateTime: function () {
        var booking = this.get("booking");
        return booking == null ? "" : booking.get("bookingDateTime");
    }.property('booking'),
    bookingDate: function (date) {
        var booking = this.get("booking");

        if (booking && arguments.length > 1) {
            booking.set("bookingDate", date);
            this.set("booking", booking);
        }

        return booking == null ? "" : booking.get("bookingDate");
    }.property('booking'),
    atAM: function (isAM) {
        var booking = this.get("booking");

        if (booking && arguments.length > 1) {
            booking.set("atAM", isAM);
            this.set("booking", booking);
        }

        return booking == null ? "" : booking.get("atAM");
    }.property('booking'),
    atPM: function (isPM) {
        var booking = this.get("booking");

        if (booking && arguments.length > 1) {
            booking.set("atPM", isPM);
            this.set("booking", booking);
        }

        return booking == null ? "" : booking.get("atPM");
    }.property('booking'),

    isApplied: function () {
        var booking = this.get("booking");
        return booking == null ? false : booking.get("isApplied");
    }.property('booking'),
    isScheduled: function () {
        var booking = this.get("booking");
        return booking == null ? false : booking.get("isScheduled");
    }.property('booking'),
    isCanceled: function () {
        var booking = this.get("booking");
        return booking == null ? false : booking.get("isCanceled");
    }.property('booking'),
    isRejected: function () {
        var booking = this.get("booking");
        return booking == null ? false : booking.get("isRejected");
    }.property('booking'),
    isOverdue: function () {
        var booking = this.get("booking");
        var date = booking.get("bookingDate");
        var cDate = new Date();

        return (date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate()) <
            (cDate.getFullYear() * 10000 + cDate.getMonth() * 100 + cDate.getDate());
    }.property('booking'),


    providers: function () {
        var providers = this.controller.content.providers;
        return providers;
    }.property(),
    providerId: 1,
    provider: function () {
        var providerId = +this.get('providerId');
        var providers = this.get('providers');
        var provider = providers.filter(function (item, index, self) {
            return item.id == providerId;
        }).get("firstObject");
        return provider;
    }.property('providerId'),
    providerName: function () {
        var provider = this.get('provider');
        return provider ? provider.get("fullName") : "";
    }.property('provider'),

    workingDays: function () {
        var provider = this.get("provider");
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
    }.property('provider'),
    workingDaysChanged: function () {
        var bookingCalendar = this.uiHolder["bookingCalendar"];
        bookingCalendar && bookingCalendar.datepicker("update", new Date());
    }.observes('workingDays'),

    disabledDays: function () {
        var datas = {};
        return datas;
    }.property('provider'),

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

    uiHolder: {},

    didInsertElement: function () {
        this._super();
        var self = this;

        var workingDays = self.get("workingDays");
        var disabledDays = self.get("disabledDays");
        var currentDate = self.get("bookingDate");

        self.$(":radio[name='status']").click(function () {
            var value = $(this).val();
            self.set("status", value);
        });

        self.$('#doctorName').change(function () {
            self.set("providerId", +$(this).val());
            workingDays = self.get("workingDays");
            disabledDays = self.get("disabledDays");
        });

        var bookingCalendar = self.$('#bookingCalendar').datepicker({
            //todayHighlight: true,
            beforeShowDay: function (date) {
                var dateString = moment(date).format("DD/MM/YYYY");
                var workingDay = self.get("workingDays")[dateString];
                var disabledDay = disabledDays[dateString];

                if (moment(currentDate).format("DD/MM/YYYY") == dateString) {
                    return {
                        enabled: true,
                        classes: "active",
                        tooltip: null
                    };
                } else if (disabledDay) {
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
            },
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
            bookingCalendar.datepicker("update");
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
        self.uiHolder["bookingCalendar"] = bookingCalendar;
        //var superFillFunction = bookingCalendar.data("datepicker").fill;
        //bookingCalendar.data("datepicker").fill = function () {
        //    superFillFunction.call(this);
        //};
        bookingCalendar.datepicker("update");
        self.set("providerId", self.get("booking").get("providerId"));
        self.$('#doctorName').val(self.get("providerId"));
    },

    actions: {
        saveBooking: function (data) {
            var self = this;
            data = data || self;
            var booking = self.get("booking");
            var provider = self.get("provider");
            booking.set("providerId", +self.get("providerId"));
            booking.set("bookingDate", self.get("bookingDate"));
            booking.set("atAM", self.get("atAM"));
            booking.set("atPM", self.get("atPM"));
            booking.set("provider", null);
            Em.Logger.debug('Value of new booking:', booking);

            var box = SiteJS.ToastInfo("The data is submiting. Please wait a moment.");
            booking.save().then(function (result) {
                booking.set("provider", result.get("provider"));
                booking.set('error', '');
                box.close();
                self.set("success", 'Your Booking has been submit. \nPlease wait the contact message. \nPlease record your booking number "' + booking.get("bookingNumber") + '"');
                self.controller.replaceRoute('bookings.list');
            }, function (result) {
                booking.set("error", "Error: " + result.message);
                self.set("error", result.message);
            });
        },
        gotoListView: function (booking) {
            this.controller.replaceRoute('bookings.list');
        }
    }
});