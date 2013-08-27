isProdEnv = function () {
    if (process.env.ROOT_URL == "http://localhost:3000") {
        return false;
    } else {
        return true;
    }
}

Accounts.loginServiceConfiguration.remove({
	service: "google"
});

if (isProdEnv()) {
	Accounts.loginServiceConfiguration.insert({
		service: "google",
		clientId: "607651698386-epjtvqhf4orjhchb7tevcj7ghtqdacsa",
		secret: "RsepbD3wAK7AHCsPYu1WV5cB"
	});
} else {
	Accounts.loginServiceConfiguration.insert({
		service: "google",
		clientId: "607651698386",
		secret: "nDCbfB-6ptU5IGyp65qaPkuu"
	});
}