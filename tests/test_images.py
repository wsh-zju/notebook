import sys
from pathlib import Path
import unittest
import markdown

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from hooks.images import ImageSizeExtension


class ImageSizeTests(unittest.TestCase):
    def render(self, source):
        return markdown.markdown(source, extensions=[ImageSizeExtension(), 'attr_list', 'fenced_code'])

    def test_sizes_and_paths(self):
        for suffix in ['(69)', '（69）', '(69%)', '(69.5)']:
            with self.subTest(suffix=suffix):
                html = self.render('![alt](image/a(1).png "Title")' + suffix)
                self.assertIn('src="image/a(1).png"', html)
                self.assertIn('title="Title"', html)
                self.assertIn('display:block;margin:20px auto', html)
                self.assertIn('width:69.5%' if suffix == '(69.5)' else 'width:69%', html)

    def test_existing_and_literal_syntax(self):
        for source in ['![alt](a.png)', '![alt](a.png){style="width:60%"}',
                       '`![alt](a.png)(69)`', '```\n![alt](a.png)(69)\n```',
                       r'\![alt](a.png)(69)', '![alt](a.png)(0)', '![alt](a.png)(101)']:
            with self.subTest(source=source):
                self.assertEqual(self.render(source), markdown.markdown(source, extensions=['attr_list', 'fenced_code']))


if __name__ == '__main__':
    unittest.main()
