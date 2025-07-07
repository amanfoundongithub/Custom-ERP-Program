from fastapi import Request
from utils.jwt import decode_jwt_token, COOKIE_NAME

def verify_auth_token(request : Request):
    """Middleware for verifying authorization token using cookies 

    Args:
        request (Request): The request to be validated

    Returns:
        dict: The dictionary contains "valid" for checking if token is valid and an error message 
    """
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        return {
            "valid" : False,
            "error" : "INVALID_REQUEST"
        }
    
    # Data
    data = decode_jwt_token(token)
    
    # Check if valid token 
    if data.get("decoded") == False:
        return {
            "valid" : False, 
            "error" : data.get("message")
        }
    else: 
        data.update({
            "valid" : True 
        })
        return data 