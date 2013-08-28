// Meteor.startup(function(){
//  $(function () {
//     var el = document.createElement("script");
//     el.src = "/disqus.js";
//     el.type = 'text/javascript';
//     $("#my-disqus").prepend(el);

// });
// })

function utf8_encode (argString) {
  if (argString === null || typeof argString === "undefined") {
    return "";
  }

  var string = (argString + '');
  var utftext = '',
    start, end, stringl = 0;

  start = end = 0;
  stringl = string.length;
  for (var n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n);
    var enc = null;

    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(
         (c1 >> 6)        | 192,
        ( c1        & 63) | 128
      );
    } else if (c1 & 0xF800 != 0xD800) {
      enc = String.fromCharCode(
         (c1 >> 12)       | 224,
        ((c1 >> 6)  & 63) | 128,
        ( c1        & 63) | 128
      );
    } else { 
      if (c1 & 0xFC00 != 0xD800) { throw new RangeError("Unmatched trail surrogate at " + n); }
      var c2 = string.charCodeAt(++n);
      if (c2 & 0xFC00 != 0xDC00) { throw new RangeError("Unmatched lead surrogate at " + (n-1)); }
      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
      enc = String.fromCharCode(
         (c1 >> 18)       | 240,
        ((c1 >> 12) & 63) | 128,
        ((c1 >> 6)  & 63) | 128,
        ( c1        & 63) | 128
      );
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utftext += string.slice(start, stringl);
  }

  return utftext;
}

function sha1 (str) {
  var rotate_left = function (n, s) {
    var t4 = (n << s) | (n >>> (32 - s));
    return t4;
  };

  var cvt_hex = function (val) {
    var str = "";
    var i;
    var v;

    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f;
      str += v.toString(16);
    }
    return str;
  };

  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xEFCDAB89;
  var H2 = 0x98BADCFE;
  var H3 = 0x10325476;
  var H4 = 0xC3D2E1F0;
  var A, B, C, D, E;
  var temp;

  str = utf8_encode(str);
  var str_len = str.length;

  var word_array = [];
  for (i = 0; i < str_len - 3; i += 4) {
    j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
    word_array.push(j);
  }

  switch (str_len % 4) {
  case 0:
    i = 0x080000000;
    break;
  case 1:
    i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
    break;
  case 2:
    i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
    break;
  case 3:
    i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
    break;
  }

  word_array.push(i);

  while ((word_array.length % 16) != 14) {
    word_array.push(0);
  }

  word_array.push(str_len >>> 29);
  word_array.push((str_len << 3) & 0x0ffffffff);

  for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
    for (i = 0; i < 16; i++) {
      W[i] = word_array[blockstart + i];
    }
    for (i = 16; i <= 79; i++) {
      W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    }


    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;

    for (i = 0; i <= 19; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 20; i <= 39; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 40; i <= 59; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 60; i <= 79; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }

  temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
  return temp.toLowerCase();
}

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

function google_login() {
  Meteor.loginWithGoogle({

  }, function (err) {
    if (err){
      console.log(err);
      // if (err['name'] === 'ServiceConfiguration.ConfigError') {
        
      // }
    } else {
      console.log('Successfully logged in!');
      console.log(Meteor.user());

      var email = Meteor.user().services.google.email;
      var hash = sha1(email);

      console.log(email)
      console.log(hash)

      $.cookie('session', sha1(email), {expires: 1, path: '/'});

    }
    
});
}

Template.login.events = {
  'click #login': google_login
}