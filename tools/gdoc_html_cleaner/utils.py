from bs4 import BeautifulSoup


def is_c_class_selector(selector: str) -> bool:
    """
    Checks if a given CSS selector matches the pattern for a 'c' class (e.g., '.c1', '.c23').

    Args:
        selector (str): A CSS selector string.

    Returns:
        bool: True if the selector starts with '.c' followed by digits only, False otherwise.
    """
    return selector.startswith(".c") and selector[2:].isdigit()


def is_c_class_name(class_name: str) -> bool:
    """
    Checks if a given class name matches the pattern for a 'c' class (e.g., 'c1', 'c23').

    Args:
        class_name (str): A class name string.

    Returns:
        bool: True if the class name starts with 'c' followed by digits only, False otherwise.
    """
    return class_name.startswith("c") and class_name[1:].isdigit()


def is_gdoc_html(html: str) -> bool:
    """
    Determines whether a given HTML string is likely exported from Google Docs.

    The function checks two main criteria:
        1. The \\<body> tag has a class that includes 'doc-content'.
        2. There are elements in the HTML with class names matching the 'c' + digits pattern (e.g., 'c1', 'c23').

    Args:
        html (str): A string containing HTML content.

    Returns:
        bool: True if the HTML appears to be from Google Docs, False otherwise.
    """
    soup = BeautifulSoup(html, "html.parser")
    body = soup.find("body")

    has_doc_content = body and body.get("class") and "doc-content" in body["class"]

    has_c_number_classes = any(
        tag.get("class") and any(is_c_class_name(cls) for cls in tag["class"])
        for tag in soup.find_all(True)
    )

    return has_doc_content and has_c_number_classes
