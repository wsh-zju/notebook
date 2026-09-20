import importlib.util
from pathlib import Path
import unittest
import markdown

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('cards', ROOT / 'hooks/cards.py')
cards = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cards)


class CardSyntaxTests(unittest.TestCase):
    def test_real_page(self):
        source = (ROOT / 'docs/Computer_Science/Computer_Network/introduction.md').read_text()
        expanded = cards.on_page_markdown(source)
        html = markdown.markdown(expanded, extensions=['md_in_html', 'tables', 'admonition',
            'pymdownx.details', 'pymdownx.superfences', 'pymdownx.arithmatex', 'toc'])
        self.assertEqual(html.count('class="study-card '), 5)
        self.assertEqual(html.count('class="card-column"'), 5)
        self.assertEqual(html.count('id="next-card"'), 1)
        for token in ['<table>', '<details', 'admonition warning', 'arithmatex', 'nslookup', '<h2', '<h3']:
            self.assertIn(token, html)
        self.assertNotIn('::: card', html)
        self.assertNotIn('|||', html)

    def test_code_examples_are_literal(self):
        for fence in ['```', '~~~~']:
            source = f'{fence}markdown\n::: card\n::: columns 2\n|||\n:::\n{fence}\n'
            self.assertEqual(cards.on_page_markdown(source), source)
        source = '    ::: card\n    :::\n'
        self.assertEqual(cards.on_page_markdown(source), source)

    def test_note_in_columns(self):
        source = "::: card\n## Title\n::: columns 2\n::: note\n**重点：**内容\n:::\n|||\n右栏\n:::\n:::\n"
        html = markdown.markdown(cards.on_page_markdown(source), extensions=['md_in_html'])
        self.assertIn('<strong>重点：</strong>', html)
        self.assertEqual(html.count('class="card-note"'), 1)
        self.assertEqual(html.count('class="card-column"'), 2)
        self.assertEqual(html.count('id="next-card"'), 1)

    def test_errors(self):
        for source in ['::: card\ntext', '::: columns 3\na\n|||\nb\n:::',
                       '::: card\n::: card\n:::\n:::', '::: columns 4']:
            with self.assertRaises(ValueError):
                cards.on_page_markdown(source)

    def test_note_titles(self):
        for suffix, variant, title in [('', '', ''), ('Example', '', 'Example'),
                ('注意 事项', '', '注意 事项'), ('tip 注意', ' note-tip', '注意'),
                ('example', ' note-example', ''), ('<b>&', '', '&lt;b&gt;&amp;')]:
            with self.subTest(suffix=suffix):
                source = f'::: note {suffix}\n**正文**\n:::\n'
                html = markdown.markdown(cards.on_page_markdown(source), extensions=['md_in_html'])
                self.assertIn(f'class="card-note{variant}"', html)
                self.assertIn('<strong>正文</strong>', html)
                if title:
                    self.assertIn(f'<p class="card-note-title">{title}</p>', html)
                else:
                    self.assertNotIn('card-note-title', html)

    def test_column_ratios(self):
        for count, ratio, weights in [(2, '2:1', ['2', '1']),
                                      (3, '1:2:1', ['1', '2', '1']),
                                      (2, '1.5, .5', ['1.5', '.5'])]:
            with self.subTest(ratio=ratio):
                source = f'::: columns {count} ({ratio})\n' + '\n|||\n'.join(['**text**'] * count) + '\n:::\n'
                html = markdown.markdown(cards.on_page_markdown(source), extensions=['md_in_html'])
                self.assertIn('--card-column-tracks: ' + ' '.join(f'minmax(0, {w}fr)' for w in weights), html)
                self.assertEqual(html.count('<strong>text</strong>'), count)

    def test_invalid_column_ratios(self):
        for ratio in ['', '1', '1:2:3', '0:1', '-1:2', 'nan:1', '1fr:2', '1; color:red:2']:
            with self.subTest(ratio=ratio), self.assertRaisesRegex(ValueError, 'line 1'):
                cards.on_page_markdown(f'::: columns 2 ({ratio})\na\n|||\nb\n:::\n')

    def test_ordinary_markdown_unchanged(self):
        source = '# Heading\n\n---\n\n| a | b |\n| - | - |\n'
        self.assertEqual(cards.on_page_markdown(source), source)


if __name__ == '__main__':
    unittest.main()
