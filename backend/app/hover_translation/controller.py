from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from .schemas import HoverTranslationFileSchema, HoverTranslationSchema
from ..commons.exceptions import InvalidHTMLFile
from .service import generate_translations, generate_translations_from_file

hover_translation_bp = Blueprint("hover_translation", __name__)
hover_translation_schema = HoverTranslationSchema()
hover_translation_file_schema = HoverTranslationFileSchema()


@hover_translation_bp.route("/generate", methods=["POST"])
def generate_from_text():
    try:
        data = hover_translation_schema.load(data=request.get_json())
    except ValidationError as err:
        first_error = next(iter(err.messages.values()))[0]
        return jsonify({"error": first_error}), 400

    html = data.get("html")
    chapter_id = data.get("chapter_id")

    try:
        new_html, new_css = generate_translations(html, chapter_id)
    except Exception:
        return jsonify({"error": "Internal server error"}), 500

    return jsonify({"html": new_html, "css": new_css}), 200


@hover_translation_bp.route("/generate-file", methods=["POST"])
def generate_from_file():
    try:
        data = hover_translation_file_schema.load({**request.files, **request.form})
    except ValidationError as err:
        first_error = next(iter(err.messages.values()))[0]
        return jsonify({"error": first_error}), 400

    uploaded_file = data.get("file")
    chapter_id = data.get("chapter_id")

    try:
        new_html, new_css = generate_translations_from_file(uploaded_file, chapter_id)
    except InvalidHTMLFile as err:
        return jsonify({"error": str(err)}), 400
    except Exception:
        return jsonify({"error": "Internal server error"}), 500

    return jsonify({"html": new_html, "css": new_css}), 200
