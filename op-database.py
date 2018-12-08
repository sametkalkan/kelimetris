# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import math
import sqlite3
import sys
reload(sys)
sys.setdefaultencoding('utf-8')


# create database for speceific database name
def create_database(database_name):
    conn = sqlite3.connect(database_name)
    print ("Create database successfully for " + database_name)
    conn.close()


# create table 3 column these are id, name, value.
# id is primary key
# name is word
# value is vector of word
def create_table(database_name,table_name):
    conn = sqlite3.connect(database_name)
    print ('Opened database successfully')


    conn.execute("CREATE TABLE " + table_name + '''(
                        id      INTEGER    PRIMARY KEY  NOT NULL ,
                        name    VARCHAR(50)   NOT NULL,
                        value   TEXT    NOT NULL);''')
    conn.close()


# +-----------------------------------------+
# | id  |   name    |   value               |
# -------------------------------------------
# | 22  |   kilit   | '-0.233, 0.454, ... ' |
# +------------------------------------------+
def insert_table(database_name, table_name, file_name):
    conn = sqlite3.connect(database_name)
    conn.text_factory = lambda x: unicode(x, "utf-8", "ignore")
    word = ""
    vecvalue = ""
    with open(file_name) as f:
        lines = f.readlines()
        for i in range(len(lines)):
            word = lines[i].split(' ')[0].decode('utf8')
            for j in range(len(lines[i].split(' '))):
                if(j != 0 and j != len(lines[i].split(' ')) -1):
                    if(j == 1):
                        vecvalue = str(lines[i].split(' ')[j])
                    else:
                        vecvalue += ' ' + str(lines[i].split(' ')[j])

            sql = "INSERT INTO "+table_name+" VALUES (?, ?, ?);"
            conn.execute(sql, [str(i+1), word, vecvalue])
            vecvalue = ""
    conn.commit()
    conn.close()



database_name = 'kelimetris.db'
table_name = 'vectors'
file_name = 'vectors.txt'

create_database(database_name)
create_table(database_name, table_name)
insert_table(database_name, table_name, file_name)