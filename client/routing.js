Meteor.Router.add(
  {
    '/' : 'browse',
    '/create' : 'create',
    '/how' : 'how',
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