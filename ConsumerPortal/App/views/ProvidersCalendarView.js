App.ProvidersCalendarView = App.BaseView.extend({
    templateName: 'providers-calendar',
    bookings: [],
    didInsertElement: function () {
        this._super();
        var self = this;
        var bookings = self.controller.content;
        bookings = bookings.map(function (item) {
            var date = item.get("bookingDate");
            var start = item.get("startTime") || date;
            start = moment(start);
            var end = item.get("endTime") || start.add(30, 'm');
            end = moment(end);
            return {
                id: item.get("id"),
                title: '',
                allDay: false,
                start: start,
                end: end,
                className: 'wrapper-xs b-l b-3x b-info',
                bookingData: {
                    user: { fullName: item.get("fullName") },
                    provider: { fullName: item.get("provider").get("fullName") },
                    date: date,
                    isAM: item.get("atAM"),
                    isApproved: item.get("isScheduled"),
                    chiefComplaint: item.get("visitReason")
                }
            };
        });

        var unasignEvents = bookings.filter(function (evt, index, self) {
            return !evt.bookingData.isApproved;
        });

        // fullcalendar
        var addDragEvent = function ($this) {
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = null;
            var eventId = +$this.data("eventId");
            bookings.forEach(function (evt) {
                if (evt.id == eventId) {
                    eventObject = evt;
                    return false;
                }
            });

            // store the Event Object in the DOM element so we can get to it later
            $this.data('eventObject', eventObject);

            // make the event draggable using jQuery UI
            $this.draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0,  //  original position after the drag
                start: function (event, ui) {
                    $this.popover("hide");
                }
            });
        };

        var isDragDroping = false;
        function getPopupContent(event) {
            var data = event.bookingData;

            var html = '<dl class="dl-horizontal dl-xs">';

            html += '<dt>Patient</dt><dd>' + data.user.fullName + '</dd>';
            html += '<dt>Provider</dt><dd>' + data.provider.fullName + '</dd>';
            if (event.start) {
                var duration = event.allDay ? "All Day" : event.end - event.start;
                if (typeof duration === "number") {
                    duration = (duration / 60000) + " Minutes";
                }
                html += '<dt>Date</dt><dd>' + event.start.format('DD/MM/YYYY') + '</dd>';
                html += '<dt>Time</dt><dd>' + event.start.format('HH:mm') + '</dd>';
                html += '<dt>Duration</dt><dd>' + duration + '</dd>';
            } else {
                html += '<dt>Date</dt><dd>' + data.date.toLocaleDateString('en-GB') + '</dd>';
                html += '<dt>Time</dt><dd>' + (data.isAM ? "A.M." : "P.M.") + '</dd>';
            }
            html += '</dl><br/>';

            html += '<dl class="clearfix">';
            html += '<dt>Chief Complains</dt><dd>' + data.chiefComplaint + '</dd>';
            html += '</dl>';
            return html;
        }
        function getEventTitle(event, format) {
            var data = event.bookingData;
            var title = "Event";
            switch (format) {
                case "list":
                    title = [data.date.toLocaleDateString('en-GB'),
                        (data.isAM ? "A.M." : "P.M."),
                        "Dr. " + data.provider.fullName,
                        "with Pt. " + data.user.fullName,
                    ].join(" ");
                    break;
                case "calendar":
                    title = [
                        "Dr. " + data.provider.fullName,
                        "with Pt. " + data.user.fullName,
                    ].join(" ");
                    break;
            }
            return title;
        }
        function initPopover(event, element, viewPort) {
            viewPort = $(viewPort || "body");
            $(element).popover("destroy");
            $(element).popover({
                html: true,
                title: 'Booking Details',
                content: getPopupContent(event),
                trigger: 'hover',
                viewport: { "selector": viewPort.selector, "padding": 0 },
                container: viewPort.selector,
                placement: 'bottom'
            });
            $(element).on('show.bs.popover', function () {
                // do something…
                if (isDragDroping) {
                    $(element).popover("hide");
                    return false;
                }
            });
        }
        function saveEvent(event, callback) {
            var booking = self.controller.store.find("booking", event.id).then(function(item) {
                var status = item.get("status");
                var start = item.get("startTime");
                var end = item.get("endTime");
                var date = item.get("bookingDate");
                var provider = item.get("provider");

                item.set("bookingDate", event.start.toDate());
                item.set("startTime", event.start.toDate());
                item.set("endTime", event.end.toDate());
                item.set("status", "Scheduled");
                item.set("provider", null);

                item.save().then(function () {
                    item.set('error', '');
                    item.set("provider", provider);
                    if (typeof callback === "function") {
                        callback.call(this);
                    }

                }, function (result) {
                    item.set("error", "Error: " + result.message);

                    item.set("provider", provider);
                    item.set("bookingDate", date);
                    item.set("startTime", start);
                    item.set("endTime", end);
                    item.set("status", status);

                    self.set("error", result.message);
                });
            });
        }

        self.$('.calendar').each(function () {
            var calendar = $(this);
            calendar = calendar.fullCalendar({
                header: {
                    left: 'prev',
                    center: 'title',
                    right: 'next'
                },
                editable: true,
                droppable: true, // this allows things to be dropped onto the calendar !!!
                eventResizeStart: function (event, jsEvent, ui, view) {
                    isDragDroping = true;
                },
                eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
                    isDragDroping = false;
                },
                eventDragStart: function (event, jsEvent, ui, view) {
                    isDragDroping = true;
                },
                eventDrop: function (event, delta, revertFunc) {
                    //revertFunc();
                    isDragDroping = false;
                },

                drop: function (date, allDay) { // this function is called when something is dropped

                    var droppedElement = $(this);
                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = droppedElement.data('eventObject');

                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;
                    copiedEventObject.end = date.add(30, 'm');
                    copiedEventObject.allDay = allDay;
                    copiedEventObject.title = getEventTitle(copiedEventObject, "calendar");
                    copiedEventObject.bookingData.isApproved = true;

                    saveEvent(copiedEventObject, function () {
                        // render the event on the calendar
                        // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                        calendar.fullCalendar('renderEvent', copiedEventObject, true);

                        droppedElement.remove();
                    });
                },
                events: function (start, end, timezone, callback) {
                    var evts = bookings.filter(function (evt, index, self) {
                        return evt.bookingData.isApproved && evt.start >= start && evt.start <= end;
                    });
                    evts.forEach(function (evt) {
                        evt.title = getEventTitle(evt, "calendar");
                    });
                    callback(evts);
                },
                eventRender: function (event, element) {
                    initPopover(event, element, "#calendar");
                },
                eventTextColor: '#000000'
            });

        });

        unasignEvents.forEach(function (evt) {
            evt.title = getEventTitle(evt, "list");
            var item = $('<li class="m-b-xxs"><div class="r bg-white"></div></li>');
            item.appendTo(self.$('#myEvents ul'));
            item.find('div').text(evt.title).addClass(evt.className).data("eventId", evt.id);
            initPopover(evt, item.find('div'), "#myEvents");
        });

        self.$('#myEvents').on('change', function (e, item) {
            addDragEvent($(item));
        });

        self.$('#myEvents li > div').each(function () {
            addDragEvent($(this));
        });

        self.$('#dayview').on('click', function () {
            self.$('.calendar').fullCalendar('changeView', 'agendaDay');
        });

        self.$('#weekview').on('click', function () {
            self.$('.calendar').fullCalendar('changeView', 'agendaWeek');
        });

        self.$('#monthview').on('click', function () {
            self.$('.calendar').fullCalendar('changeView', 'month');
        });
    }
});