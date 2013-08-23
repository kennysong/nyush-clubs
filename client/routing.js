Handlebars.registerHelper("activeNav", function (nav) {
  return Session.equals("activeNav", nav) ? "active" : "";
});


Meteor.Router.add(
  {
    '/' : function() {
      Session.set("activeNav", Meteor.Router.page());
      return 'browse'
    },
    '/create' : function() {
      Session.set("activeNav", Meteor.Router.page());
      return 'create'
    },
    '/how' : function() {
      Session.set("activeNav", Meteor.Router.page());
      return 'how'
    },
    '/club/:url' : function(url) {
        Session.set('club', url);
        return 'club'; 
      },
      '/add/:url' : function(url) {
      	Session.set('club', url);
        return 'add'; 
      },
    '*' : 'error'
});