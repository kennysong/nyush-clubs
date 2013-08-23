Meteor.startup(function () {
    if (Clubs.find().count() === 0) {
        Clubs.insert({clubname: 'Triathlon Club', founder: 'Roman Chen', members: 1, nationality:'Chinese', netid:'zc562', tags:['Athletics'], member_list:'zc562', url:'triathlon-club', description:'test'});


    if (Nationalities.find().count() === 0) {
    	var nats = ['American (USA)', 'Chinese', 'Russian', 'Pakistanian', 'Indonesian', 'Indian', 
    				'Canadian', 'Spanish', 'Polish', 'Mexican']
    	Nationalities.insert({'nationalities':nats})
    }

  }
});

