#!/usr/bin/env python3
"""Check resolved links, assets and anchors in a built Pages artifact."""
import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


class Document(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.tags = []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

    handle_startendtag = handle_starttag


def check(root, base_path):
    root = root.resolve()
    prefix = '/' + base_path.strip('/') + '/' if base_path.strip('/') else '/'
    origin = 'https://preview.invalid'
    documents = {p: Document(p) for p in root.rglob('*.html')}
    errors = []
    references = 0
    for path, document in documents.items():
        relative = path.relative_to(root).as_posix()
        relative = relative.removesuffix('index.html') if relative.endswith('index.html') else relative
        address = origin + prefix + relative
        base = next((urljoin(address, a['href']) for t, a in document.tags if t == 'base'), address)
        for tag, attrs in document.tags:
            if tag == 'base':
                continue
            for name in ['href', 'src', 'poster']:
                if not attrs.get(name):
                    continue
                url = urlsplit(urljoin(base, attrs[name]))
                if url.netloc != 'preview.invalid':
                    continue
                references += 1
                if not url.path.startswith(prefix):
                    errors.append(f'{relative}: reference leaves project: {attrs[name]}')
                    continue
                target = root / unquote(url.path[len(prefix):])
                if target.is_dir():
                    target /= 'index.html'
                if not target.is_file():
                    errors.append(f'{relative}: missing {attrs[name]} (resolved to {url.path})')
                elif url.fragment and target in documents:
                    ids = {a.get('id') for _, a in documents[target].tags}
                    if unquote(url.fragment) not in ids:
                        errors.append(f'{relative}: missing anchor in {attrs[name]}')
    for error in errors:
        print('ERROR:', error)
    print(f'{len(documents)} HTML files; {references} resolved local references; {len(errors)} errors.')
    return bool(errors)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', type=Path)
    parser.add_argument('--base-path', default='/')
    args = parser.parse_args()
    raise SystemExit(check(args.directory, args.base_path))
