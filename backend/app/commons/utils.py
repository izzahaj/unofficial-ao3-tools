from marshmallow import ValidationError
from werkzeug.datastructures import FileStorage
from .exceptions import InvalidHTMLFile


def not_empty_string(field_name: str):
    def validator(value: str):
        if not value or not value.strip():
            raise ValidationError(f"{field_name} cannot be empty.")

    return validator


def read_uploaded_html_file(file: FileStorage) -> str:
    try:
        html = file.stream.read().decode("utf-8")
    except Exception:
        raise InvalidHTMLFile(
            "Unable to read the uploaded file. Please check that it's a valid HTML file."
        )

    return html
