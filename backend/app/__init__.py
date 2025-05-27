from flask import Flask
from flask_cors import CORS
from config import DevConfig


def create_app(config_class=DevConfig):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # extensions
    CORS(app)

    # register blueprints
    from app.gdoc_html_cleaner.controller import cleaner_bp

    app.register_blueprint(cleaner_bp)

    return app
