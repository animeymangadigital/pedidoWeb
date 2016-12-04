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

    self.pedidoName = ko.observable();

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

        var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                          "Julio", "Agosto", "Septiembre", "Octobre", "Noviembre", "Diciembre"];

        var date = new Date();
        var month = monthNames[date.getMonth()];
        var day = date.getDate();
        var year = date.getFullYear();
        console.log('Pedido del ' + day + ' Al ' + (day + 7) + ' De ' + month + 'Del' + year);
        self.pedidoName('Pedido del ' + day + ' Al ' + (day + 7) + ' De ' + month + ' Del ' + year);
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
        var date = new Date();
        var month = '' + (date.getMonth() + 1);
        var day = '' + date.getDate();
        var year = date.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        tmpElemento.download = 'pedido-' + [day, month, year].join('-') + '.xls';
        // Simulamos el click al elemento creado para descargarlo
        tmpElemento.click();
    };

    self.calculateTotal = function(data) {
        var reamin = data.remain() === undefined ? 0 : data.remain();
        var total = (data.de7a12 + data.de13a17 + data.de18a49) - parseFloat(reamin).toFixed(2);
        data.total(total < 0 ? 0 : parseFloat(total).toFixed(2));
    };

    self.cancel = function() {
      self.de7a12(null);
      self.de13a17(null);
      self.de18a49(null);
      self.cicloId(null);
    };

    self.calcular = function() {
        self.isloading(true);
        return $.ajax({
            type: 'POST',
            url: 'https://orderfoodciclos.herokuapp.com/pedidos',
            data: {
                de7a12 : self.de7a12(),
                de13a17: self.de13a17(),
                de18a49: self.de18a49(),
                cicloId: self.cicloId(),
            },
            headers: {
                "Authorization": "Bearer " + self.token
            }
        }).done(function(res) {

            res.sort(function(a, b) {
                if (a.title > b.title) {
                    return 1;
                }
                if (a.title < b.title) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            }).forEach(function(producto) {
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
});
