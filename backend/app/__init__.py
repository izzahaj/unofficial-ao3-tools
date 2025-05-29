from config import DevConfig
from flask import Flask
from flask_cors import CORS


def create_app(config_class=DevConfig):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # extensions
    CORS(app)

    # register blueprints
    from app.gdoc_html_cleaner.controller import gdoc_html_cleaner_bp
    from app.hover_translation.controller import hover_translation_bp

    app.register_blueprint(gdoc_html_cleaner_bp)
    app.register_blueprint(hover_translation_bp)

    return app
