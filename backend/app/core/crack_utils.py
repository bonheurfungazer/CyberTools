import re
import time
import random

def check_password_strength(password: str):
    """
    Analyzes password strength.
    """
    length_error = len(password) < 8
    digit_error = re.search(r"\d", password) is None
    uppercase_error = re.search(r"[A-Z]", password) is None
    lowercase_error = re.search(r"[a-z]", password) is None
    symbol_error = re.search(r"\W", password) is None

    errors = []
    if length_error: errors.append("Length < 8")
    if digit_error: errors.append("No digit")
    if uppercase_error: errors.append("No uppercase")
    if lowercase_error: errors.append("No lowercase")
    if symbol_error: errors.append("No symbol")

    score = 5 - len(errors)

    return {
        "score": score,
        "max_score": 5,
        "errors": errors,
        "is_strong": score == 5
    }

def mock_brute_force(target_hash: str, wordlist_type: str):
    """
    Simulates a brute force attack on a hash.
    """
    time.sleep(2) # Simulate work

    # Mock result
    if random.choice([True, False]):
        return {
            "status": "Success",
            "hash": target_hash,
            "plaintext": "password123", # Mock cracked password
            "time_taken": "2.4s",
            "attempts": 1420
        }
    else:
        return {
            "status": "Failed",
            "hash": target_hash,
            "message": "Password not found in wordlist.",
            "time_taken": "5.0s",
            "attempts": 50000
        }
