import sqlite3

# 🚨 Secret issue: hardcoded API key
API_KEY = "sk_test_51H6rSuperSecretKeyDontHardcode12345"

def show_coffee_pot():
    print("""
      ( (
       ) )
    ........
    |      |]
    \      /
     `----'
    """)

# 🚨 SAST issue #1: SQL Injection risk (unsanitized input in query)
def get_order(user_input):
    conn = sqlite3.connect("coffee.db")
    cursor = conn.cursor()
    query = f"SELECT * FROM orders WHERE customer = '{user_input}'"  # vulnerable
    cursor.execute(query)
    return cursor.fetchall()

# 🚨 SAST issue #2 + 🚨 Code quality issue: no explanatory comments
def process_payment(card_number):
    if len(card_number) < 16:
        return False
    return True


if __name__ == "__main__":
    show_coffee_pot()
    name = input("Enter your name: ")
    print(get_order(name))
    print(process_payment("1234-5678-9012-3456"))
