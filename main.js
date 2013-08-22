Clubs = new Meteor.Collection("clubs");

if (Meteor.isClient) {

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

Template.browse.clubs = function () {
  return Clubs.find({}, {sort: {members: -1, clubname: 1}});
}

  // Template.hello.greeting = function () {
  //   return "Welcome to clubs.";
  // };

  // Template.hello.events({
  //   'click input' : function () {
  //     // template data, if any, is available in 'this'
  //     if (typeof console !== 'undefined')
  //       console.log("You pressed the button");
  //   }
  // });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Clubs.find().count() === 0) {
      var names = ["Club 1",
                   "Club 2"];
      for (var i = 0; i < names.length; i++)
        Clubs.insert({clubname: names[i], founder: 'Kenny Song', members: Math.floor(Random.fraction()*10)});
    }
  });
}
