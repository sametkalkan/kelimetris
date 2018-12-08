# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import math
import sqlite3
import sys
reload(sys)
sys.setdefaultencoding('utf-8')




def cosine_similarity(v1, v2, vec_len):
    sumxx, sumxy, sumyy = 0, 0, 0
    for i in range(vec_len):
        x = v1[i]; y = v2[i]
        sumxx += (x*x)
        sumyy += (y*y)
        sumxy += x*y
    return sumxy/math.sqrt(sumxx*sumyy)




def convert_query(words):
    temp_list = ""
    for i in range((len(words))):
        if (i == len(words) - 1):
            temp_list += "\'" + words[i] + "\'"
        else:
            temp_list += "\'" + words[i] + "\', "

    return "SELECT * FROM vectors where name IN (" + temp_list + ")"





def find_all_cosine(one, all):
    word_value = one.fetchone()
    mainword = word_value[1]            # this is word
    vect_of_mainword = []               # this is vector that of word
    for vec in word_value[2].split(' '):
        vect_of_mainword.append(float(vec))
    #-----------------------------------------------#
    for row in all:
        vect_of_word = []
        for vec in row[2].split(' '):
            vect_of_word.append(float(vec))

        str = mainword + "\t" + row[1].encode() + "\t" + repr(cosine_similarity(vect_of_mainword, vect_of_word, 200))
        print(str)






database_name = "kelimetris.db"
table_name="vectors"

input_word = ['hacettepe']
words_list = ['yemek', 'hastahane', 'sağlık', 'sıhhıye', 'mühendislik', 'üniversite', 'bilim', 'sanat', 'beytepe', 'tıp']


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