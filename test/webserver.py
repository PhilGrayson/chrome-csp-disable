#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler, test
import sys

class CSPRequestHandler (SimpleHTTPRequestHandler):
    extensions_map = {
        '.appcache': 'text/cache-manifest',
    }

    def end_headers (self):
        self.send_header('Content-Security-Policy', 'default-src \'self\'')
        SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    test(CSPRequestHandler, HTTPServer, port=int(sys.argv[1]) if len(sys.argv) > 1 else 8000)
