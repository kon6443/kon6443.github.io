import sqlite3
import sys
import json

def delete(id):
    conn = sqlite3.connect("test.db")
    with conn:
        cursor = conn.cursor()
        sql = 'DELETE FROM customer WHERE id=?'
        cursor.execute(sql,(id,))
        conn.commit()

def show():
    conn = sqlite3.connect("test.db")
    with conn:
        result = []
        #   generating a cursor from connection
        cursor = conn.cursor()
        cursor.execute('select * from customer')
        # Data fetch and printing out
        rows = cursor.fetchall()
        for row in rows:
            result.append(row)
            #print(row)
        return_value = json.dumps(result)
        print(return_value)

def insert(name, category, region):
    #   SQLite DB connection
    conn = sqlite3.connect("test.db")
    with conn:
        #   generating a cursor from connection
        cursor = conn.cursor()
        data = (
            ('One', 1, 'Seoul'),
            ('Two', 2, 'Suwon'),
            ('Three', 3, 'Daegu')
        )
        sql = "insert into customer(name,category,region) values (?,?,?)"
        #cursor.executemany(sql, data)    
        cursor.execute(sql,(name,category,region))
        conn.commit()        

        '''
        # connection closing
        conn.close()
        '''
    
def main2(arg):
    while(True):
        print('0: Insert')
        print('1: Show')
        print('2: Delete')
        user_input = int(input('Enter a number you want to: '))
        if(user_input==0):
            name = input('Enter a name: ')
            category = input('Enter a number: ')
            region = input('Enter a region: ')
            insert(name, category, region)
        elif(user_input==1):
            show()
        elif(user_input==2):
            user_input = int(input('Enter an ID that you wanna delete: '))
            delete(user_input)

def delete(arg):
    user_input = int(input('Enter an ID that you wanna delete: '))
    delete(user_input)
    show()

def add(arg):
    print(arg)
    name = input('Enter a name: ')
    category = input('Enter a number: ')
    region = input('Enter a region: ')
    insert(name, category, region)
    show()

def main(arg):
    #print(arg)
    show()

if __name__ == '__main__':
    main(sys.argv[1])