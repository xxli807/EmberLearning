App.Router.map(function () {
    this.route("index", { path: "/" });

    this.resource("bookings", { path: "/bookings" }, function() {
        this.resource("booking", { path: "/:booking_id" }, function () {
            this.route("edit", { path: "/edit" });
            this.route("status", { path: "/status" });
        });
        this.route("new", { path: "/new" });
        this.route("list", { path: "/list" });
        this.route("calendar", { path: "/calendar" });
        this.route("search", { path: "/search" });
    });

    this.resource("providers", { path: "/providers" }, function () {
        this.resource("provider", { path: "/:provider_id" }, function () {
            this.route("edit", { path: "/edit" });
        });
        this.route("new", { path: "/new" });
        this.route("list", { path: "/list" });
        this.route("calendar", { path: "/calendar" });
    });

    this.resource("user", { path: "/user" }, function() {
        this.route("profile", { path: "/profile" });
        this.route("calendar", { path: "/calendar" });
    });
});