var ViewModel = function() {
    var self = this;
    self.ciclos = ko.observableArray();
    self.init = function() {
        var token = "Bearer " + localStorage.getItem("token");
        return $.ajax({
            type: 'GET',
            url: 'https://orderfoodciclos.herokuapp.com/ciclos',
            headers: { "Authorization": token }
        }).done(function(res) {
            self.ciclos(res);
        });
    };
    self.init();
};

$(document).ready(function() {
    ko.applyBindings(new ViewModel());
})
