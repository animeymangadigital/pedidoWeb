var ViewModel = function() {
    var self = this;
    self.ciclos = ko.observableArray();
    self.isCreating = ko.observable(false);
    self.isEditing = ko.observable(false);
    self.isloading = ko.observable(false);
    self.cicloName = ko.observable();
    self.cicloId = ko.observable();
    self.token = localStorage.getItem("token");
    self.hideList = ko.computed(function() {
        return !(self.isCreating() || self.isEditing() || self.isloading());
    });
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

    self.goToCreate = function() {
       self.isCreating(true);
    };

    self.save = function() {
      return $.ajax({
          type: 'POST',
          url: 'https://orderfoodciclos.herokuapp.com/ciclos',
          data:{title:self.cicloName()},
          headers: {
              "Authorization": "Bearer " + self.token
          }
      }).done(function(res) {
          getCiclos();
      }).fail(function(err) {
        if(err.status === 401){
          window.location.href = "/login";
        }
      });
    };

    function getCiclos(){
      self.isloading(true);
      return $.ajax({
          type: 'GET',
          url: 'https://orderfoodciclos.herokuapp.com/ciclos',
          headers: {
              "Authorization": "Bearer " + self.token
          }
      }).done(function(res) {
          self.ciclos(res);
          self.cancel();
      }).fail(function(err) {
        if(err.status === 401){
          window.location.href = "/login";
        }
      });
    }

    self.delete = function(data) {
      var r = confirm("Seguro quiere eliminar el ciclo???");
      if (r == true) {
        return $.ajax({
            type: 'DELETE',
            url: 'https://orderfoodciclos.herokuapp.com/ciclos/' + data._id,
            headers: {
                "Authorization": "Bearer " + self.token
            }
        }).done(function(res) {
            getCiclos();
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
      self.cicloName('');
    };

    self.goToEdit = function(data) {
       self.isEditing(true);
       self.cicloId(data._id);
       self.cicloName(data.title);
    };

    self.edit = function() {
      return $.ajax({
          type: 'PUT',
          url: 'https://orderfoodciclos.herokuapp.com/ciclos/' + self.cicloId(),
          data:{title:self.cicloName()},
          headers: {
              "Authorization": "Bearer " + self.token
          }
      }).done(function(res) {
          getCiclos();
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
