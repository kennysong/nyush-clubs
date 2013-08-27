Handlebars.registerHelper("activeNav", function (nav) {
  return Session.equals("activeNav", nav) ? "active" : "";
});


Meteor.Router.add(
  {
    '/' : function() {
      Session.set("activeNav", Meteor.Router.page());
      document.title = "NYU Shanghai Clubs";
      return 'browse'
    },
    '/login' : function() {
      Session.set("activeNav", Meteor.Router.page());
      document.title = "Login with NYU Account";
      return 'login'
    },
    '/create' : function() {
      Session.set("activeNav", Meteor.Router.page());
      document.title = "Create a Club";
      return 'create'
    },
    '/how' : function() {
      Session.set("activeNav", Meteor.Router.page());
      document.title = "How does this work?";
      return 'how'
    },
    '/new' : function() {
      Session.set("activeNav", 'browse');
      document.title = "NYU Shanghai Clubs";
      return 'new'
    },
    '/club/:url' : function(url) {
        Session.set("activeNav", null);
        Session.set('club', url);

        var club = Clubs.findOne({'url':url});

        if (club) {
          document.title = club.clubname;
          return 'club'; 
        } else {
          return 'error'
        }

    },
    '/add/:url' : function(url) {
        Session.set("activeNav", null);
      	Session.set('club', url);

        var club = Clubs.findOne({'url':url});

        if (club) {
          document.title = 'Join ' + club.clubname;
          return 'add'; 
        } else {
          return 'error'
        }
    },
    '/user/:netid' : function(netid) {
        var user = Users.findOne({'netid':netid});

        if (user) {
          document.title = user.name;
          return 'user'; 
        } else {
          return 'error'
        }

    },
    '*' : function() {
      document.title = "Page not found!";
      return 'error'
    }
});