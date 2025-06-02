from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from ..commons.exceptions import InvalidHTMLFile
from .exceptions import InvalidGoogleDocsHTML
from .schemas import CleanHTMLFileSchema, CleanHTMLSchema
from .service import clean_html, clean_html_from_file

gdoc_html_cleaner_bp = Blueprint("gdoc_html_cleaner", __name__)
clean_html_schema = CleanHTMLSchema()
clean_html_file_schema = CleanHTMLFileSchema()


@gdoc_html_cleaner_bp.route("/clean", methods=["POST"])
def clean_from_text():
    try:
        data = clean_html_schema.load(data=request.get_json())
    except ValidationError as err:
        first_error = next(iter(err.messages.values()))[0]
        return jsonify({"error": first_error}), 400

    html = data.get("html")

    try:
        cleaned_html = clean_html(html)
    except InvalidGoogleDocsHTML as err:
        return jsonify({"error": str(err)}), 400
    except Exception:
        return jsonify({"error": "Internal server error"}), 500

    return jsonify({"cleanedHtml": cleaned_html}), 200


@gdoc_html_cleaner_bp.route("/clean-file", methods=["POST"])
def clean_from_file():
    try:
        data = clean_html_file_schema.load(request.files)
    except ValidationError as err:
        first_error = next(iter(err.messages.values()))[0]
        return jsonify({"error": first_error}), 400

    uploaded_file = data.get("file")

    try:
        cleaned_html = clean_html_from_file(uploaded_file)
    except InvalidHTMLFile as err:
        return jsonify({"error": str(err)}), 400
    except InvalidGoogleDocsHTML as err:
        return jsonify({"error": str(err)}), 400
    except Exception:
        return jsonify({"error": "Internal server error"}), 500

    return jsonify({"cleanedHtml": cleaned_html}), 200
