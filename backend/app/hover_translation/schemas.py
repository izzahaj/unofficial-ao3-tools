from marshmallow import Schema, fields
from marshmallow.validate import Range
from ..commons.utils import not_empty_html


class HoverTranslationSchema(Schema):
    html = fields.String(required=True, validate=not_empty_html)
    chapter = fields.Integer(required=True, validate=Range(min=1, error="Chapter must be a positive integer."))


class HoverTranslationFileSchema(Schema):
    file = fields.Field(required=True)
    chapter = fields.Integer(required=True, validate=Range(min=1, error="Chapter must be a positive integer."))
