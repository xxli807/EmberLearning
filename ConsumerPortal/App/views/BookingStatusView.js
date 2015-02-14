App.BookingStatusView = App.BaseView.extend({
    templateName: 'booking-view',

    booking: function () {
        return this.controller.content;
    }.property(),
    bookingNumber: function() {
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



    
    didInsertElement: function () {
        this._super();
        var self = this;

        //self.set("booking", self.controller.content);

        var qrcode = self.$("#qrcode")[0];
        if (qrcode) {
            qrcode = new QRCode(qrcode, {
                width: 128,
                height: 128
            });

            var text = self.get("bookingNumber");
            qrcode.makeCode(text);
        }
    },

    actions: {
    }
});