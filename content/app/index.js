var ViewModel = function() {
    var self = this;
    self.userName = ko.observable();

    self.init = function() {
        var token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        self.userName(localStorage.getItem("name"));
    };
    self.logout = function() {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        window.location.href = "/login";
    };
    self.init();
};

$(document).ready(function() {
    ko.applyBindings(new ViewModel());
})
