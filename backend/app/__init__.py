from config import DevConfig
from flask import Flask, request
from flask_cors import CORS


def create_app(config_class=DevConfig):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # extensions
    if config_class == DevConfig:
        CORS(
            app,
            resources={
                r"/api/*": {
                    "origins": ["http://localhost:3000", "http://127.0.0.1:3000"]
                }
            },
        )
    else:
        # TODO: config for production
        CORS(app)

    @app.before_request
    def handle_options():
        if request.method == "OPTIONS":
            return "", 204

    # register blueprints
    from app.gdoc_html_cleaner.controller import gdoc_html_cleaner_bp
    from app.hover_translation.controller import hover_translation_bp

    app.register_blueprint(gdoc_html_cleaner_bp, url_prefix="/api/gdoc-html-cleaner")
    app.register_blueprint(hover_translation_bp, url_prefix="/api/hover-translation")

    return app
