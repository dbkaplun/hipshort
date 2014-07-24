/**
 * URLController
 *
 * @description :: Server-side logic for managing URLS
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var PG_UNIQUE_VALIDATION = '23505'; // http://www.postgresql.org/docs/8.2/static/errcodes-appendix.html

module.exports = {
	shorten: function (req, res) {
		var longUrl = req.param('url');
		URL.create({url: longUrl}).exec(function (err, url) {
			if (err) {
				var invalidURLRules = _.pluck((err.invalidAttributes || {}).url, 'rule');
				if (_.contains(invalidURLRules, 'unique') || (err.originalError || {}).code === PG_UNIQUE_VALIDATION) {
					URL.findOne({url: longUrl}).exec(function (err, url) {
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
