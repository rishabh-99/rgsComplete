var request = require("request");

var options = {
	method: 'POST',
	url: 'https://api.github.com/user/repos',
	headers:
	{
		'Postman-Token': 'd495bb27-7a35-42d2-864a-718d3802c54e',
		'cache-control': 'no-cache',
		'Content-Type': 'application/json',
		'Authorization': 'Bearer 43c80ca5e7c79ec8a0441f5750b638219e3439bd',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36	'
	},
	body:
	{
		name: 'Hello ODU!!',
		description: 'This is your first repository',
		homepage: 'https://github.com',
		private: false,
		has_issues: true,
		has_projects: true,
		has_wiki: true
	},
	json: true
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

	console.log(body);
});
