import html
import os
from typing import Dict, List, Optional, Tuple

import cssutils
import utils
from bs4 import BeautifulSoup, NavigableString
from constants import SEMANTIC_TAGS


def clean(html_str: str) -> str:
    """
    Cleans HTML content exported from Google Docs and returns simplified AO3-compatible HTML.

    This includes extracting styles, applying semantic tag transformations,
    consolidating formatting, and cleaning up HTML structure.

    Args:
        html_str (str): The raw HTML string.

    Returns:
        str: A cleaned and simplified HTML string.
    """
    soup = BeautifulSoup(html_str, "html.parser")
    class_align_map, class_style_map = extract_styles(soup)
    soup = apply_transformations(soup, class_align_map, class_style_map)
    return get_cleaned_body_html(soup)


def extract_styles(
    soup: BeautifulSoup,
) -> Tuple[Dict[str, Optional[str]], Dict[str, Dict[str, Optional[str]]]]:
    """
    Extracts text alignment and style properties from CSS classes defined in the \\<style> tag.

    Args:
        soup (BeautifulSoup): Parsed HTML document.

    Returns:
        Tuple: Tuple containing a map of class names to their corresponding 'text-align' values,
        and a map of class names to their styles.
    """
    style_tag = soup.find("style")
    css_text = style_tag.string if style_tag else ""

    sheet = cssutils.parseString(css_text)

    class_align_map: Dict[str, Optional[str]] = {}
    class_style_map: Dict[str, Dict[str, Optional[str]]] = {}

    for rule in sheet:
        if rule.type == rule.STYLE_RULE:
            selector = rule.selectorText
            if utils.is_c_class_selector(selector):
                class_name = selector[1:]
                style = rule.style
                align = style.getPropertyValue("text-align")
                class_align_map[class_name] = align.strip() if align else None

                font_weight = (
                    style.getPropertyValue("font-weight").strip()
                    if style.getPropertyValue("font-weight")
                    else None
                )
                font_style = (
                    style.getPropertyValue("font-style").strip()
                    if style.getPropertyValue("font-style")
                    else None
                )
                text_decoration = (
                    style.getPropertyValue("text-decoration").strip()
                    if style.getPropertyValue("text-decoration")
                    else None
                )

                class_style_map[class_name] = {
                    "font-weight": font_weight,
                    "font-style": font_style,
                    "text-decoration": text_decoration,
                }

    return class_align_map, class_style_map


def apply_transformations(
    soup: BeautifulSoup,
    class_align_map: Dict[str, Optional[str]],
    class_style_map: Dict[str, Dict[str, Optional[str]]],
) -> BeautifulSoup:
    """
    Applies a series of transformations to clean up the HTML structure.

    These include:
        - Applying paragraph alignment
        - Replacing \\<span> tags with semantic tags
        - Merging adjacent semantic tags
        - Flattening spans
        - Removing newlines
        - Ensuring paragraphs are not empty

    Args:
        soup (BeautifulSoup): The parsed HTML document.
        class_align_map (dict): Maps class names to text alignment values.
        class_style_map (dict): Maps class names to font-related style properties.

    Returns:
        BeautifulSoup: The transformed soup object.
    """
    transformations = [
        lambda s: apply_paragraph_alignment(s, class_align_map),
        lambda s: replace_spans_with_semantic_tags(s, class_style_map),
        merge_similar_adjacent_semantic_tags,
        consolidate_spans_in_paragraphs,
        strip_paragraph_newlines,
        ensure_nonempty_paragraphs,
    ]

    for transform in transformations:
        soup = transform(soup)

    return soup


def apply_paragraph_alignment(
    soup: BeautifulSoup, class_align_map: Dict[str, Optional[str]]
) -> BeautifulSoup:
    """
    Applies alignment styles to \\<p> tags based on mapped class alignments.

    Also removes unused class attributes after processing.

    Args:
        soup (BeautifulSoup): The parsed HTML document.
        class_align_map (dict): Maps class names to text alignment values.

    Returns:
        BeautifulSoup: Updated soup with \\<p> alignment applied.
    """
    for p in soup.find_all("p"):
        classes = p.get("class", [])
        alignment = None

        for cls in classes:
            if cls in class_align_map and class_align_map[cls]:
                alignment = class_align_map[cls]
                break

        if alignment:
            p["align"] = alignment

        new_classes = [c for c in classes if not utils.is_c_class_name(c)]

        if new_classes:
            p["class"] = new_classes
        else:
            del p["class"]

    return soup


def replace_spans_with_semantic_tags(
    soup: BeautifulSoup, class_style_map: Dict[str, Dict[str, Optional[str]]]
) -> BeautifulSoup:
    """
    Replaces \\<span> tags with semantic HTML tags based on associated styles.

    Args:
        soup (BeautifulSoup): The parsed HTML document.
        class_style_map (dict): Maps class names to font-related style properties.

    Returns:
        BeautifulSoup: Updated soup with semantic tags replacing spans.
    """
    for span in soup.find_all("span"):
        classes = span.get("class", [])

        if not classes:
            continue

        tags = map_classes_to_semantic_tags(classes, class_style_map)

        if not tags:
            continue

        span_content = span.decode_contents(formatter="html")
        new_node = None

        for tag in reversed(tags):
            new_tag = soup.new_tag(tag)

            if new_node is None:
                new_tag.append(BeautifulSoup(span_content, "html.parser"))

            else:
                new_tag.append(new_node)

            new_node = new_tag

        span.replace_with(new_node)

    return soup


