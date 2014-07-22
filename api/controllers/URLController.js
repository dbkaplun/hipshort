/**
 * URLController
 *
 * @description :: Server-side logic for managing URLS
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	shorten: function (req, res) {
		var longUrl = req.param('url');
		URL.create({url: longUrl}).exec(function (err, url) {
			if (!err && url) return res.json(url);
			URL.findOne({url: longUrl}).exec(function (err, url) {
				if (!err && url) return res.json(url);
				res.json(err || {error: "couldn't shorten"}, 500); // should never happen
			});
		});
	},
	go: function (req, res, next) {
		URL.findOne({slug: req.params.slug}).exec(function (err, url) {
			if (err || !url) return next(err);
			res.redirect(url.url);
		});
	}
};
