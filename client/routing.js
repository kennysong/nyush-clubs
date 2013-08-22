Meteor.Router.add(
  {
    '/' : 'browse',
    '/create' : 'create',
    '/how' : 'how',
    '/club/:id' : function(id) {
        Session.set('room_id', id);
        return 'room'; 
      },
    '*' : 'error'
});