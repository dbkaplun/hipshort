jQuery(function ($) {
  var URL_SCHEME_RE = /^[a-z\d.-]+:/; // from RFC 1738 Uniform Resource Locators (URL)
  var data = {
    longURL: '',
    shortURL: '',
    err: null
  };

  rivets.formatters.isURLError = function (err) {
    return (((err || {}).invalidAttributes || {}).url || []).some(function (urlError) {
      return urlError.rule === 'url';
    });
  };
  rivets.bind($('#homepage'), {
    data: data,
    controller: {
      shorten: function () {
        var longURL = data.longURL;
        if (!longURL.match(URL_SCHEME_RE)) longURL = 'http://' + longURL;
        io.socket.get('/url/shorten', {url: longURL}, function (shortened, res) {
          if (res.statusCode === 200) {
            data.err = null;
            data.shortURL = location.origin + '/~' + shortened.slug;
          } else {
            data.err = shortened;
            data.shortURL = '';
          }
        });
      },
      etsy: function () {
        data.err = null;
        data.shortURL = '';
        data.longURL = 'etsy.com';
      }
    }
  });

  $('#short-url')
    .focus(function () { $(this).select(); })
    .mouseup(function (evt) { evt.preventDefault(); });
});
