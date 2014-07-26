/**
* URL.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var slug = require('slug');

module.exports = {
  attributes: {
    // unique flag automatically adds an index
    url: {type: 'url', required: true, unique: true, url: {
      require_protocol: true,
      require_tld: true
    }},
    slug: {type: 'string', unique: true, lowercase: true}
  },
  beforeCreate: function (values, next) {
    URL.find()
      .sort('id desc')
      .limit(1)
      .exec(function (err, urls) {
        if (err) return next(err);
        values.slug = URL.getSlug(((urls[0] || {}).id || 0) + 1);
        next();
      });
  },
  getSlug: function (id) {
    var slugParts = [];
    do {
      id -= 1;
      slugParts.push(URL.SLUG_WORDS[id % URL.SLUG_WORDS.length]);
      id = Math.floor(id / URL.SLUG_WORDS.length);
    } while (id > 0);
    return slug(slugParts.join(' ')).toLowerCase();
  },
  SLUG_WORDS: [
    "3 wolf moon", "8-bit", "90\'s", "American Apparel", "Austin", "Banksy",
    "Blue Bottle", "Brooklyn", "Bushwick", "Carles", "Cosby sweater", "DIY",
    "Disrupt", "Echo Park", "Etsy", "Godard", "High Life", "Intelligentsia",
    "Kickstarter", "Marfa", "McSweeney\'s", "Neutra", "PBR&B", "Pinterest",
    "Schlitz", "Shoreditch", "Thundercats", "Tonx", "Truffaut", "VHS", "Vice",
    "Wayfarers", "Wes Anderson", "Williamsburg", "XOXO", "YOLO", "actually",
    "art party", "artisan", "asymmetrical", "axe", "banjo", "beard",
    "before they sold out", "bicycle rights", "biodiesel", "bitters", "blog",
    "brunch", "butcher", "cardigan", "chambray", "chia", "church-key",
    "cornhole", "craft beer", "cray", "cred", "crucifix", "deep v", "denim",
    "distillery", "dreamcatcher", "ennui", "ethical", "ethnic", "fanny pack",
    "fap", "fashion", "fingerstache", "fixie", "flannel", "flexitarian",
    "food truck", "forage", "freegan", "gastropub", "gentrify", "gluten-free",
    "hashtag", "hoodie", "iPhone", "irony", "jean shorts", "keffiyeh", "keytar",
    "kitsch", "kogi", "leggings", "letterpress", "literally", "lo-fi",
    "locavore", "lomo", "meggings", "meh", "messenger bag", "mlkshk",
    "mumblecore", "mustache", "next level", "occupy", "organic", "photo booth",
    "plaid", "polaroid", "pork belly", "post-ironic", "pug", "put a bird on it",
    "quinoa", "raw", "roof party", "sartorial", "scenester", "selvage",
    "semiotics", "shabby chic", "single-origin coffee", "slow-carb", "squid",
    "sriracha", "street art", "stumptown", "synth", "tofu", "tote bag",
    "trust fund", "twee", "typewriter", "ugh", "umami", "vinyl", "viral",
    "whatever", "yr"
  ]
};
