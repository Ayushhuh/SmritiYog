"""Central configuration for patient-domain values.

These are the single source of truth for the enumerations used when adding and
linking patients. Keeping them here (rather than hard-coded across the app and
API) lets the UI share the same options.
"""

SUPPORTED_PATIENT_LANGUAGES = frozenset({"en", "hi", "as", "bn", "brx", "mni"})

PATIENT_RELATIONSHIPS = frozenset({"child", "spouse", "grandchild", "sibling", "other"})