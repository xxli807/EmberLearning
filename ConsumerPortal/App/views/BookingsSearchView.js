App.BookingsSearchView = App.BaseView.extend({
    templateName: 'bookings-search',

    bookingNumber: null,
    
    familyName: "",
    givenName: "",
    phone: "",
    bookingDate: null,

    isDisabled: function() {
        var bookingNumber = this.get("bookingNumber");
        var familyName = this.get("familyName");
        var givenName = this.get("givenName");
        var phone = this.get("phone");
        var bookingDate = this.get("bookingDate");

        return !(familyName && givenName && phone && bookingDate || bookingNumber);
    }.property('bookingDate', 'familyName', 'givenName', 'phone', 'bookingNumber'),
    
    didInsertElement: function () {
        this._super();
        var self = this;

        var currentDate = new Date();

        var bookingCalendar = self.$('#bookingCalendar').datepicker({
            //todayHighlight: true,
            beforeShowDay: function (date) {
                var cDate = new Date();
                if ((date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate()) <
                    (cDate.getFullYear() * 10000 + cDate.getMonth() * 100 + cDate.getDate())) {
                    return false;
                }

                return true;
            }
        }).on("changeDate", function (e) {
            var date = moment(e.date);
            var minDate = moment(new Date()).hour(23).minute(59).second(59).add(-1, 'd');
            var maxDate = moment(new Date()).hour(0).minute(0).second(0).add(1, 'd').add(2, "M");
            if (date.isBefore(minDate) || maxDate.isBefore(date)) {
                bookingCalendar.datepicker("update", currentDate);
                e.result = false;
                return false;
            }
            currentDate = e.date;

            self.set("bookingDate", currentDate);
        }).on("changeMonth, changeYear", function (e) {
            var date = moment(e.date);
            var minDate = moment(new Date()).hour(23).minute(59).second(59).add(-1, 'd');
            var maxDate = moment(new Date()).hour(0).minute(0).second(0).add(1, 'd').add(2, "M");
            if (date.isBefore(minDate) || maxDate.isBefore(date)) {
                bookingCalendar.datepicker("update", currentDate);
                e.result = false;
                return false;
            }
        });
    },

    actions: {
        searchBooking: function (data) {
            var self = this;
            data = data || self;
            var params = {
                familyName: data.get("familyName"),
                givenName: data.get("givenName"),
                phone: data.get("phone"),
                bookingDate: data.get("bookingDate"),
                bookingNumber: data.get("bookingNumber"),
            };

            Em.Logger.debug('Value of new booking:', params);

            var box = SiteJS.ToastInfo("Searching... Please wait a moment.");
            var booking = null;
            self.controller.store.findQuery("booking", params).then(function (result) {
                booking = result.get("firstObject");
                box.close();
                if (booking) {
                    self.controller.replaceRoute('booking.status', booking.get("id"));
                } else {
                    self.set("warning", "Not found.");
                }
            }, function (result) {
                self.set("error", result.message);
            });
        }
    }
});