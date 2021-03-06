# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import math
import sqlite3
import operator
import sys

from importlib import reload
reload(sys)
# sys.setdefaultencoding('utf-8')




def cosine_similarity(v1, v2, vec_len):
    sumxx, sumxy, sumyy = 0, 0, 0
    for i in range(vec_len):
        x = v1[i]; y = v2[i]
        sumxx += (x*x)
        sumyy += (y*y)
        sumxy += x*y
    return sumxy/math.sqrt(sumxx*sumyy)


def isExistSQL(word):
    return "SELECT * FROM vectors where name == \'" + word.decode('utf-8') + "\'"

def convert_query(words):
    temp_list = ""
    for i in range((len(words))):
        words[i] =  words[i].strip()
        if (i == len(words) - 1):
            temp_list += "\'" + words[i].decode("utf-8")  + "\'"
        else:
            temp_list += "\'" + words[i].decode("utf-8")  + "\', "

    return "SELECT * FROM vectors where name IN (" + temp_list + ")"





def find_all_cosine(one, all):
    word_value = one.fetchone()
    mainword = word_value[1]            # this is word
    vect_of_mainword = []               # this is vector that of word
    array = dict()
    for vec in word_value[2].split(' '):
        vect_of_mainword.append(float(vec))
    print(vect_of_mainword);
    #-----------------------------------------------#
    for row in all:
        print(row);
        vect_of_word = []
        for vec in row[2].split(' '):
            vect_of_word.append(float(vec))
        array[row[1].encode()] = repr(cosine_similarity(vect_of_mainword, vect_of_word, 200))
    print(array);
    sorted_array = sorted(array.items(), key = operator.itemgetter(1))
    print(sorted_array);
    result = []

    for i in range(len(sorted_array)-1,0,-1):
        if(float(sorted_array[i][1]) >= 0.15):
            result.append(sorted_array[i][0])
    return result






'''
# this block opens database connection
conn = sqlite3.connect(database_name)

print (database_name + " database successfully")
print ("+---------------------------------+")

#print(convert_query(input_word))
#print(convert_query(words_list))

word_sql = conn.execute(convert_query(input_word))
list_sql = conn.execute(convert_query(words_list))

find_all_cosine(word_sql, list_sql)

conn.close()
print ("+----------------------------------------+")
print (database_name + " database closed successfully")
'''