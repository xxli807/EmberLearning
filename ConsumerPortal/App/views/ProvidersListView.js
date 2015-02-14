App.ProvidersListView = App.BaseView.extend({
    templateName: 'providers-list',

    didInsertElement: function () {
        this._super();
        var self = this;
        var table = self.$("#providersTable");

        setTimeout(function () {
            var oTable = table.DataTable({
                "pageLength": 20,
                "dom": "<'row'<'col-sm-6 col-xs-6'T><'col-sm-6 col-xs-6'f>r>t<'row'<'col-sm-6 col-xs-6'i><'col-sm-6 col-xs-6'p>>",
                "tableTools": {
                    "sSwfPath": "/Scripts/datatables/TableTools/copy_csv_xls_pdf.swf",
                    "aButtons": [
                        {
                            "sExtends": "text",
                            "sButtonText": "New Provider",
                            "fnClick": function (nButton, oConfig, oFlash) {
                                self.controller.replaceRoute('providers.new');
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
        gotoEditView: function (provider) {
            var id = provider.id || null;
            this.controller.replaceRoute('provider.edit', id);
        }
    }

});