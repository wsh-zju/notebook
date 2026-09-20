"""Optional percentage suffix for Markdown images: ![alt](path)(69)."""
import re
from decimal import Decimal

from markdown.extensions import Extension
from markdown.inlinepatterns import IMAGE_LINK_RE, ImageInlineProcessor


class SizedImageProcessor(ImageInlineProcessor):
    def handleMatch(self, match, data):
        element, start, end = super().handleMatch(match, data)
        if element is None:
            return element, start, end
        suffix = re.match(r'(?:\(([0-9]+(?:\.[0-9]+)?)%?\)|（([0-9]+(?:\.[0-9]+)?)%?）)', data[end:])
        if not suffix:
            return None, None, None
        width = suffix[1] or suffix[2]
        if not 0 < Decimal(width) <= 100:
            return None, None, None
        element.set('style', f'width:{width}%;display:block;margin:20px auto')
        return element, start, end + suffix.end()


class ImageSizeExtension(Extension):
    def extendMarkdown(self, md):
        md.inlinePatterns.register(SizedImageProcessor(IMAGE_LINK_RE, md), 'sized_image', 151)


def on_config(config):
    if not any(isinstance(extension, ImageSizeExtension) for extension in config['markdown_extensions']):
        config['markdown_extensions'].append(ImageSizeExtension())
    return config
