var ViewModel = function() {
    var self = this;
    self.ciclos = ko.observableArray();
    self.isEditing = ko.observable(false);
    self.isloading = ko.observable(false);
    self.cicloName = ko.observable();
    self.cicloId = ko.observable();
    self.token = localStorage.getItem("token");
    self.formActionName = ko.computed(function() {
        return  self.isEditing() === true ? 'Editar Ciclo' : 'Agregar Ciclo' ;
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

    self.save = function() {
      if(!self.cicloName()){
          alert('No se puede crear un ciclo sin que le llenes el nombre');
          return;
      }
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
          $("[rel='tooltip']").tooltip();
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
      self.isEditing(false);
      self.isloading(false);
      self.cicloName(null);
      self.cicloId(null);
    };

    self.goToEdit = function(data) {
       self.isEditing(true);
       self.cicloId(data._id);
       self.cicloName(data.title);
    };

    self.goToSave = function() {
       if(self.isEditing()){
         self.edit();
       }else{
         self.save();
       }
    };

    self.edit = function() {
      if(!self.cicloName()){
          alert('No se puede crear un ciclo sin que le llenes el nombre');
          return;
      }
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
