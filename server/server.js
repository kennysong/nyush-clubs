Meteor.startup(function () {
    if (Nationalities.find().count() === 0) {
    	var nats = ['America (USA)', 'China', 'Russia', 'Pakistan', 'Indonesia', 'India', 
    				'Canada', 'Spain', 'Poland', 'Mexico', 'Egypt', 'Argentina', 'France',
    				'Costa Rica', 'New Zealand', 'Britain (UK)']
    	Nationalities.insert({'nationalities':nats})
    }
});

Meteor.methods({
	'add_timestamp': function(url) {
		var club = Clubs.findOne({'url':url});
		Clubs.update(club._id, {$set: {'timestamp': (new Date()).getTime()}});	
	}
})

Accounts.validateNewUser(function (user) {
    if(user.services.google.email.match(/example\.org$/)) {
        return true;
    }
    throw new Meteor.Error(403, "You must sign in using a example.org account");
});