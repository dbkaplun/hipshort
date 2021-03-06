/**
 * URLController
 *
 * @description :: Server-side logic for managing URLS
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var parseURL = require('url').parse;
var PG_UNIQUE_VALIDATION = '23505'; // http://www.postgresql.org/docs/8.2/static/errcodes-appendix.html

module.exports = {
	shorten: function (req, res) {
		var longURL = req.param('url');
		var longURLHost = parseURL(longURL).host;
		if (_.chain(req.headers)
			.merge(req.socket.handshake.headers)
			.some(function (value, name) {
				return _.contains(['host', 'x-forwarded-host'], name.toLowerCase()) && value === longURLHost;
			})
			.value()) return res.json({error: "can't shorten URLs from this host"}, 400);
		URL.create({url: longURL}).exec(function (err, url) {
			if (err) {
				var invalidURLRules = _.pluck((err.invalidAttributes || {}).url, 'rule');
				if (_.contains(invalidURLRules, 'unique') || (err.originalError || {}).code === PG_UNIQUE_VALIDATION) {
					URL.findOne({url: longURL}).exec(function (err, url) {
						if (err) sails.log.error('URLController.shorten findOne:', err);
						if (!err && url) return res.json(url);
						res.json(err || {error: "couldn't shorten"}, 500); // should never happen
					});
				} else {
					if (!_.contains(invalidURLRules, 'url')) sails.log.error('URLController.shorten create:', err);
					res.json(err, 500);
				}
			} else if (url) {
				res.json(url);
			}
		});
	},
	go: function (req, res, next) {
		URL.findOne({slug: req.params.slug}).exec(function (err, url) {
			if (err) sails.log.error('URLController.go:', err);
			if (err || !url) return next(err);
			res.redirect(url.url);
		});
	}
};
