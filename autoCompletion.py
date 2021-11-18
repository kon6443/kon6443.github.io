import time
import keyboard
import sqlite3
import sys

def search_strs():
    search_str = ""
    while True:
        time.sleep(0.1)
        key_press = keyboard.read_key()
        if key_press == "backspace" and search_str:
            search_str = search_str[:-1]
        elif len(key_press) == 1 and ('a' <= key_press <= 'z'):
            search_str += keyboard.read_key()
        else:
            continue
        yield search_str


def main():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("SELECT Country FROM Uni_Programs_Requ")
    data = c.fetchall()
    words = []
    for row in data:
        for word in row:
            words.append(word.strip().lower())

    for search_str in search_strs():
        for word in words:
            if word[:len(search_str)] == search_str:
                print(word)

if __name__ == '__main__':
    main(sys.argv)

