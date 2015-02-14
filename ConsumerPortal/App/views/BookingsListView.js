App.BookingsListView = App.BaseView.extend({
    templateName: 'bookings-list',

    didInsertElement: function () {
        this._super();
        var self = this;
        var table = self.$("#bookingsTable");

        setTimeout(function () {
            var oTable = table.DataTable({
                "pageLength": 20,
                "dom": "<'row'<'col-sm-6 col-xs-6'T><'col-sm-6 col-xs-6'f>r>t<'row'<'col-sm-6 col-xs-6'i><'col-sm-6 col-xs-6'p>>",
                "tableTools": {
                    "sSwfPath": "/Scripts/datatables/TableTools/copy_csv_xls_pdf.swf",
                    "aButtons": [
                        {
                            "sExtends": "text",
                            "sButtonText": "New Booking",
                            "fnClick": function (nButton, oConfig, oFlash) {
                                self.controller.replaceRoute('bookings.new');
                            }
                        }
                    ]
                }
            });

            table.find('tbody').on('click', 'tr', function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                }
                else {
                    table.find('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            });


        }, 10);
    },

    actions: {
        gotoEditView: function (booking) {
            var id = booking.id || null;
            this.controller.replaceRoute('booking.edit', id);
        }
    }
});