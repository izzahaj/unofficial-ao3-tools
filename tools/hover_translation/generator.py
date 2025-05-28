import os
from typing import List, Match, Tuple

import utils
from constants import ANCHOR_TEMPLATE, CLASS_TEMPLATE, CSS_TEMPLATE, TRANSLATION_PATTERN


def generate_translations(html: str, chapter: int) -> Tuple[str, str]:
    """
    Processes the input HTML string to extract translation pairs and
    replace them with annotated HTML elements. Also generates corresponding CSS.

    Args:
        html (str): The HTML content containing translation markers in the form {original [translated]}.
        chapter (int): The chapter number used for generating unique CSS class names.

    Returns:
        Tuple[str, str]: A tuple containing the modified HTML string and the generated CSS styles.
    """
    new_html, pairs = replace_and_extract_translations(html, chapter)
    css = generate_css(pairs, chapter)
    return new_html, css


def replace_and_extract_translations(
    html: str, chapter: int
) -> Tuple[str, List[Tuple[str, str]]]:
    """
    Replaces translation markers in the HTML with anchor-based span elements and
    extracts the corresponding (original, translated) string pairs.

    Args:
        html (str): The HTML content containing translation markers.
        chapter (int): The chapter number used for generating unique class names.

    Returns:
        Tuple[str, List[Tuple[str, str]]]: A tuple containing the updated HTML with replaced
        elements and a list of (original, translated) string pairs.
    """
    translation_pairs = []

    def replacement(match: Match):
        original, translated = match.group(1), match.group(2)
        translation_pairs.append((original, translated))
        idx = len(translation_pairs)
        class_str = CLASS_TEMPLATE.format(chapter=chapter, index=idx)

        return ANCHOR_TEMPLATE.format(class_str=class_str, original=original)

    new_html = TRANSLATION_PATTERN.sub(replacement, html)

    return new_html, translation_pairs


def generate_css(pairs: List[Tuple[str, str]], chapter: int) -> str:
    """
    Generates CSS rules that toggle between original and translated text on hover/focus.

    Args:
        pairs (List[Tuple[str, str]]): A list of (original, translated) string pairs.
        chapter (int): The chapter number used for generating unique CSS class names.

    Returns:
        str: A string containing the compiled CSS rules.
    """
    css_blocks = []

    for idx, (original, translated) in enumerate(pairs, 1):
        class_str = f"ch{chapter}text{idx}"
        css_block = CSS_TEMPLATE.format(
            class_str=class_str,
            original=utils.escape_character(original, '"'),
            translated=utils.escape_character(translated, '"'),
        )

    css_blocks.append(css_block)
    return os.linesep.join(css_blocks)
