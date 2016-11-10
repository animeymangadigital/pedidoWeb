var ViewModel = function() {
    var self = this;
    self.minutas = ko.observableArray();
    self.ciclos = ko.observableArray();
    self.isCreating = ko.observable(false);
    self.isEditing = ko.observable(false);
    self.isloading = ko.observable(false);
    self.minutaName = ko.observable();
    self.minutaId = ko.observable();
    self.cicloId = ko.observable();
    self.token = localStorage.getItem("token");
    self.hideList = ko.computed(function() {
        return !(self.isCreating() || self.isEditing() || self.isloading());
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

    self.goToCreate = function() {
        self.isCreating(true);
    };

    self.save = function() {
        return $.ajax({
            type: 'POST',
            url: 'https://orderfoodciclos.herokuapp.com/minutas',
            data: {
                title: self.minutaName(),
                cicloId:self.cicloId()
            },
            headers: {
                "Authorization": "Bearer " + self.token
            }
        }).done(function(res) {
            getMinutas();
        }).fail(function(err) {
          if(err.status === 401){
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
            self.minutas(minutas[0]);
            self.ciclos(ciclos[0]);
            self.cancel();
        }).fail(function(err) {
          if(err.status === 401){
            window.location.href = "/login";
          }
        });
    }

    self.delete = function(data) {
        var r = confirm("Seguro quiere eliminar la minuta???");
        if (r == true) {
            return $.ajax({
                type: 'DELETE',
                url: 'https://orderfoodciclos.herokuapp.com/minutas/' + data._id,
                headers: {
                    "Authorization": "Bearer " + self.token
                }
            }).done(function(res) {
                getMinutas();
            }).fail(function(err) {
              if(err.status === 401){
                window.location.href = "/login";
              }
            });
        }
    };

    self.cancel = function() {
        self.isCreating(false);
        self.isEditing(false);
        self.isloading(false);
        self.minutaName('');
    };

    self.goToEdit = function(data) {
        self.isEditing(true);
        self.minutaId(data._id);
        self.minutaName(data.title);
        self.cicloId(data.cicloId);
    };

    self.getCicloName = function(cicloId) {
      var ciclo = ko.utils.arrayFirst(self.ciclos(), function(item) {
          return item._id === cicloId;
      });
      return ciclo ? ciclo.title : '';
    };

    self.edit = function() {
        return $.ajax({
            type: 'PUT',
            url: 'https://orderfoodciclos.herokuapp.com/minutas/' + self.minutaId(),
            data: {
                title: self.minutaName(),
                cicloId:self.cicloId()
            },
            headers: {
                "Authorization": "Bearer " + self.token
            }
        }).done(function(res) {
            getMinutas();
        }).fail(function(err) {
          if(err.status === 401){
            window.location.href = "/login";
          }
        });
    };

    self.init();
};

$(document).ready(function() {
    ko.applyBindings(new ViewModel());
})
