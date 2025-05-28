import os

from app import create_app
from config import DevConfig, ProdConfig, TestConfig

config_map = {
    "dev": DevConfig,
    "prod": ProdConfig,
    "test": TestConfig,
}

env = os.getenv("FLASK_ENV", "dev")
port = int(os.getenv("PORT", 5000))
app = create_app(config_map[env])

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port)
