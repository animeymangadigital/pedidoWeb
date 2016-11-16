var ViewModel = function() {
    var self = this;
    self.ciclos = ko.observableArray();
    self.productos = ko.observableArray();
    self.isloading = ko.observable(false);
    self.showProds = ko.observable(false);
    self.de7a12 = ko.observable();
    self.de13a17 = ko.observable();
    self.de18a49 = ko.observable();
    self.cicloId = ko.observable();
    self.token = localStorage.getItem("token");
    self.init = function() {
        if (!self.token) {
            window.location.href = "/login";
        }
        getCiclos();
    };

    self.logout = function() {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    self.calcular = function() {
        self.isloading(true);
        return $.ajax({
            type: 'POST',
            url: 'https://orderfoodciclos.herokuapp.com/pedidos',
            data: {
                de7a12 : self.de7a12(),
                de13a17: self.de13a17(),
                de18a49: self.de18a49(),
                cicloId: self.cicloId(),
            },
            headers: {
                "Authorization": "Bearer " + self.token
            }
        }).done(function(res) {
            self.productos(res);
            self.showProds(true);
        }).fail(function(err) {
            if (err.status === 401) {
                window.location.href = "/login";
            }
        });
    };

    function getCiclos() {
        self.isloading(true);
        return $.ajax({
            type: 'GET',
            url: 'https://orderfoodciclos.herokuapp.com/ciclos',
            headers: {
                "Authorization": "Bearer " + self.token
            }
        }).done(function(res) {
            self.ciclos(res);
            self.isloading(false);
        }).fail(function(err) {
            if (err.status === 401) {
                window.location.href = "/login";
            }
        });
    }
    self.init();
};

$(document).ready(function() {
    ko.applyBindings(new ViewModel());
})
