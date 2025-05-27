class Config:
    DEBUG = False
    TESTING = False


class DevConfig(Config):
    DEBUG = True
    ENV = "dev"


class ProdConfig(Config):
    ENV = "prod"


class TestConfig(Config):
    TESTING = True
    ENV = "test"
