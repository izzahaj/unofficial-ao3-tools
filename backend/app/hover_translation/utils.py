def escape_character(text: str, char_to_escape: str) -> str:
    """
    Escapes all occurrences of a specific character in a string by prefixing it with a backslash.

    Args:
        text (str): The input string to process.
        char_to_escape (str): The character to escape in the input string.

    Returns:
        str: The modified string with the specified character escaped.

    Example:
        >>> escape_character('He said "hello"', '"')
        'He said \\"hello\\"'
    """
    escaped_char = "\\" + char_to_escape
    return text.replace(char_to_escape, escaped_char)
