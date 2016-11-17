var ViewModel = function() {
    var self = this;
    self.ciclos = ko.observableArray();
    self.productos = ko.observableArray();
    self.isloading = ko.observable(false);
    self.showProds = ko.observable(false);
    self.showTableProds = ko.observable(false);
    self.hideList = ko.computed(function() {
        return !(self.showProds() || self.showTableProds() || self.isloading());
    });
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
    self.prepararPedido = function() {
        self.showTableProds(true);
        self.showProds(false);
    };
    self.download = function() {
      //Creamos un Elemento Temporal en forma de enlace
        var tmpElemento = document.createElement('a');
        // obtenemos la información desde el div que lo contiene en el html
        // Obtenemos la información de la tabla
        var data_type = 'data:application/vnd.ms-excel';
        var tabla_div = document.getElementById('pedidoTableGenerate');
        var tabla_html = tabla_div.outerHTML.replace(/ /g, '%20');
        tmpElemento.href = data_type + ', ' + tabla_html;
        //Asignamos el nombre a nuestro EXCEL
        tmpElemento.download = 'Nombre_De_Mi_Excel.xls';
        // Simulamos el click al elemento creado para descargarlo
        tmpElemento.click();
    };

    self.calculateTotal = function(data) {
        var total = (data.de7a12 + data.de13a17 + data.de18a49) - data.remain();
        data.total(total < 0 ? 0 : parseFloat(total).toFixed(2));
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
            res.forEach(function(producto) {
                producto.remain = ko.observable();
                producto.total = ko.observable(parseFloat(producto.de7a12 + producto.de13a17 + producto.de18a49).toFixed(2));
                self.productos.push(producto);
            });

            self.showProds(true);
            self.isloading(false);
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
