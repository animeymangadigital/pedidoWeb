var ViewModel = function() {
    var self = this;
    self.ciclos = ko.observableArray();
    self.isEditing = ko.observable(false);
    self.isloading = ko.observable(false);
    self.userName = ko.observable();
    self.cicloNameExcel = ko.observable();
    self.cicloName = ko.observable();
    self.cicloId = ko.observable();
    self.token = localStorage.getItem("token");
    self.formActionName = ko.computed(function() {
        return self.isEditing() === true ? 'Editar Ciclo' : 'Agregar Ciclo';
    });

    self.init = function() {
        if (!self.token) {
            window.location.href = "/login";
        }
        self.userName(localStorage.getItem("name"));
        getCiclos();
    };

    self.logout = function() {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        window.location.href = "/login";
    };

    self.save = function() {
        if (!self.cicloName() || !self.cicloNameExcel()) {
            alert('No se puede crear un ciclo sin que le llenes los nombres');
            return;
        }
        self.isloading(true);
        return $.ajax({
            type: 'POST',
            url: 'https://orderfoodciclos.herokuapp.com/ciclos',
            data: {
                title: self.cicloName(),
                titleForExcel: self.cicloNameExcel()
            },
            headers: {
                "Authorization": "Bearer " + self.token
            }
        }).done(function(res) {
            getCiclos();
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
            self.ciclos(res.sort(function(a, b) {
                if (a.title > b.title) {
                    return 1;
                }
                if (a.title < b.title) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            }));
            self.cancel();
            $("[rel='tooltip']").tooltip();
        }).fail(function(err) {
            if (err.status === 401) {
                window.location.href = "/login";
            }
        });
    }

    self.delete = function(data) {
        var r = confirm("Seguro quiere eliminar el ciclo???");
        if (r == true) {
            self.isloading(true);
            return $.ajax({
                type: 'DELETE',
                url: 'https://orderfoodciclos.herokuapp.com/ciclos/' + data._id,
                headers: {
                    "Authorization": "Bearer " + self.token
                }
            }).done(function(res) {
                getCiclos();
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
        self.cicloName(null);
        self.cicloNameExcel(null);
        self.cicloId(null);
    };

    self.goToEdit = function(data) {
        self.isEditing(true);
        self.cicloId(data._id);
        self.cicloName(data.title);
        self.cicloNameExcel(data.title_for_excel)
        $('#cicloName').focus();
    };

    self.goToSave = function() {
        if (self.isEditing()) {
            self.edit();
        } else {
            self.save();
        }
    };

    self.edit = function() {
        if (!self.cicloName() || !self.cicloNameExcel()) {
            alert('No se puede crear un ciclo sin que le llenes los nombres');
            return;
        }
        self.isloading(true);
        return $.ajax({
            type: 'PUT',
            url: 'https://orderfoodciclos.herokuapp.com/ciclos/' + self.cicloId(),
            data: {
                title: self.cicloName(),
                titleForExcel: self.cicloNameExcel()
            },
            headers: {
                "Authorization": "Bearer " + self.token
            }
        }).done(function(res) {
            getCiclos();
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
