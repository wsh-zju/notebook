"""Render GitHub/Obsidian callouts as lightweight, theme-independent blocks."""
import re
from html import escape


CALLOUTS = {
    'note': ('Note', 'info'),
    'info': ('Info', 'info'),
    'tip': ('Tip', 'tip'),
    'important': ('Important', 'important'),
    'warning': ('Warning', 'warning'),
    'caution': ('Caution', 'caution'),
}

MARKER = re.compile(
    r'^(?P<indent> {0,3})>[ \t]*\[!(?P<kind>[A-Za-z]+)\][ \t]*(?P<title>.*?)\s*$'
)
QUOTE_LINE = re.compile(r'^(?P<indent> {0,3})>(?:[ \t]?(?P<body>.*))$')
FENCE = re.compile(r'^ {0,3}(`{3,}|~{3,})(.*)$')

INFO_ICON = (
    '<svg viewBox="0 0 16 16" aria-hidden="true">'
    '<circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" stroke-width="1.5"/>'
    '<path d="M8 7.25v4M8 4.5h.01" fill="none" stroke="currentColor" '
    'stroke-width="1.5" stroke-linecap="round"/>'
    '</svg>'
)


def on_page_markdown(markdown, **kwargs):
    lines = markdown.splitlines()
    output = []
    index = 0
    fence = None

    while index < len(lines):
        line = lines[index]
        fence_match = FENCE.match(line)
        if fence:
            output.append(line)
            if (fence_match and fence_match[1][0] == fence[0]
                    and len(fence_match[1]) >= fence[1] and not fence_match[2].strip()):
                fence = None
            index += 1
            continue
        if fence_match:
            fence = (fence_match[1][0], len(fence_match[1]))
            output.append(line)
            index += 1
            continue

        marker = MARKER.match(line)
        kind = marker['kind'].lower() if marker else ''
        if not marker or kind not in CALLOUTS:
            output.append(line)
            index += 1
            continue

        body = []
        index += 1
        while index < len(lines):
            quoted = QUOTE_LINE.match(lines[index])
            if not quoted or quoted['indent'] != marker['indent']:
                break
            content = quoted['body']
            # Typora/GFM accepts three-space nested list indentation, while
            # Python Markdown requires four. Normalize only that indentation;
            # ordinary headings and paragraphs must remain flush left.
            if content.startswith('   ') and not content.startswith('    '):
                content = ' ' + content
            body.append(content)
            index += 1

        default_title, variant = CALLOUTS[kind]
        title = marker['title'].strip() or default_title
        output.extend([
            '',
            f'<div class="gfm-callout gfm-callout-{variant}" markdown="1">',
            f'<p class="gfm-callout-title">{INFO_ICON}<span>{escape(title)}</span></p>',
            '',
            *body,
            '',
            '</div>',
            '',
        ])

    return '\n'.join(output) + '\n'
