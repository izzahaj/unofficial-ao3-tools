from marshmallow import Schema, fields, ValidationError


def not_empty_html(value: str):
    if not value.strip():
        raise ValidationError("HTML content cannot be empty.")


class CleanHTMLSchema(Schema):
    html = fields.String(required=True, validate=not_empty_html)


class CleanHTMLFileSchema(Schema):
    file = fields.Field(required=True)
