Meteor.startup(function () {
    if (Clubs.find().count() === 0) {
        Clubs.insert({clubname: 'Triathlon Club', founder: 'Roman Chen', members: 1, nationality:'Chinese', netid:'zc562', tags:['Athletics'], member_list:'zc562', url:'triathlon-club', description:'test'});


    if (Nationalities.find().count() === 0) {
    	var nats = ['America (USA)', 'China', 'Russia', 'Pakistan', 'Indonesia', 'India', 
    				'Canada', 'Spain', 'Poland', 'Mexico', 'Egypt', 'Argentina', 'France',
    				'Costa Rica', 'New Zealand', 'Britain (UK)']
    	Nationalities.insert({'nationalities':nats})
    }

  }
});

