"""Patient UID generation utilities.

Generates unique 6-digit numeric UIDs for patient accounts.
The UID is server-side only and never generated on the frontend.
"""

import random
import string

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models

UID_LENGTH = 6
MAX_RETRIES = 20


def generate_uid_candidate() -> str:
    """Generate a random 6-digit numeric UID."""
    digits = [random.choice(string.digits) for _ in range(UID_LENGTH)]
    # Ensure the UID doesn't start with 0
    if digits[0] == "0":
        digits[0] = random.choice("123456789")
    return "".join(digits)


async def generate_unique_uid(session: AsyncSession) -> str:
    """Generate a unique 6-digit numeric UID, checking the database for collisions."""
    for _ in range(MAX_RETRIES):
        uid = generate_uid_candidate()
        existing = await session.scalar(
            select(models.Patient).where(models.Patient.uid == uid)
        )
        if existing is None:
            return uid

    raise RuntimeError(
        "Failed to generate a unique patient UID after multiple attempts."
    )
