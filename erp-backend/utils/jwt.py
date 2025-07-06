
from jose import jwt, JWTError, JOSEError, ExpiredSignatureError

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

def decode_jwt_token(token : str):
    """Utility function to decode JWT tokens for authentication 

    Args:
        token (str): The JWT token to be decoded
        
    Returns:
        A dictionary if the token is successfully decoded 
    
    Errors:
        If the token expires, or is not valid, then the json that is returned will contain not decoded signature 
    """
    
    try: 
        data = jwt.decode(
            token = token, 
            key = SECRET_KEY,
            algorithms = ALGORITHM
        )
        
        data.update({
            "decoded" : True 
        })
        
        return data 
    except JWTError as e:
        
        return {
            "decoded" : False, 
            "message" : "INVALID_TOKEN"
        }
    
    except ExpiredSignatureError as e:
        
        return {
            "decoded" : False, 
            "message" : "EXPIRED"
        }
    
    except Exception as e:
        
        return {
            "decoded" : False, 
            "message" : "MISC_ERROR"
        }