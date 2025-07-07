import bcrypt

def encrypt_password(password : str) -> str:
    """Utility to encrypt a password

    Args:
        password (str): The password to be encrypted

    Returns:
        str: The encrypted password
    """
    password_into_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_into_bytes, salt)
    
    return hashed_password.decode("utf-8")


def compare_password(candidate : str, hashed_password : str) -> bool:
    """Utility to compare a password & its hash

    Args:
        candidate (str): The plain text password to be checked
        hashed_password (str): The hash of the actual password

    Returns:
        bool: Comparison results
    """
    return bcrypt.checkpw(
        candidate.encode("utf-8"),
        hashed_password.encode("utf-8")
    )