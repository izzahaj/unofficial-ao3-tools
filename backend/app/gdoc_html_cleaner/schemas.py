from marshmallow import Schema, fields

from ..commons.utils import not_empty_html

class CleanHTMLSchema(Schema):
    html = fields.String(required=True, validate=not_empty_html)


class CleanHTMLFileSchema(Schema):
    file = fields.Field(required=True)
