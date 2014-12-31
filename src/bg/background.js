
var Sanitize = {

  /**
   * request details
   *
   * @param  string  details.requestId
   * @param  string  details.url
   * @param  string  details.method
   * @param  integer details.frameId
   * @param  integer details.parentFrameId
   * @param  object  details.requestBody (optional)
   * @param  integer details.tabId
   * @param  string  details.type ('sub_frame', 'stylesheet', 'script', 'image', 'object', 'xmlhttprequest', 'other')
   * @param  double  details.timeStamp
   *
   * @return mixed
   */
  request: function (details) {
    if ( details.type === 'main_frame' && typeof(details) !== 'undefined' && typeof(details.url) !== 'undefined' ) {
      // chrome.extension.getBackgroundPage().console.log(details);
      return /** @type {!BlockingResponse} */ ({ redirectUrl:  Sanitize.url(details.url) });
    }
  },

  /**
   * Sanitize the url string
   * @param  string url
   * @return string
   */
  url: function (url) {
    url = Sanitize._UTMParameters(url);
    url = Sanitize._MailChimpParameters(url);

    // If there were other query parameters, and the stripped ones were first,
    // then we need to convert the first ampersand to a ? to still have a valid URL.
    if (url.indexOf('&') != -1 && url.indexOf('?') == -1) {
      url = url.replace('&', '?');
    }

    return url;
  },

  /**
   * Strip UTM parameters
   * @param  string url
   * @return string
   */
  _UTMParameters: function (url) {
    if (url.indexOf('utm_') > url.indexOf('?')) {
      url = url.replace(/([\?\&]utm_(reader|source|medium|campaign|content|term)=[^&#]+)/ig, '');
    }

    return url;
  },

  /**
   * Strip MailChimp parameters
   * @param  string url
   * @return string
   */
  _MailChimpParameters: function (url) {
    if (url.indexOf('mc_eid') > url.indexOf('?') || url.indexOf('mc_cid') > url.indexOf('?')) {
      url = url.replace(/([\?\&](mc_cid|mc_eid)=[^&#]+)/ig, '');
    }

    return url;
  }

};

/**
 * Fired when a request is about to occur.
 *
 * This event is sent before any TCP connection is made
 * and can be used to cancel or redirect requests.
 *
 * @link https://developer.chrome.com/extensions/webRequest#event-onBeforeRequest
 */
chrome.webRequest.onBeforeRequest.addListener(
  Sanitize.request,
  { urls: ['<all_urls>'] },
  ['blocking']
);
