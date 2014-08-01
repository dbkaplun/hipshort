var URL_SCHEME_RE = /^[a-z\d.-]+:/; // from RFC 1738 Uniform Resource Locators (URL)

new Vue({
  el: '#homepage',
  data: {
    longURL: '',
    shortURL: '',
    err: null
  },
  created: function () {
    this.$watch('longURL', this.reset);
  },
  methods: {
    shorten: function (url) {
      var self = this;
      self.reset();
      if (url) self.longURL = url;
      if (!self.longURL.match(URL_SCHEME_RE)) self.longURL = 'http://' + self.longURL;
      io.socket.get('/url/shorten', {url: self.longURL}, function (shortened, res) {
        if (res.statusCode === 200) {
          self.shortURL = location.origin + '/' + shortened.slug;
        } else {
          self.err = shortened;
        }
      });
    },
    reset: function () {
      this.shortURL = '';
      this.err = null;
    },
    select: function (evt) { evt.target.select(); }
  },
  computed: {
    isValidURL: {
      $get: function () {
        return (((this.err || {}).invalidAttributes || {}).url || []).every(function (urlError) {
          return urlError.rule !== 'url';
        });
      }
    },
    isRemoteURL: {
      $get: function () { return (this.err || {}).error !== "can't shorten URLs from this host"; }
    }
  }
});
