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

Template.create.message = function () {
  return Session.get('message');
}

  Template.create.events({
    'click #create_submit' : function () {
      event.preventDefault();

      var f_name = $('#f_name').val();
      var f_clubname = $('#f_clubname').val();
      var f_netid = $('#f_netid').val();
      var f_nationality = $('#f_nationality').val();
      var f_description = $('#f_description').val();

      var errors = [];

      // alert(f_name + f_clubname + f_netid + f_nationality + f_description)

      if (f_name == '') {
        errors.push('Please enter a name.')
      } else if (f_name.length > 100) {
        errors.push('Name must be under 100 characters.')
      }

      if (f_clubname == '') {
        errors.push('Please enter a club name.')
      } else if (f_clubname.length > 100) {
        errors.push('Club name must be under 100 characters.')
      }      

      if (f_netid == '') {
        errors.push('Please enter a Net ID.')
      } else if (f_netid.length > 100) {
        errors.push('Net ID must be under 100 characters.')
      }      

      if (f_nationality == '') {
        errors.push('Please enter a nationality.')
      } else if (f_nationality.length > 100) {
        errors.push('Nationality must be under 100 characters.')
      }      

      if (f_description == '') {
        errors.push('Please enter a description.')
      } else if (f_description.length > 100) {
        errors.push('Description must be under 100 characters.')
      }

      if (errors.length != 0) {
        Session.set('message', errors)
      } else {
        Session.set('message', ['Success!'])
      }

    }
  });

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
