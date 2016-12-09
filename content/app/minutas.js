var ViewModel = function() {
    var self = this;
    self.minutas = ko.observableArray();
    self.ciclos = ko.observableArray();
    self.isEditing = ko.observable(false);
    self.isloading = ko.observable(false);
    self.minutaName = ko.observable();
    self.minutaId = ko.observable();
    self.cicloId = ko.observable();
    self.token = localStorage.getItem("token");

    self.formActionName = ko.computed(function() {
        return self.isEditing() === true ? 'Editar Minuta' : 'Agregar Minuta';
    });

    self.init = function() {
        if (!self.token) {
            window.location.href = "/login";
        }
        getMinutas();
    };

    self.logout = function() {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    self.save = function() {
        if (!self.minutaName() || !self.cicloId()) {
            alert('No se puede crear una minuta sin que le llenes el nombre o escojas un ciclo');
            return;
        }

        self.isloading(true);
        return $.ajax({
            type: 'POST',
            url: 'https://orderfoodciclos.herokuapp.com/minutas',
            data: {
                title: self.minutaName(),
                cicloId: self.cicloId()
            },
            headers: {
                "Authorization": "Bearer " + self.token
            }
        }).done(function(res) {
            getMinutas();
        }).fail(function(err) {
            if (err.status === 401) {
                window.location.href = "/login";
            }
        });
    };

    function getMinutas() {
        self.isloading(true);
        return $.when($.ajax({
            type: 'GET',
            url: 'https://orderfoodciclos.herokuapp.com/minutas',
            headers: {
                "Authorization": "Bearer " + self.token
            }
        }), $.ajax({
            type: 'GET',
            url: 'https://orderfoodciclos.herokuapp.com/ciclos',
            headers: {
                "Authorization": "Bearer " + self.token
            }
        })).done(function(minutas, ciclos) {
            self.minutas(minutas[0].sort(function(a, b) {
                if (a.title > b.title) {
                    return 1;
                }
                if (a.title < b.title) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            }));

            self.ciclos(ciclos[0]);
            self.cancel();
            $("[rel='tooltip']").tooltip();
        }).fail(function(err) {
            if (err.status === 401) {
                window.location.href = "/login";
            }
        });
    }

    self.delete = function(data) {
        var r = confirm("Seguro quiere eliminar la minuta???");
        if (r == true) {
            self.isloading(true);
            return $.ajax({
                type: 'DELETE',
                url: 'https://orderfoodciclos.herokuapp.com/minutas/' + data._id,
                headers: {
                    "Authorization": "Bearer " + self.token
                }
            }).done(function(res) {
                getMinutas();
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
        self.minutaId(null);
        self.minutaName(null);
        self.cicloId(null);
    };

    self.goToSave = function() {
        if (self.isEditing()) {
            self.edit();
        } else {
            self.save();
        }
    };

    self.goToEdit = function(data) {
        self.isEditing(true);
        self.minutaId(data._id);
        self.minutaName(data.title);
        self.cicloId(data.cicloId);
        $('#minutaName').focus();
    };

    self.getCicloName = function(cicloId) {
        var ciclo = ko.utils.arrayFirst(self.ciclos(), function(item) {
            return item._id === cicloId;
        });
        return ciclo ? ciclo.title : '';
    };

    self.edit = function() {
        if (!self.minutaName() || !self.cicloId()) {
            alert('No se puede crear una minuta sin que le llenes el nombre o escojas un ciclo');
            return;
        }
        self.isloading(true);
        return $.ajax({
            type: 'PUT',
            url: 'https://orderfoodciclos.herokuapp.com/minutas/' + self.minutaId(),
            data: {
                title: self.minutaName(),
                cicloId: self.cicloId()
            },
            headers: {
                "Authorization": "Bearer " + self.token
            }
        }).done(function(res) {
            getMinutas();
        }).fail(function(err) {
            if (err.status === 401) {
                window.location.href = "/login";
            }
        });
    };

    self.init();
};

$(document).ready(function() {
    ko.applyBindings(new ViewModel());
})
