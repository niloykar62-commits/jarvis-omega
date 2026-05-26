from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "JARVIS OMEGA - GOD MODE"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"

def get_settings():
    return Settings()