import random


def generate_otp(n : int = 6):
    """
    Generates an OTP randomly of n digits 

    Args:
        n (int, optional): Number of digits in OTP. Defaults to 6.
    """
    
    upper = 10**n - 1
    lower = 10**(n - 1)
    
    return random.randint(lower, upper)

