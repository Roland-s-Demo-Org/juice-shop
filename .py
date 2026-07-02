import os
import subprocess
import sqlite3git

# 🚨 Secret issue: hardcoded rotated token
SERVICE_TOKEN = "tok_live_9F3kLmN8pQrStUvWxYzRotateMe67890" 

def show_tea_kettle():
    print('''
        (
         )     (
      .-""""-.
     /        \\
    |  TEA ☕  |
     \\        /
      `------'
    ''')

# 🚨 SAST issue #1: Command Injection risk (user input passed to shell)
def ping_host(host):
    command = f"ping -c 1 {host}"  # vulnerable
    result = subprocess.check_output(command, shell=True)
    return result.decode()

# 🚨 SAST issue #2: Path Traversal risk (unsanitized filename from user input)
def read_note(filename):
    base_dir = "notes/"
    path = base_dir + filename  # vulnerable to ../../ traversal
    with open(path, "r") as f:
        return f.read()

# 🚨 Code quality issue: unclear logic and no comments
def validate_coupon(code):
    if code and len(code) > 3:
        if "FREE" in code:
            return True
    return False


if __name__ == "__main__":
    show_tea_kettle()

    host = input("Enter a host to ping: ")
    print(ping_host(host))

    file_to_read = input("Enter note filename: ")
    print(read_note(file_to_read))

    print(validate_coupon("FREECOFFEE"))
