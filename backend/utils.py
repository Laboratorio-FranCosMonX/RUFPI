import re

def validate_cpf(cpf):
    pattern = r"^\d{11}$"
    return re.match(pattern, str(cpf))

def validate_email(email):
    pattern = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
    return re.match(pattern, email)