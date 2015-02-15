﻿using System.Web;
using System.Web.Optimization;

namespace ConsumerPortal
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/ComLib/jquery-{version}.js",
                "~/Scripts/ComLib/jquery-ui-{version}.js",
                "~/Scripts/ComLib/jquery.ui.touch-punch.min.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                "~/Scripts/ComLib/jquery.unobtrusive*",
                "~/Scripts/ComLib/jquery.validate*"
            ));
            bundles.Add(new ScriptBundle("~/bundles/plugins").Include(
                "~/Scripts/ComLib/moment.min.js",
                "~/Scripts/ComLib/qrcode.min.js",
                "~/Scripts/ComLib/parsley/parsley.min.js",
                "~/Scripts/ComLib/parsley/parsley.extend.js",
                "~/Scripts/ComLib/bootstrap.js",
                "~/Scripts/ComLib/slimscroll/jquery.slimscroll.min.js",
                //"~/Scripts/datepicker/bootstrap-datepicker.js",

                "~/Scripts/ComLib/bootstrap-datepicker/bootstrap-datepicker.js",
                "~/Scripts/ComLib/bootstrap-datepicker/locales/bootstrap-datepicker.ar.js",
                "~/Scripts/ComLib/wizard/jquery.bootstrap.wizard.js",
                "~/Scripts/ComLib/fullcalendar/fullcalendar.min.js",
                "~/Scripts/ComLib/noty/packaged/jquery.noty.packaged.js",

                // For Chart
                "~/Scripts/ComLib/charts/flot/jquery.flot.min.js",
                "~/Scripts/ComLib/charts/flot/jquery.flot.tooltip.min.js",
                "~/Scripts/ComLib/charts/flot/jquery.flot.resize.js",
                "~/Scripts/ComLib/charts/flot/jquery.flot.orderBars.js",
                "~/Scripts/ComLib/charts/flot/jquery.flot.pie.min.js",
                "~/Scripts/ComLib/charts/flot/jquery.flot.grow.js",
                //"~/Scripts/charts/flot/demo.js",

                "~/Scripts/ComLib/datatables/jquery.dataTables.min.js",
                "~/Scripts/ComLib/datatables/TableTools/dataTables.tableTools.min.js",
                "~/Scripts/ComLib/datatables/jquery.csv-0.71.min.js",

                "~/Scripts/ComLib/app.js",
                "~/Scripts/ComLib/app.plugin.js"
            ));

            /* 
             In developmet, the template will be rendered directly in the cshtml view
             See ~/Views/Home/App.cshtml 
              
             To enable the bundle with pre-compilation of Handlebars templates, edit 
             the web.config to disable debug, setting it to false:
             
             <configuration>
                 ...
                 <system.web>
                     <compilation debug="false" targetFramework="4.5" />
                     ...
             
             Optimizations must be enabled in Global.asax.cs Application_Start method:
             
             BundleTables.EnableOptimizations = true;
              
             The pre-compiled templates are minified by default
             If for some reason one needs the template not to be minified, do:
              
             bundles.Add(new Bundle("~/bundles/templates", 
                         new EmberHandlebarsBundleTransform() { minifyTemplate = false } ).Include(
                "~/app/templates/*.hbs"
             )); */
            if (!HttpContext.Current.IsDebuggingEnabled)
            {
                bundles.Add(new Bundle("~/bundles/templates",
                    new EmberHandlebarsBundleTransform()).IncludeDirectory("~/app/templates\\", "*.hbs", true)
                    );
            }
            bundles.Add(new ScriptBundle("~/bundles/ember").Include(
                "~/scripts/ComLib/handlebars.js",
                "~/scripts/ComLib/ember.js",
                "~/scripts/ComLib/ember-data.js",
                "~/app/webapi_serializer.js",
                "~/app/webapi_adapter.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/ajaxlogin").Include(
                "~/app/ajaxlogin.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/app/app.js",
                "~/app/router.js",
                "~/app/helpers.js"
                ).IncludeDirectory("~/app/routes", "*.js")
                 .IncludeDirectory("~/app/models", "*.js")
                 .IncludeDirectory("~/app/views", "*.js")
                 .IncludeDirectory("~/app/controllers", "*.js")
            );

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/ComLib/modernizr-*"
            ));

            bundles.Add(new Bundle("~/Content/styles", new CssMinify()).Include(
                //"~/Content/Site.css",
                //"~/Content/TodoList.css"
                "~/Content/css/bootstrap.css",
                "~/Content/css/animate.css",
                "~/Content/css/font-awesome.min.css",
                "~/Content/css/simple-line-icons.css",
                "~/Content/css/font.css",

                "~/Content/css/bootstrap-datepicker/datepicker3.css",
                "~/Content/css/fullcalendar.css",
                "~/Content/css/fullcalendar-theme.css",

                "~/Content/css/jquery.dataTables.min.css",
                "~/Content/css/dataTables.tableTools.min.css",
                "~/Content/css/datatables.css",

                "~/Content/css/app.css"
            ));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                "~/Content/themes/base/jquery.ui.core.css",
                "~/Content/themes/base/jquery.ui.resizable.css",
                "~/Content/themes/base/jquery.ui.selectable.css",
                "~/Content/themes/base/jquery.ui.accordion.css",
                "~/Content/themes/base/jquery.ui.autocomplete.css",
                "~/Content/themes/base/jquery.ui.button.css",
                "~/Content/themes/base/jquery.ui.dialog.css",
                "~/Content/themes/base/jquery.ui.slider.css",
                "~/Content/themes/base/jquery.ui.tabs.css",
                "~/Content/themes/base/jquery.ui.datepicker.css",
                "~/Content/themes/base/jquery.ui.progressbar.css",
                "~/Content/themes/base/jquery.ui.theme.css"
            ));
        }
    }
}