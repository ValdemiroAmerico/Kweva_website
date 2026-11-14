#!/usr/bin/env python3
"""Create a Pages artifact containing only public website resources."""
import argparse
import json
import re
import shutil
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent


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
        shutil.copyfile(source, target)
    (output / '.nojekyll').touch()
    size = sum(path.stat().st_size for path in files)
    print(f'Built {len(files) + 1} public files ({size / 1024 / 1024:.2f} MiB) in {output}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=ROOT / '_site')
    args = parser.parse_args()
    build(args.output)
