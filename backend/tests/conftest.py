import os
from collections.abc import Iterator

os.environ["DATABASE_URL"] = "sqlite://"
os.environ["GEMINI_API_KEY"] = ""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.core.rate_limit import windows
from app.main import app


@pytest.fixture()
def client() -> Iterator[TestClient]:
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    factory = sessionmaker(bind=engine)
    Base.metadata.create_all(engine)

    def database():
        with factory() as session:
            yield session

    app.dependency_overrides[get_db] = database
    windows.clear()
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    engine.dispose()


def login(client: TestClient, email: str = "demo@example.com") -> dict[str, str]:
    data = {"email": email, "password": "demo-pass-123", "full_name": "Demo User"}
    assert client.post("/api/auth/register", json=data).status_code == 201
    response = client.post("/api/auth/login", json=data)
    assert response.status_code == 200
    return {"Authorization": "Bearer " + response.json()["access_token"]}