def map_classes_to_semantic_tags(
    class_names: List[str], class_style_map: Dict[str, Dict[str, Optional[str]]]
) -> List[str]:
    """
    Maps class names to semantic HTML tags based on style properties.

    Supported formatting:
        - \\<strong> for bold
        - \\<em> for italic
        - \\<u> for underline
        - \\<s> for strikethrough

    Args:
        class_names (List[str]): List of CSS class names to map.
        class_style_map (dict): Maps class names to their style properties.

    Returns:
        List[str]: List of semantic tag names to apply (e.g., ["strong", "em"]).
    """
    tag_set = set()

    for cls in class_names:
        styles = class_style_map.get(cls, {})

        if not styles:
            continue

        font_weight = styles.get("font-weight")
        if font_weight and font_weight in ("700", "bold"):
            tag_set.add("strong")

        font_style = styles.get("font-style")
        if font_style and font_style == "italic":
            tag_set.add("em")

        text_decoration = styles.get("text-decoration")
        if text_decoration and "underline" in text_decoration:
            tag_set.add("u")

        if text_decoration and "line-through" in text_decoration:
            tag_set.add("s")

    return [tag for tag in ("strong", "em", "u", "s") if tag in tag_set]


def merge_identical_adjacent_tags(soup: BeautifulSoup, tag_name: str) -> BeautifulSoup:
    """
    Merges adjacent identical tags within paragraphs to reduce redundancy.

    Args:
        soup (BeautifulSoup): The parsed HTML document.
        tag_name (str): The semantic tag name to merge (e.g., "strong").

    Returns:
        BeautifulSoup: Updated soup with merged tags.
    """
    for p in soup.find_all("p"):
        children = list(p.children)
        i = 0
        while i < len(children) - 1:
            current = children[i]
            next_node = children[i + 1]
            # check both are tags of the same name with no intervening text/nodes
            if (
                hasattr(current, "name")
                and current.name == tag_name
                and hasattr(next_node, "name")
                and next_node.name == tag_name
            ):
                # merge next_node's content into current
                for content in list(next_node.contents):
                    current.append(content.extract())

                next_node.extract()
                # recompute children after extraction
                children = list(p.children)
            else:
                i += 1

    return soup


def merge_similar_adjacent_semantic_tags(soup: BeautifulSoup) -> BeautifulSoup:
    """
    Merges adjacent identical semantic tags for all supported types.

    Supported tags:
        - \\<strong> for bold
        - \\<em> for italic
        - \\<u> for underline
        - \\<s> for strikethrough

    Args:
        soup (BeautifulSoup): The parsed HTML document.

    Returns:
        BeautifulSoup: Updated soup with redundant tags merged.
    """
    for tag in SEMANTIC_TAGS:
        soup = merge_identical_adjacent_tags(soup, tag)
    return soup


def consolidate_spans_in_paragraphs(soup: BeautifulSoup) -> BeautifulSoup:
    """
    Flattens \\<span> tags that are purely used for plain text into raw text nodes.

    Args:
        soup (BeautifulSoup): The parsed HTML document.

    Returns:
        BeautifulSoup: Updated soup with span wrappers removed when unnecessary.
    """
    for p in soup.find_all("p"):
        span_texts = []
        new_contents = []

        for child in p.contents:
            if isinstance(child, str):
                new_contents.append(child)
            elif child.name == "span":
                span_texts.append(child.get_text())
            else:
                if span_texts:
                    combined = "".join(span_texts)
                    new_contents.append(combined)
                    span_texts = []
                new_contents.append(child)

        if span_texts:
            combined = "".join(span_texts)
            new_contents.append(combined)

        p.clear()
        for item in new_contents:
            p.append(item)

    return soup


def strip_paragraph_newlines(soup: BeautifulSoup) -> BeautifulSoup:
    """
    Removes newline characters from within paragraph (\\<p>) text nodes.

    Args:
        soup (BeautifulSoup): The parsed HTML document.

    Returns:
        BeautifulSoup: Updated soup with newlines stripped.
    """
    pattern = rf"{os.linesep}"

    for p in soup.find_all("p"):
        text_nodes = [
            descendant
            for descendant in p.descendants
            if isinstance(descendant, NavigableString)
        ]

        for text in text_nodes:
            new_text = text.replace(pattern, "")
            text.replace_with(new_text)

    return soup


def ensure_nonempty_paragraphs(soup: BeautifulSoup) -> BeautifulSoup:
    """
    Ensures that empty or whitespace-only paragraphs contain a non-breaking space (\\&nbsp;).

    Args:
        soup (BeautifulSoup): The parsed HTML document.

    Returns:
        BeautifulSoup: Updated soup with non-empty paragraphs.
    """
    for p in soup.find_all("p"):
        # check if the tag has no contents or only whitespace (including spaces/newlines)
        if not p.contents or all(
            isinstance(content, str) and content.strip() == "" for content in p.contents
        ):
            # clear existing contents just to be safe
            p.clear()
            p.append("\u00a0")

    return soup


def get_cleaned_body_html(soup: BeautifulSoup) -> str:
    """
    Extracts and unescapes the cleaned contents of the \\<body> tag.

    Args:
        soup (BeautifulSoup): The parsed HTML document.

    Returns:
        str: Unescaped HTML string from within \\<body>.
    """
    body = soup.find("body")
    body_html = body.decode_contents(formatter="html")
    return html.unescape(body_html)
