from marshmallow import Schema, fields
from marshmallow.validate import Regexp, Length
from ..commons.utils import not_empty_string


alphanumeric_validator = Regexp(
    r"^[a-zA-Z0-9]+$", error="Chapter must be alphanumeric."
)
length_validator = Length(
    max=12, error="Chapter ID must be at most 12 characters long."
)


class HoverTranslationSchema(Schema):
    html = fields.String(required=True, validate=not_empty_string("HTML"))
    chapter = fields.String(
        required=True,
        data_key="chapterId",
        validate=[
            not_empty_string("Chapter ID"),
            alphanumeric_validator,
            length_validator,
        ],
    )


class HoverTranslationFileSchema(Schema):
    file = fields.Field(required=True)
    chapter = fields.String(
        required=True,
        data_key="chapterId",
        validate=[
            not_empty_string("Chapter ID"),
            alphanumeric_validator,
            length_validator,
        ],
    )
