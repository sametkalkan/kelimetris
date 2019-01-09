# -*- coding: utf-8 -*-
import sqlite3
import numpy as np
from random import sample
import sys

from flask import Flask, request, jsonify
from flask_restful import Api

from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper

import cosine
from importlib import reload
from string import punctuation
import snowballstemmer
reload(sys)
# sys.setdefaultencoding('utf-8')


database_name = "kelimetris.db"
table_name="vectors"

words_list = []

stemmer = snowballstemmer.stemmer('turkish')
app = Flask(__name__)
api = Api(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


def check_same_stem(word, word_list):
    for i in word_list:
        wrd = word[0].decode('utf-8').strip()
        for p in punctuation:
            wrd = wrd.replace(p, "")
        ii = i.decode('utf-8').strip()
        stem_wrd = stemmer.stemWord(wrd)
        # stem_ii = stemmer.stemWord(ii)
        if stem_wrd == ii:
            return i
    return -1

@app.route('/',methods=['POST', 'GET'])
def post():

    if(request.method == 'POST'):
        args = request.get_json()
        #print("1----", args)

        input_word = list()
        word_list = list()



        #print("2----", args.get("words").encode())
        input_word.append(args.get("word").encode())

        for i in args.get("words").split(','):
            word_list.append((i.split('\n')[0]).encode())

        wrd = check_same_stem(input_word, word_list)
        if wrd != -1:
            return jsonify(hata=wrd)


        #print("3----", word_list)
        #print("4----", input_word)

        conn = sqlite3.connect(database_name)
        if conn.execute(cosine.isExistSQL(input_word[0])).fetchone() == None:
            return jsonify(none="none")

        word_sql = conn.execute(cosine.convert_query(input_word))
        list_sql = conn.execute(cosine.convert_query(word_list))

        result = cosine.find_all_cosine(word_sql,list_sql)
        #print("5----", result);
        result = [word.decode('utf-8') for word in result]  # bytes list to string list
        response = jsonify(output=list(result),hata="null")
        #print("onur " + result[0])
        conn.close()
        #print(response)
        return response
    else:
        return jsonify(output=words_list)


if __name__ == '__main__':
    f = open("nouns2.txt", "r")
    words_list = f.readlines()
    f.close()
    words_list = sample(words_list, len(words_list))
    app.run(host='0.0.0.0',debug=True)
