from marshmallow import Schema, fields

from ..commons.utils import not_empty_string


class CleanHTMLSchema(Schema):
    html = fields.String(required=True, validate=not_empty_string("HTML"))


class CleanHTMLFileSchema(Schema):
    file = fields.Field(required=True)
