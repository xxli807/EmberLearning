App.IndexView = Ember.View.extend({
    didInsertElement: function () {
        this._super();

        var d2 = [];
        for (var i = 0; i <= 6; i += 1) {
            d2.push([i, parseInt((Math.floor(Math.random() * (1 + 30 - 10))) + 10)]);
        }
        var d3 = [];
        for (var i = 0; i <= 6; i += 1) {
            d3.push([i, parseInt((Math.floor(Math.random() * (1 + 30 - 10))) + 10)]);
        }
        $("#flot-chart").length && $.plot($("#flot-chart"), [{
            data: d2,
            label: "Your"
        }, {
            data: d3,
            label: "Normal"
        }],
            {
                series: {
                    lines: {
                        show: true,
                        lineWidth: 1,
                        fill: true,
                        fillColor: {
                            colors: [{
                                opacity: 0.3
                            }, {
                                opacity: 0.3
                            }]
                        }
                    },
                    points: {
                        show: true
                    },
                    shadowSize: 2
                },
                grid: {
                    hoverable: true,
                    clickable: true,
                    tickColor: "#f0f0f0",
                    borderWidth: 0
                },
                colors: ["#1bb399", "#177bbb"],
                xaxis: {
                    ticks: 15,
                    tickDecimals: 0
                },
                yaxis: {
                    ticks: 10,
                    tickDecimals: 0
                },
                tooltip: true,
                tooltipOpts: {
                    content: "'%s' of %x.1 is %y.4",
                    defaultTheme: false,
                    shifts: {
                        x: 0,
                        y: 20
                    }
                }
            }
        );

        // Create the demo X and Y axis labels

        var yaxisLabel = $("#flot-chart").parent().find(".yaxisLabel");
        var xaxisLabel = $("#flot-chart").parent().find(".xaxisLabel");

        // Since CSS transforms use the top-left corner of the label as the transform origin,
        // we need to center the y-axis label by shifting it down by half its width.
        // Subtract 20 to factor the chart's bottom margin into the centering.

        yaxisLabel.css("margin-top", yaxisLabel.width() / 2 - 20);
        xaxisLabel.css("margin-left", -xaxisLabel.width() / 2 - 20);

        // Update the random dataset at 25FPS for a smoothly-animating chart

    }
});