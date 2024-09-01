Disable Content-Security-Policy (CSP) headers.
This is an aid to building good policies, especially on pages that load lots of third-party resources.

* [Install for Chrome](https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden)
* [Install for Edge](https://microsoftedge.microsoft.com/addons/detail/disable-contentsecurity/ecmfamimnofkleckfamjbphegacljmbp)

Use this only as a last resort. Disabling CSP means disabling features designed to protect you from cross-site scripting. Prefer to use [report-uri](https://developers.google.com/web/fundamentals/security/csp/#reporting) which instructs the browser to send CSP violations to a URI. That allows you keep CSP enabled in your browser but still know what got blocked. [https://report-uri.com](https://report-uri.com/) is a free tool that gives you a web interface to inspect CSP violations on your site.

Licensed under https://unlicense.org/.

## Privacy policy
This extension does not collect any user data.

## Contributors

* [Phil Grayson](https://github.com/PhilGrayson)
* [Denis Gorbachev](https://github.com/DenisGorbachev)
