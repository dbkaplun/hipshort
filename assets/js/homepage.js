var URL_SCHEME_RE = /^[a-z\d.-]+:/; // from RFC 1738 Uniform Resource Locators (URL)

new Vue({
  el: '#homepage',
  data: {
    longURL: '',
    shortURL: '',
    err: null
  },
  methods: {
    shorten: function (url) {
      var self = this;
      self.err = null;
      self.shortURL = '';
      if (url) self.longURL = url;
      if (!self.longURL.match(URL_SCHEME_RE)) self.longURL = 'http://' + self.longURL;
      io.socket.get('/url/shorten', {url: self.longURL}, function (shortened, res) {
        if (res.statusCode === 200) {
          self.shortURL = location.origin + '/~' + shortened.slug;
        } else {
          self.err = shortened;
        }
      });
    },
    select: function (evt) { evt.target.select(); }
  },
  computed: {
    isValidURL: {
      $get: function () {
        var self = this;
        return (((self.err || {}).invalidAttributes || {}).url || []).every(function (urlError) {
          return urlError.rule !== 'url';
        });
      }
    }
  }
});
