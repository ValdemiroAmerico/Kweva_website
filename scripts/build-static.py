#!/usr/bin/env python3
"""Create a Pages artifact containing only public website resources."""
import argparse
import json
import re
import shutil
import html
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit, urlunsplit
from routes import page_path

ROOT = Path(__file__).resolve().parent.parent


def clean_link(value, current, pages):
    """Links resolve against the site root, including in-page anchors."""
    url = urlsplit(value)
    if url.scheme or url.netloc or url.path.startswith('/'):
        return value
    if url.path in pages:
        path = page_path(url.path) or './'
    elif not url.path and (url.fragment or url.query):
        path = page_path(current) or './'
    else:
        return value
    return urlunsplit(('', '', path, url.query, url.fragment))


def clean_html(source, filename, pages):
    def link(match):
        value = clean_link(html.unescape(match.group(2)), filename, pages)
        return match.group(1) + html.escape(value, quote=True) + match.group(3)
    source = re.sub(r'(\bhref=")([^"]*)(")', link, source)
    if filename not in ['index.html', '404.html']:
        source = re.sub(r'\s*<base\b[^>]*>', '', source)
        source = source.replace('<head>', '<head>\n    <base href="../">', 1)
    elif filename == 'index.html':
        source = source.replace('<head>', '<head>\n    <script>'
                                'if(location.pathname.endsWith("/index.html"))'
                                'location.replace("./"+location.search+location.hash);'
                                '</script>', 1)
    return source


def legacy_redirect(filename):
    target = page_path(filename)
    return ('<!doctype html>\n<html lang="pt-MZ"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1">'
            '<meta name="robots" content="noindex">'
            '<title>Kweva Research &amp; Consulting</title>'
            f'<meta http-equiv="refresh" content="0;url={target}">'
            '<script>location.replace(' + json.dumps(target) + '+location.search+location.hash);</script>'
            f'</head><body><a href="{target}">Continuar / Continue</a></body></html>\n')


class References(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.urls = []
        self.feed(text)

    def handle_starttag(self, tag, attributes):
        if tag == 'base':
            return
        attrs = dict(attributes)
        self.urls.extend(attrs[key] for key in ['href', 'src', 'poster'] if attrs.get(key))

    handle_startendtag = handle_starttag


def build(output):
    output = output.resolve()
    if output == ROOT or ROOT.is_relative_to(output):
        raise ValueError('Output must not contain the source directory.')
    if output.exists() and any(output.iterdir()):
        raise ValueError('Use an empty output directory to avoid retaining stale files.')
    files = set(ROOT.glob('*.html'))
    pages = {path.name for path in files}
    files.update((ROOT / 'css').glob('*.css'))
    files.update((ROOT / 'js').glob('*.js'))
    files.update(path for path in (ROOT / 'data').iterdir()
                 if path.is_file() and '.example.' not in path.name)
    files.update(ROOT / name for name in ['robots.txt', 'sitemap.xml'])
    if (ROOT / 'CNAME').is_file():
        files.add(ROOT / 'CNAME')
    pending = list(files)

    def add(source, value):
        url = urlsplit(value)
        if url.scheme or url.netloc or not url.path:
            return
        target = (ROOT / unquote(url.path).lstrip('/') if url.path.startswith('/')
                  else source.parent / unquote(url.path)).resolve()
        if not target.is_relative_to(ROOT) or not target.is_file():
            raise ValueError(f'Missing or non-public resource in {source.name}: {value}')
        if target not in files:
            files.add(target)
            pending.append(target)

    def json_assets(value):
        if isinstance(value, dict):
            for key, item in value.items():
                if key in ['photo', 'image', 'logo', 'url'] and isinstance(item, str):
                    add(ROOT / 'index.html', item)
                else:
                    json_assets(item)
        elif isinstance(value, list):
            for item in value:
                json_assets(item)

    while pending:
        source = pending.pop()
        if source.suffix == '.html':
            for url in References(source.read_text()).urls:
                add(source, url)
        elif source.suffix == '.css':
            for url in re.findall(r'url\(\s*[\'"]?([^\)\'\"]+)', source.read_text()):
                add(source, url.strip())
        elif source.suffix == '.json':
            json_assets(json.loads(source.read_text()))
    output.mkdir(parents=True, exist_ok=True)
    for source in sorted(files):
        target = output / source.relative_to(ROOT)
        target.parent.mkdir(parents=True, exist_ok=True)
        if source.parent == ROOT and source.suffix == '.html':
            text = clean_html(source.read_text(), source.name, pages)
            if source.name not in ['index.html', '404.html']:
                destination = output / page_path(source.name) / 'index.html'
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_text(text)
                target.write_text(legacy_redirect(source.name))
            else:
                target.write_text(text)
        elif source.suffix == '.js':
            text = source.read_text()
            # Static links in scripts (e.g. old career bookmarks) use the same routes.
            for page in pages - {'404.html'}:
                for quote in ['"', "'"]:
                    text = text.replace(quote + page + quote,
                                        quote + (page_path(page) or './') + quote)
            target.write_text(text)
        elif source.suffix == '.json':
            def links(value):
                if isinstance(value, dict):
                    return {key: clean_link(item, 'index.html', pages)
                            if key == 'url' and isinstance(item, str) else links(item)
                            for key, item in value.items()}
                if isinstance(value, list):
                    return [links(item) for item in value]
                return value
            target.write_text(json.dumps(links(json.loads(source.read_text())), ensure_ascii=False, indent=2) + '\n')
        else:
            shutil.copyfile(source, target)
    (output / '.nojekyll').touch()
    public_files = [path for path in output.rglob('*') if path.is_file()]
    size = sum(path.stat().st_size for path in public_files)
    print(f'Built {len(public_files)} public files ({size / 1024 / 1024:.2f} MiB) in {output}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=ROOT / '_site')
    args = parser.parse_args()
    build(args.output)
