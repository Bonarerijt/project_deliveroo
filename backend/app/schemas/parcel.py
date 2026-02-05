from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class WeightCategory(str, Enum):
    small = "small"
    medium = "medium"
    large = "large"