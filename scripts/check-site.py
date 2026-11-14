#!/usr/bin/env python3
"""Check local pages and assets without dependencies or network requests."""
import json
import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parent.parent


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.tags = []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

    handle_startendtag = handle_starttag


def check():
    errors, warnings = [], []
    pages = {path: Page(path) for path in sorted(ROOT.glob('*.html'))}

    def error(path, message):
        errors.append(f'{path.relative_to(ROOT)}: {message}')

    def local_reference(source, value):
        url = urlsplit(value)
        if url.scheme or url.netloc:
            return
        path = (ROOT / unquote(url.path).lstrip('/') if url.path.startswith('/')
                else source.parent / unquote(url.path)) if url.path else source
        path = path.resolve()
        if not path.is_relative_to(ROOT):
            error(source, f'reference leaves the website: {value}')
            return
        if path.is_dir():
            path /= 'index.html'
        if not path.is_file():
            error(source, f'missing local target: {value}')
        elif url.fragment and path in pages:
            ids = {attrs.get('id') for _, attrs in pages[path].tags}
            if unquote(url.fragment) not in ids:
                error(source, f'missing fragment: {value}')

    for path, page in pages.items():
        ids = Counter(attrs['id'] for _, attrs in page.tags if attrs.get('id'))
        for ident, count in ids.items():
            if count > 1:
                error(path, f'duplicate id: {ident}')
        for tag in ['main', 'h1', 'title']:
            count = sum(t == tag for t, _ in page.tags)
            if count != 1:
                error(path, f'expected one {tag}, found {count}')
        if not any(t == 'html' and a.get('lang') for t, a in page.tags):
            error(path, 'missing page language')
        if not any(t == 'meta' and a.get('name') == 'description' and a.get('content') for t, a in page.tags):
            error(path, 'missing description')
        for tag, attrs in page.tags:
            for name in ([] if tag == 'base' else ['href', 'src', 'poster']):
                if attrs.get(name):
                    local_reference(path, attrs[name])
            if tag == 'img' and 'alt' not in attrs:
                error(path, 'image without alt attribute')
            if tag == 'label' and attrs.get('for') not in ids and 'for' in attrs:
                error(path, f'label refers to missing field: {attrs["for"]}')
            for name in ['aria-controls', 'aria-labelledby', 'aria-describedby']:
                for ident in attrs.get(name, '').split():
                    if ident not in ids:
                        error(path, f'{name} refers to missing id: {ident}')
            if attrs.get('target') == '_blank' and not {'noopener', 'noreferrer'}.intersection(attrs.get('rel', '').split()):
                error(path, 'new-tab link without noopener/noreferrer')
            if tag == 'form':
                if attrs.get('method', '').lower() != 'post' or not attrs.get('action', '').startswith('https://'):
                    error(path, 'form must use POST with an HTTPS action')
        if path.name != '404.html' and not any(t == 'link' and a.get('rel') == 'canonical' for t, a in page.tags):
            warnings.append(f'{path.name}: public URL/canonical not configured')
    for path in sorted((ROOT / 'css').glob('*.css')):
        for value in re.findall(r'url\(\s*[\'"]?([^\)\'\"]+)', path.read_text()):
            local_reference(path, value.strip())
    for path in sorted((ROOT / 'data').glob('*.json')):
        try:
            data = json.loads(path.read_text())
        except ValueError as exc:
            error(path, f'invalid JSON: {exc}')
            continue
        def visit(value):
            if isinstance(value, dict):
                for key, item in value.items():
                    if key in ['photo', 'image', 'logo', 'url'] and isinstance(item, str) and item:
                        local_reference(ROOT / 'index.html', item)
                    else:
                        visit(item)
            elif isinstance(value, list):
                for item in value:
                    visit(item)
        if not path.name.endswith('.example.json'):
            visit(data)
    try:
        sitemap = ElementTree.parse(ROOT / 'sitemap.xml')
        if not sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
            warnings.append('sitemap.xml: empty; configure the public URL before launch')
    except ElementTree.ParseError as exc:
        error(ROOT / 'sitemap.xml', str(exc))
    for message in errors:
        print('ERROR:', message)
    for message in warnings:
        print('WARNING:', message)
    print(f'{len(pages)} pages checked; {len(errors)} errors; {len(warnings)} deployment warnings.')
    return bool(errors)


if __name__ == '__main__':
    sys.exit(check())
