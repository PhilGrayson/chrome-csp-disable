Disable Content-Security-Policy (CSP) in Chromium browers for web application testing.

[Install via the Chrome Web Store](https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden)

Use this only as a last resort. Disabling CSP means disabling features designed to protect you from cross-site scripting. Prefer to use [report-uri](https://developers.google.com/web/fundamentals/security/csp/#reporting) which instructs the browser to send CSP violations to a URI. That allows you keep CSP enabled in your browser but still know what got blocked. [https://report-uri.com](https://report-uri.com/) is a free tool that gives you a web interface to inspect CSP violations on your site.




## Contributors ##

* [Phil Grayson](https://github.com/PhilGrayson)
* [Denis Gorbachev](https://github.com/DenisGorbachev)
