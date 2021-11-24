import sqlite3
import sys
import json

def main(arg):
    #sql processing
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT Country FROM Uni_Programs_Requ")
    data = cursor.fetchall()

    words = []
    results = {}
    results["country"] = []
    #comparing with the db file
    for row in data:
        for word in row:
            words.append(word.strip().lower())
            if arg == word[:len(arg)].strip().lower():
                results["country"].append(word)
    return_value = json.dumps(results)
    print(return_value)

if __name__ == '__main__':
    main(sys.argv[1])