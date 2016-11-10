var ViewModel = function() {
    var self = this;
    self.init = function() {
       var token = localStorage.getItem("token");
       if(!token){
         window.location.href = "/login";
       }
    };
    self.logout = function() {
       localStorage.removeItem("token");
       window.location.href = "/login";
    };
    self.init();
};

$(document).ready(function() {
    ko.applyBindings(new ViewModel());
})
