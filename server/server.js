Meteor.startup(function () {
    if (Clubs.find().count() === 0) {
      var names = ["Club 1",
                   "Club 2"];
      for (var i = 0; i < names.length; i++)
        Clubs.insert({clubname: names[i], founder: 'Kenny Song', members: Math.floor(Random.fraction()*10)});
    }
  });