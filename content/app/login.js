var ViewModel = function() {
    var self = this;
    self.username = ko.observable();
    self.password = ko.observable();

    self.login = function() {
      var data = {
       username: self.username(),
       password: self.password()
      };

      $.ajax({
          type: 'POST',
          url: 'https://orderfoodciclos.herokuapp.com/login',
          data:data
      }).done(function(result) {
        console.log(result);
        localStorage.setItem('token', result.token);
        window.location.href = "/";
      }).fail(function(err){
        alert(err.responseJSON.message);
      });
    };
};

$(document).ready(function() {
    ko.applyBindings(new ViewModel());
})
