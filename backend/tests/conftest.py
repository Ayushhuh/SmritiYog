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


async def _register(db_engine, name: str, email: str) -> models.User:
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
            role="caregiver",
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user


@pytest.fixture()
async def caregiver(db_engine):
    return await _register(db_engine, "Anita", "anita@example.com")


@pytest.fixture()
async def caregiver_token(caregiver, db_engine):
    from app.security import create_access_token

    return create_access_token(str(caregiver.id), caregiver.role)


@pytest.fixture()
async def caregiver_client(client, caregiver_token):
    client.headers.update({"Authorization": f"Bearer {caregiver_token}"})
    yield client
    client.headers.pop("Authorization", None)


@pytest.fixture()
async def other_caregiver(db_engine):
    return await _register(db_engine, "Ravi", "ravi@example.com")


@pytest.fixture()
async def other_caregiver_token(other_caregiver, db_engine):
    from app.security import create_access_token

    return create_access_token(str(other_caregiver.id), other_caregiver.role)


async def _make_user(db_engine, name: str, email: str, role: str) -> models.User:
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
            role=role,
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user


@pytest.fixture()
async def admin_token(db_engine):
    from app.security import create_access_token

    user = await _make_user(db_engine, "Boss", "boss@example.com", "admin")
    return create_access_token(str(user.id), user.role)