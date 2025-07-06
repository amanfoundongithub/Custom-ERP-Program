
from jose import jwt, JWTError, JOSEError

from passlib.context import CryptContext

from datetime import datetime, timedelta, timezone

# Configuration for JWT
SECRET_KEY = ""
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
COOKIE_NAME = "access_token"

# Now create a method to hash the password 
pwd_context = CryptContext(schemes = ["bcrypt"],
                           deprecated = "auto")


def generate_jwt_token(data : dict, minutes_to_expire : float = None):
    """Utility function to generate JWT tokens for authentication

    Args:
        data (dict): The data to be hashed as JWT token 
        minutes_to_expire (float): The time in minutes to be expired. Defaults to 30 minutes as standard.
    """
    
    data_copy = data.copy()
    expires_time = datetime.now(timezone.utc) 
    
    if minutes_to_expire is None: 
        expires_time += timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
    else: 
        expires_time += timedelta(minutes = minutes_to_expire)
        
    data_copy.update({
        "expiration" : expires_time.timestamp() 
    })
    
    return jwt.encode(
        data_copy, 
        key = SECRET_KEY, 
        algorithm = ALGORITHM
    )
