class InvalidGoogleDocsHTML(Exception):
    """Raised when the input HTML is not from Google Docs."""

    pass


class InvalidHTMLFile(Exception):
    """Raised when the uploaded HTML file is invalid or unreadable."""

    pass
