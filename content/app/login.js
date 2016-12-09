var ViewModel = function() {
    var self = this;
    self.username = ko.observable();
    self.password = ko.observable();
    self.isLoading = ko.observable(false);

    self.login = function() {
      self.isLoading(true);
      var data = {
       username: self.username(),
       password: self.password()
      };

      $.ajax({
          type: 'POST',
          url: 'https://orderfoodciclos.herokuapp.com/login',
          data:data
      }).done(function(result) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('name', result.name);
        window.location.href = "/";
      }).fail(function(err){
        alert(err.responseJSON.message);
      }).always(function(){
        self.isLoading(false);
      });
    };
};

$(document).ready(function() {
    ko.applyBindings(new ViewModel());
})
