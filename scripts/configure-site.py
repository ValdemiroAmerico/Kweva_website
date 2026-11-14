#!/usr/bin/env python3
"""Configure the real public URL and/or receiving email in this static website."""
import argparse
import html
import re
from pathlib import Path
from urllib.parse import urlsplit
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--url', help='Public HTTPS URL, for example https://your-domain.mz')
parser.add_argument('--email', help='Address that will receive form submissions through FormSubmit')
args = parser.parse_args()
if not args.url and not args.email:
    parser.error('Provide --url, --email, or both.')
base = args.url.rstrip('/') if args.url else None
if base:
    parsed = urlsplit(base)
    if (parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password
            or parsed.query or parsed.fragment or any(c.isspace() for c in base)
            or parsed.hostname == 'example.com' or parsed.hostname.endswith('.example.com')):
        parser.error('--url must be a real HTTPS URL without credentials, query, or fragment.')
if args.email and not re.fullmatch(r'[^\s<>"@]+@[^\s<>"@]+\.[^\s<>"@]+', args.email):
    parser.error('--email must be a valid email address.')

pages = sorted(ROOT.glob('*.html'))
for page in pages:
    source = page.read_text()
    if args.email:
        source = re.sub(r'data-email="[^"]*"', 'data-email="' + html.escape(args.email, quote=True) + '"', source)
        source = re.sub(r'action="https://formsubmit\.co/[^"]*"', 'action="https://formsubmit.co/' + html.escape(args.email, quote=True) + '"', source)
    if base:
        source = re.sub(r'\s*<link\b[^>]*rel="canonical"[^>]*>', '', source)
        source = re.sub(r'\s*<meta\b[^>]*property="og:(?:url|image)"[^>]*>', '', source)
        if page.name == '404.html':
            source = re.sub(r'\s*<base\b[^>]*>', '', source)
            base_path = urlsplit(base).path.rstrip('/') + '/'
            source = source.replace('<head>', '<head>\n    <base href="' + html.escape(base_path, quote=True) + '">')
        tags = '\n    <meta property="og:image" content="' + html.escape(base + '/assets/photos/home-lagos.jpg', quote=True) + '">'
        if page.name != '404.html':
            url = base + '/' + ('' if page.name == 'index.html' else page.name)
            safe = html.escape(url, quote=True)
            tags += '\n    <link rel="canonical" href="' + safe + '">\n    <meta property="og:url" content="' + safe + '">'
        source = source.replace('</head>', tags + '\n</head>')
    page.write_text(source)
if base:
    urls = [base + '/' + ('' if page.name == 'index.html' else page.name) for page in pages if page.name != '404.html' and not re.search(r'<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex', page.read_text())]
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap += ''.join('  <url><loc>' + escape(url) + '</loc></url>\n' for url in urls) + '</urlset>\n'
    (ROOT / 'sitemap.xml').write_text(sitemap)
    (ROOT / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: ' + base + '/sitemap.xml\n')
print('Configuration updated. Confirm the FormSubmit activation email for any new receiving address.')
