Meteor.startup(function () {
    if (Clubs.find().count() === 0) {
      var names = ["Club 1",
                   "Club 2"];
      for (var i = 0; i < names.length; i++)
        Clubs.insert({clubname: names[i], founder: 'Kenny Song', members: Math.floor(Random.fraction()*10)});
    }

    if (Nationalities.find().count() === 0) {
    	var nats = ['American (USA)', 'Chinese', 'Russian', 'Pakistanian', 'Indonesian', 'Indian', 
    				'Canadian', 'Spanish', 'Polish', 'Mexican']
    	Nationalities.insert({'nationalities':nats})
    }

  });

