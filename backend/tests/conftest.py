import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app import models
from app.database import Base, get_session
from app.main import app
from app.security import hash_password


@pytest.fixture()
async def db_engine():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture()
async def db_session(db_engine):
    factory = async_sessionmaker(
        bind=db_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    async with factory() as session:
        yield session


@pytest.fixture()
async def client(db_engine):
    factory = async_sessionmaker(
        bind=db_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    async def override_get_session():
        async with factory() as session:
            yield session

    app.dependency_overrides[get_session] = override_get_session

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.pop(get_session, None)


async def _register_user(db_engine, name: str, email: str) -> models.User:
    factory = async_sessionmaker(
        bind=db_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    async with factory() as session:
        user = models.User(
            name=name,
            email=email,
            password_hash=hash_password("password123"),
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user


@pytest.fixture()
async def test_user(db_engine):
    return await _register_user(db_engine, "Anita", "anita@example.com")


@pytest.fixture()
async def test_user_token(test_user, db_engine):
    from app.security import create_access_token

    return create_access_token(str(test_user.id))


@pytest.fixture()
async def auth_client(client, test_user_token):
    client.headers.update({"Authorization": f"Bearer {test_user_token}"})
    yield client
    client.headers.pop("Authorization", None)