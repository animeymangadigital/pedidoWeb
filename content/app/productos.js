var ViewModel = function() {
    var self = this;
    self.minutas = ko.observableArray();
    self.productos = ko.observableArray();
    self.isEditing = ko.observable(false);
    self.isloading = ko.observable(false);
    self.token = localStorage.getItem("token");

    self.pageSize = ko.observable(10);
    self.pageIndex = ko.observable(0);

    self.formActionName = ko.computed(function() {
        return  self.isEditing() === true ? 'Editar Producto' : 'Agregar Producto' ;
    });

    self.productoId = ko.observable();
    self.productoName = ko.observable();
    self.de7a12 = ko.observable();
    self.de13a17 = ko.observable();
    self.de18a49 = ko.observable();
    self.unidad = ko.observable();
    self.type = ko.observable();
    self.minutaId = ko.observable();

    self.init = function() {
        if (!self.token) {
            window.location.href = "/login";
        }
        getProductos();
    };

    self.getTypeName = function(type) {
        var name = '';
        switch (type) {
            case "abarrotes":
                name = 'Abarrotes';
                break;
            case "panaderia":
                name = 'Panadería';
                break;
            case "lacteos":
                name = 'Huevos y Lácteos';
                break;
            case "carnes":
                name = 'Carnes';
                break;
            case "fruver":
                name = 'Frutas y Verduras';
                break;
            default:
                name = 'Otros';
        }
        return name;
    };

    self.logout = function() {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    self.goToSave = function() {
       if(self.isEditing()){
         self.edit();
       }else{
         self.save();
       }
    };

    self.save = function() {
       if(!self.productoName() ||
       !self.de7a12() ||
       !self.de13a17()||
       !self.de18a49()||
       !self.unidad()||
       !self.type()|| !self.minutaId()){
         alert('Todos los campos debes llenarlos');
         return;
       }

        return $.ajax({
            type: 'POST',
            url: 'https://orderfoodciclos.herokuapp.com/productos',
            data: {
                title: self.productoName(),
                de7a12 : self.de7a12(),
                de13a17: self.de13a17(),
                de18a49: self.de18a49(),
                unidad: self.unidad(),
                type: self.type(),
                minutaId: self.minutaId(),
            },
            headers: {
                "Authorization": "Bearer " + self.token
            }
        }).done(function(res) {
            getProductos();
        }).fail(function(err) {
            if (err.status === 401) {
                window.location.href = "/login";
            }
        });
    };

    function getProductos() {
        self.isloading(true);
        return $.when($.ajax({
            type: 'GET',
            url: 'https://orderfoodciclos.herokuapp.com/productos',
            headers: {
                "Authorization": "Bearer " + self.token
            }
        }), $.ajax({
            type: 'GET',
            url: 'https://orderfoodciclos.herokuapp.com/minutas',
            headers: {
                "Authorization": "Bearer " + self.token
            }
        })).done(function(productos, minutas) {
            self.minutas(minutas[0]);
            self.productos(productos[0]);
            self.cancel();
        }).fail(function(err) {
            if (err.status === 401) {
                window.location.href = "/login";
            }
        });
    }

    self.delete = function(data) {
        var r = confirm("Seguro quiere eliminar el producto???");
        if (r == true) {
            return $.ajax({
                type: 'DELETE',
                url: 'https://orderfoodciclos.herokuapp.com/productos/' + data._id,
                headers: {
                    "Authorization": "Bearer " + self.token
                }
            }).done(function(res) {
                getProductos();
            }).fail(function(err) {
                if (err.status === 401) {
                    window.location.href = "/login";
                }
            });
        }
    };

    self.cancel = function() {
        self.isEditing(false);
        self.isloading(false);
        self.productoId(null);
        self.productoName(null);
        self.de7a12(null);
        self.de13a17(null);
        self.de18a49(null);
        self.unidad(null);
        self.type(null);
        self.minutaId(null);
    };

    self.goToEdit = function(data) {
        self.isEditing(true);
        self.productoId(data._id);
        self.productoName(data.title);
        self.de7a12(data.de7a12);
        self.de13a17(data.de13a17);
        self.de18a49(data.de18a49);
        self.unidad(data.unidad);
        self.type(data.type);
        self.minutaId(data.minutaId);
    };

    self.getMinutaName = function(minutaId) {
        var minuta = ko.utils.arrayFirst(self.minutas(), function(item) {
            return item._id === minutaId;
        });
        return minuta ? minuta.title : '';
    };

    self.edit = function() {
      if(!self.productoName() ||
      !self.de7a12() ||
      !self.de13a17()||
      !self.de18a49()||
      !self.unidad()||
      !self.type()|| !self.minutaId()){
        alert('Todos los campos debes llenarlos');
        return;
      }
        return $.ajax({
            type: 'PUT',
            url: 'https://orderfoodciclos.herokuapp.com/productos/' + self.productoId(),
            data: {
                title: self.productoName(),
                de7a12 : self.de7a12(),
                de13a17: self.de13a17(),
                de18a49: self.de18a49(),
                unidad: self.unidad(),
                type: self.type(),
                minutaId: self.minutaId(),
            },
            headers: {
                "Authorization": "Bearer " + self.token
            }
        }).done(function(res) {
            getProductos();
        }).fail(function(err) {
            if (err.status === 401) {
                window.location.href = "/login";
            }
        });
    };

    self.pagedList = ko.dependentObservable(function () {
        var size = self.pageSize();
        var start = self.pageIndex() * size;
        $("[rel='tooltip']").tooltip();
        return self.productos.slice(start, start + size);
    });

    self.maxPageIndex = ko.dependentObservable(function () {
        return Math.ceil(self.productos().length/self.pageSize())-1;
    });

    self.previousPage = function () {
        if (self.pageIndex() > 0) {
            self.pageIndex(self.pageIndex() - 1);
        }
    };

    self.nextPage = function () {
        if (self.pageIndex() < self.maxPageIndex()) {
            self.pageIndex(self.pageIndex() + 1);
        }
    };

    self.moveToPage = function (index) {
        self.pageIndex(index);
    };

    self.init();
};

$(document).ready(function() {
    ko.applyBindings(new ViewModel());
})
