import os
from typing import List, Tuple, Match
from werkzeug.datastructures import FileStorage
from .utils import escape_character
from .constants import (
    ANCHOR_TEMPLATE,
    CLASS_TEMPLATE,
    CSS_TEMPLATE,
    TRANSLATION_PATTERN,
)
from ..commons.utils import read_uploaded_html_file


def generate_translations_from_file(
    file: FileStorage, chapter_id: str
) -> Tuple[str, str]:
    """
    Reads and decodes an uploaded HTML file, then processes it to extract translation pairs
    and generate corresponding annotated HTML and CSS.

    Args:
        file (FileStorage): The uploaded HTML file containing translation markers.
        chapter_id (str): The chapter ID used to generate unique CSS class names.

    Raises:
        InvalidHTMLFile: If the uploaded file cannot be read or decoded as UTF-8.

    Returns:
        Tuple[str, str]: A tuple containing the modified HTML string and the generated CSS styles.
    """
    html = read_uploaded_html_file(file)
    return generate_translations(html, chapter_id)


def generate_translations(html: str, chapter_id: str) -> Tuple[str, str]:
    """
    Processes the input HTML string to extract translation pairs and
    replace them with annotated HTML elements. Also generates corresponding CSS.

    Args:
        html (str): The HTML content containing translation markers in the form {original [translated]}.
        chapter_id (str): The chapter ID used for generating unique CSS class names.

    Returns:
        Tuple[str, str]: A tuple containing the modified HTML string and the generated CSS styles.
    """
    new_html, pairs = replace_and_extract_translations(html, chapter_id)
    css = generate_css(pairs, chapter_id)
    return new_html, css


def replace_and_extract_translations(
    html: str, chapter_id: str
) -> Tuple[str, List[Tuple[str, str]]]:
    """
    Replaces translation markers in the HTML with anchor-based span elements and
    extracts the corresponding (original, translated) string pairs.

    Args:
        html (str): The HTML content containing translation markers.
        chapter_id (str): The chapter ID used for generating unique class names.

    Returns:
        Tuple[str, List[Tuple[str, str]]]: A tuple containing the updated HTML with replaced
        elements and a list of (original, translated) string pairs.
    """
    translation_pairs = []

    def replacement(match: Match):
        original, translated = match.group(1), match.group(2)
        translation_pairs.append((original, translated))
        idx = len(translation_pairs)
        class_str = CLASS_TEMPLATE.format(chapter_id=chapter_id, index=idx)

        return ANCHOR_TEMPLATE.format(class_str=class_str, original=original)

    new_html = TRANSLATION_PATTERN.sub(replacement, html)

    return new_html, translation_pairs


def generate_css(pairs: List[Tuple[str, str]], chapter_id: str) -> str:
    """
    Generates CSS rules that toggle between original and translated text on hover/focus.

    Args:
        pairs (List[Tuple[str, str]]): A list of (original, translated) string pairs.
        chapter_id (str): The chapter ID used for generating unique CSS class names.

    Returns:
        str: A string containing the compiled CSS rules.
    """
    css_blocks = []

    for idx, (original, translated) in enumerate(pairs, 1):
        class_str = f"ch{chapter_id}text{idx}"
        css_block = CSS_TEMPLATE.format(
            class_str=class_str,
            original=escape_character(original, '"'),
            translated=escape_character(translated, '"'),
        )

        css_blocks.append(css_block)

    return os.linesep.join(css_blocks)
