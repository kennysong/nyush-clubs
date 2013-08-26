// Meteor.startup(function(){
//  $(function () {
//     var el = document.createElement("script");
//     el.src = "/disqus.js";
//     el.type = 'text/javascript';
//     $("#my-disqus").prepend(el);

// });
// })

function arr_obj_diff(a,b) {
  var diff = []
  
  for (i=0;i<a.length;i++) {
    var skip = false;
    var e = a[i];
    for (j=0;j<b.length;j++) {
      var f = b[j];
      if (JSON.stringify(f) === JSON.stringify(e)) {
        skip = true;
      }
    }
    if (!skip) {
      diff.push(e);
    }
  }
  return diff
}

Template.browse.first_clubs = function () {
  return Clubs.find({}, {sort: {members: -1, clubname: 1}, limit: 3});
}

Template.browse.last_clubs = function () {
  return Clubs.find({}, {sort: {members: -1, clubname: 1}, skip: 3});
}

Template.new.first_clubs = function () {
  return Clubs.find({}, {sort: {timestamp: -1, clubname: 1}, limit: 3});
}

Template.new.last_clubs = function () {
  return Clubs.find({}, {sort: {timestamp: -1, clubname: 1}, skip: 3});
}

Template.browse.rendered = function () {
  $('a').tooltip();
  $('#search').tooltip();
  $('.btn-group').button()
}

Template.new.rendered = function () {
  $('a').tooltip();
  $('#search').tooltip();
  $('.btn-group').button()
}

Template.browse.events = {
  'focus #search': function() {
    $("#search").animate({width: '225px'}, 400);
  },

  'blur #search': function() {
    $("#search").animate({width: '175px'}, 400);
  },

  'click #new': function() {
    Meteor.Router.to('/new');
  }
}

Template.new.events = {
  'focus #search': function() {
    $("#search").animate({width: '225px'}, 400);
  },

  'blur #search': function() {
    $("#search").animate({width: '175px'}, 400);
  },

  'click #popular': function() {
    Meteor.Router.to('/');
  }
}

Template.club.club = function() {
  var url = Session.get('club');
  var club = Clubs.findOne({'url':url})
  return club
}

