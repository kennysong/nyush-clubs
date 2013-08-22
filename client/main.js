Template.browse.clubs = function () {
  return Clubs.find({}, {sort: {members: -1, clubname: 1}});
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
    } else {
      var url = f_clubname.replace(/\s+/g, '-').toLowerCase();

      Session.set('message', ['Success!' + url]);
      

      var club = {'founder':f_name, 'clubname':f_clubname, 'netid':f_netid, 'url':url,
                  'description':f_description, 'members':1, 'member_list':[f_netid]};
      Clubs.insert(club);

      var user = {'netid':f_netid, 'name':f_name, 'nationality':f_nationality}
      Users.insert(user);

    }

  }
});

