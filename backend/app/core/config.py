from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://flashdecks:flashdecks@localhost:5432/flashdecks"
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Flashdecks"

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