Template.club.share_message = function() {
  var current_url = window.location.href.split('/').pop();
  var session_urls = Session.get('share_message');
  if (session_urls) {
    if (session_urls.length != 0 && session_urls.indexOf(current_url) > -1){
      return '<div class="alert alert-success" id="alert_div" data-position="bottom" data-toggle="tooltip" data-title="Copied to clipboard!" style="width: 355px;margin: 25px auto -10px auto;">Share <a id="share_link" href="/club/'+current_url+'">this link</a> with your friends to let them sign up!</div>'
  }
}
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

Template.club.rendered = function() {
    $('a').tooltip();

    $('a#share_link').zclip({
      path:'/ZeroClipboard.swf',
      copy: window.location.href,
      afterCopy: function() {
        $('#alert_div').tooltip('show')
      }
  });
}


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
      a_errors.push('Please enter your Net ID.');
    } else if (a_netid.length > 100) {
      a_errors.push('Net ID must be under 100 characters.');
    } else {
      var url = Session.get('club');
      var club = Clubs.findOne({'url':url});
      var member_list = club.member_list;
      if (member_list.indexOf(a_netid) != -1) {
        a_errors.push("You're already a member of this club!");
      }
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

      $('#a_submit').text('Success! Redirecting...');
      $('#a_submit').prop('disabled', true);

      setTimeout(function(){Meteor.Router.to('/club/'+url)}, 2000);
    }

  },

  'blur #a_netid': function() {
    var netid = $('#a_netid').val();
    var user = Users.findOne({'netid':netid});
    if (user) {
      $('#a_name').val(user.name);
      $('#a_nationality').val(user.nationality);
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
  // HACK //
  setTimeout(function(){
    var nats = Nationalities.findOne()['nationalities'];
    $('#f_nationality').typeahead({source: nats}); 
  }, 1500);
}

Template.add.rendered = function() {
  // HACK //
  setTimeout(function(){
    var nats = Nationalities.findOne()['nationalities'];
    $('#a_nationality').typeahead({source: nats}); 
  }, 1500);
}

Template.browse.greater = function(a, b) {
  if(a > b) {
    return true;
  } else {
    return false;
  }
}

Template.new.greater = function(a, b) {
  if(a > b) {
    return true;
  } else {
    return false;
  }
}

Template.user.greater = function(a, b) {
  if(a > b) {
    return true;
  } else {
    return false;
  }
}

Template.club.greater = function(a, b) {
  if(a > b) {
    return true;
  } else {
    return false;
  }
}

Template.add.greater = function(a, b) {
  if(a > b) {
    return true;
  } else {
    return false;
  }
}


// Template.club.rendered = function () {
//     var disqus_shortname = 'clubsatnyush';

//     (function() {
//         var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
//         dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
//         (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
//     })();
// }

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
    } else {
      var lc = f_clubname.replace(/\s+/g, '-').toLowerCase();
      var url = lc.replace(/[^a-zA-Z0-9-_]/g, '');
      if (Clubs.findOne({'url':url})) {
        errors.push('That club already exists. <a href="/club/'+url+'">Check it out!</a>')
      }
    }

    if (f_netid == '') {
      errors.push('Please enter your Net ID.');
    } else if (f_netid.length > 100) {
      errors.push('Net ID must be under 100 characters.');
    }      

    if (f_nationality == '') {
      errors.push('Please enter your nationality.');
    } else if (f_nationality.length > 100) {
      errors.push('Nationality must be under 100 characters.');
    }      

    if (f_description == '') {
      errors.push('Please enter a club description.');
    }

    var tags = [$('#f_tag1').val()];

    if ($('#f_tag2').hasClass('tagged')) {
        if (tags.indexOf($('#f_tag2').val()) == -1) {
          tags.push($('#f_tag2').val());
        }
    }

    if ($('#f_tag3').hasClass('tagged')) {
      if (tags.indexOf($('#f_tag3').val()) == -1) {
          tags.push($('#f_tag3').val());
        }
    }

    if (errors.length != 0) {
      Session.set('message', errors);
      $('html, body').animate({scrollTop:$(document).height()}, 'slow');

    } else {
      var lc = f_clubname.replace(/\s+/g, '-').toLowerCase();
      var url = lc.replace(/[^a-zA-Z0-9-_]/g, '');
      Session.set('message', null);
      
      var club = {'founder':f_name, 'clubname':f_clubname, 'netid':f_netid, 'url':url,
                  'description':f_description, 'members':1, 'member_list':[f_netid], 'tags':tags};
      Clubs.insert(club);

      Meteor.call('add_timestamp', url)

      var user = {'netid':f_netid, 'name':f_name, 'nationality':f_nationality}
      Users.insert(user);

      $('#create_submit').text('Success! Redirecting...');
      $('#create_submit').prop('disabled', true);

      if (Session.get('share_message')) {
        Session.set('share_message', Session.get('share_message').push(url));
      } else {
        Session.set('share_message', [url])
      }

      Session.set("activeNav", null);

      setTimeout(function(){Meteor.Router.to('/club/'+url)}, 2000);

    }

  },

  'click #add_tag': function() {
    event.preventDefault();
    if ($('#f_tag2').hasClass('tagged')) {
      $('#f_tag3').addClass('tagged');
      $('#f_tag3').show();
      $('#add_tag').hide();
    } else {
      $('#f_tag2').addClass('tagged');
      $('#f_tag2').show();
    }
  },

  'blur #f_netid': function() {
    var netid = $('#f_netid').val();
    var user = Users.findOne({'netid':netid});
    if (user) {
      $('#f_name').val(user.name);
      $('#f_nationality').val(user.nationality);
    }
  }
});

Template.user.user_obj = function() {
  var netid = window.location.href.split('/').pop();

  var user = Users.findOne({'netid':netid});
  var found_club = Clubs.find({'netid':netid}).fetch();
  var join_club = Clubs.find({'member_list': netid}).fetch();
  var filt_join_club = arr_obj_diff(join_club, found_club);

  console.log(found_club)
  console.log(join_club)
  console.log(filt_join_club)

  if (!user) {
    return null
  }

  var user_obj = {'found_club':found_club, 'join_club': filt_join_club, 'name':user.name, 
              'netid':netid, 'nationality':user.nationality};

  return user_obj

}