Template.browse.first_clubs = function () {
  return Clubs.find({}, {sort: {members: -1, clubname: 1}, limit: 3});
}

Template.browse.last_clubs = function () {
  return Clubs.find({}, {sort: {members: -1, clubname: 1}, skip: 3});
}

Template.club.club = function() {
  var url = Session.get('club');
  var club = Clubs.findOne({'url':url})
  return club
}

Template.club.club_members = function() {
  var url = Session.get('club');
  var club = Clubs.findOne({'url':url});
  var member_list = club.member_list;

  var club_members = [];

  for(i=0;i<member_list.length;i++) {
    var netid = member_list[i];
    var member = Users.findOne({'netid':netid});
    club_members.push(member);
  }

  return club_members
}

Template.club.events({
  'click #join' : function() {
    var url = Session.get('club')
    Meteor.Router.to('/add/'+url);
  }
})


Template.add.events({
  'click #a_submit' : function() {
    event.preventDefault();

    var a_name = $('#a_name').val();
    var a_netid = $('#a_netid').val();
    var a_nationality = $('#a_nationality').val();
    var a_errors = [];

    if (a_name == '') {
      a_errors.push('Please enter your name.');
    } else if (a_name.length > 100) {
      a_errors.push('Name must be under 100 characters.');
    }

    if (a_netid == '') {
      a_errors.push('Please enter a Net ID.');
    } else if (a_netid.length > 100) {
      a_errors.push('Net ID must be under 100 characters.');
    }      

    if (a_nationality == '') {
      a_errors.push('Please enter your nationality.');
    } else if (a_nationality.length > 100) {
      a_errors.push('Nationality must be under 100 characters.');
    } 

    if (a_errors.length != 0) {
      Session.set('a_message', a_errors);
    } else {
      Session.set('a_message', '')
      
      var url = Session.get('club');
      var club = Clubs.findOne({'url':url});

      Clubs.update(club._id, {$inc: {members: 1}, $push: {member_list: a_netid}});

      if (!(Users.findOne({'netid':a_netid}))) {
        Users.insert({'name':a_name, 'netid':a_netid, 'nationality':a_nationality});
      }

    }

  }
})

Template.add.a_message = function() {
  return Session.get('a_message');
}

Template.add.club = function() {
  var url = Session.get('club');
  var club = Clubs.findOne({'url':url})
  return club
}

Template.create.message = function () {
  return Session.get('message');
}

Template.create.rendered = function() {
  var nats = Nationalities.findOne()['nationalities'];
  $('#f_nationality').typeahead({source: nats}); 
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

    if (f_name == '') {
      errors.push('Please enter your name.');
    } else if (f_name.length > 100) {
      errors.push('Name must be under 100 characters.');
    }

    if (f_clubname == '') {
      errors.push('Please enter a club name.');
    } else if (f_clubname.length > 100) {
      errors.push('Club name must be under 100 characters.');
    }      

    if (f_netid == '') {
      errors.push('Please enter a Net ID.');
    } else if (f_netid.length > 100) {
      errors.push('Net ID must be under 100 characters.');
    }      

    if (f_nationality == '') {
      errors.push('Please enter your nationality.');
    } else if (f_nationality.length > 100) {
      errors.push('Nationality must be under 100 characters.');
    }      

    if (f_description == '') {
      errors.push('Please enter a description.');
    } else if (f_description.length > 100) {
      errors.push('Description must be under 100 characters.');
    }

    if (errors.length != 0) {
      Session.set('message', errors);
      $('html, body').animate({scrollTop:$(document).height()}, 'slow');

    } else {
      var url = f_clubname.replace(/\s+/g, '-').toLowerCase();
      Session.set('message', null);
      
      var club = {'founder':f_name, 'clubname':f_clubname, 'netid':f_netid, 'url':url,
                  'description':f_description, 'members':1, 'member_list':[f_netid]};
      Clubs.insert(club);

      var user = {'netid':f_netid, 'name':f_name, 'nationality':f_nationality}
      Users.insert(user);

      $('#create_submit').text('Success! Redirecting...');
      $('#create_submit').prop('disabled', true);

    }

  }
});

