#!/usr/bin/env python3
"""Regression checks for clean static URLs and Pages project paths."""
import importlib.util
import re
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('static_build', SCRIPTS / 'build-static.py')
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)


class CleanURLTests(unittest.TestCase):
    pages = {'index.html', 'sobre.html', 'inscricao.html', '404.html'}

    def test_query_and_fragment_survive_page_links(self):
        self.assertEqual(build.clean_link('inscricao.html?curso=r#form', 'sobre.html', self.pages),
                         'inscricao/?curso=r#form')

    def test_anchor_targets_current_page_with_root_base(self):
        self.assertEqual(build.clean_link('#main', 'sobre.html', self.pages), 'sobre/#main')
        self.assertEqual(build.clean_link('#main', 'index.html', self.pages), './#main')

    def test_external_links_and_assets_are_unchanged(self):
        for value in ['https://other.test/sobre.html', 'mailto:contact@test.invalid',
                      'docs/programa.pdf', 'assets/photo.jpg']:
            self.assertEqual(build.clean_link(value, 'sobre.html', self.pages), value)

    def test_base_and_html_escaping(self):
        source = '<html><head></head><body><a href="inscricao.html?curso=r&amp;nivel=1">Curso</a></body></html>'
        result = build.clean_html(source, 'sobre.html', self.pages)
        self.assertIn('<base href="../">', result)
        self.assertIn('href="inscricao/?curso=r&amp;nivel=1"', result)

    def test_legacy_redirect_has_native_fallback_and_preserves_url_suffix(self):
        result = build.legacy_redirect('sobre.html')
        self.assertIn('http-equiv="refresh"', result)
        self.assertIn('location.search+location.hash', result)
        self.assertIn('href="sobre/"', result)

    def test_metadata_works_for_project_and_custom_domain(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            scripts = root / 'scripts'
            scripts.mkdir()
            for name in ['configure-site.py', 'routes.py']:
                shutil.copyfile(SCRIPTS / name, scripts / name)
            for name in ['index.html', 'sobre.html', '404.html']:
                (root / name).write_text('<html><head></head><body></body></html>')
            for base in ['https://kweva-research.github.io/Kweva_website', 'https://kweva.test']:
                subprocess.run(['python3', str(scripts / 'configure-site.py'), '--url', base],
                               check=True, capture_output=True)
                self.assertIn(f'href="{base}/sobre/"', (root / 'sobre.html').read_text())
                self.assertIn(f'<loc>{base}/sobre/</loc>', (root / 'sitemap.xml').read_text())
                expected = '/Kweva_website/' if 'github.io' in base else '/'
                self.assertIn(f'<base href="{expected}">', (root / '404.html').read_text())

    def test_complete_artifact_resolves_every_local_reference(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'public'
            build.build(output)
            for page in build.ROOT.glob('*.html'):
                if page.name in ['index.html', '404.html']:
                    continue
                self.assertTrue((output / page.stem / 'index.html').is_file())
                self.assertIn('location.replace', (output / page.name).read_text())
            base = re.search(r'<base href="([^"]+)"', (output / '404.html').read_text())
            result = subprocess.run(['python3', str(SCRIPTS / 'check-published.py'), str(output),
                                     '--base-path', base.group(1) if base else '/'],
                                    capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == '__main__':
    unittest.main()
