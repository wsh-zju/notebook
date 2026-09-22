"""Compact card/column blocks, expanded before Markdown rendering."""
import re
from decimal import Decimal
from html import escape
from pathlib import Path

CONTROLS = (Path(__file__).parent / 'templates/cards.html').read_text(encoding='utf-8')


def on_page_markdown(markdown, **kwargs):
    output, stack = [], []
    fence = None
    first_card = last_card = None

    def fail(number, message):
        raise ValueError(f'Card syntax, line {number}: {message}')

    for number, line in enumerate(markdown.splitlines(), 1):
        # Examples inside fenced/indented code remain literal.
        match = re.match(r'^ {0,3}(`{3,}|~{3,})(.*)$', line)
        if fence:
            output.append(line)
            if match and match[1][0] == fence[0] and len(match[1]) >= fence[1] and not match[2].strip():
                fence = None
            continue
        if match:
            fence = (match[1][0], len(match[1]))
            output.append(line)
            continue

        card = re.fullmatch(r'::: card(?: (normal|concept|exam|mistake|example|summary|question))?\s*', line)
        columns = re.fullmatch(r'::: columns ([23])(?:\s*\(([^()]*)\))?\s*', line)
        note = re.fullmatch(r'::: note(?:[ \t]+(.*?))?\s*', line)
        if card:
            if stack:
                fail(number, 'cards cannot be nested')
            if first_card is None:
                first_card = len(output)
            stack.append(['card', 0, 0])
            kind = card[1] or 'normal'
            output.extend(['', f'<div class="study-card {kind}-card" markdown="1">', ''])
        elif note:
            if any(block[0] == 'note' for block in stack):
                fail(number, 'notes cannot be nested')
            stack.append(['note', 0, 0])
            title = (note[1] or '').strip()
            parts = title.split(maxsplit=1)
            note_kind = parts[0] if parts and parts[0] in {
                'info', 'tip', 'warning', 'danger', 'example', 'question', 'summary'
            } else None
            if note_kind:
                title = parts[1] if len(parts) > 1 else ''
            variant = f' note-{note_kind}' if note_kind else ''
            output.extend(['', f'<div class="card-note{variant}" markdown="1">', ''])
            if title:
                output.extend([f'<p class="card-note-title">{escape(title)}</p>', ''])
        elif columns:
            if any(block[0] == 'columns' for block in stack):
                fail(number, 'columns cannot be nested')
            style = ''
            if columns[2] is not None:
                weights = [value.strip() for value in re.split(r'[:,]', columns[2])]
                if len(weights) != int(columns[1]) or any(
                    not re.fullmatch(r'(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)', value)
                    or Decimal(value) <= 0 for value in weights
                ):
                    fail(number, 'column ratios must contain one positive number per column, e.g. (2:1) or (1:2:1)')
                tracks = ' '.join(f'minmax(0, {value}fr)' for value in weights)
                style = f' style="--card-column-tracks: {tracks}"'
            stack.append(['columns', int(columns[1]), 1])
            output.extend(['', f'<div class="card-columns columns-{columns[1]}"{style} markdown="1">',
                           '', '<div class="card-column" markdown="1">', ''])
        elif line.rstrip() == '|||' and stack and stack[-1][0] == 'columns':
            stack[-1][2] += 1
            output.extend(['', '</div>', '', '<div class="card-column" markdown="1">', ''])
        elif line.rstrip() == ':::' and stack:
            kind, expected, actual = stack.pop()
            if kind == 'columns':
                if expected != actual:
                    fail(number, f'expected {expected} columns, got {actual}; separate columns with |||')
                output.extend(['', '</div>', '', '</div>', ''])
            else:
                output.extend(['', '</div>', ''])
                if kind == 'card':
                    last_card = len(output)
        elif re.match(r'^::: (card|columns|note)\b', line):
            fail(number, 'use ::: card [normal|concept|exam|mistake|example|summary|question], ::: columns 2/3, or ::: note [info|tip|warning|danger|example|question|summary] [title]')
        else:
            output.append(line)

    if stack:
        fail(len(markdown.splitlines()), 'unclosed block; add :::')
    if first_card is not None:
        output[last_card:last_card] = ['', '</div>', '', CONTROLS, '']
        output[first_card:first_card] = ['', '<div class="card-deck" markdown="1">', '']
    return '\n'.join(output) + '\n'
