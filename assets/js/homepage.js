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
  var homepageView = rivets.bind($('#homepage'), {
    data: data,
    controller: {
      shorten: function () {
        if (!data.longURL.match(URL_SCHEME_RE)) data.longURL = 'http://' + data.longURL;
        io.socket.get('/url/shorten', {url: data.longURL}, function (shortened, res) {
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
        homepageView.models.controller.shorten();
      }
    }
  });

  $('#short-url')
    .focus(function () { $(this).select(); })
    .mouseup(function (evt) { evt.preventDefault(); });
});
