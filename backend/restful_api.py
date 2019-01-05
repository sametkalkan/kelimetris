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

reload(sys)
# sys.setdefaultencoding('utf-8')


database_name = "kelimetris.db"
table_name="vectors"

words_list = []


app = Flask(__name__)
api = Api(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response




@app.route('/',methods=['POST', 'GET'])
def post():

    if(request.method == 'POST'):
        args = request.get_json()
        print("1----", args)

        input_word = list()
        word_list = list()

        print("2----", args.get("words").encode())
        input_word.append(args.get("word").encode())

        for i in args.get("words").split(','):
            word_list.append((i.split('\n')[0]).encode())


        print("3----", word_list)
        print("4----", input_word)

        conn = sqlite3.connect(database_name)

        word_sql = conn.execute(cosine.convert_query(input_word))
        list_sql = conn.execute(cosine.convert_query(word_list))

        result = cosine.find_all_cosine(word_sql,list_sql)
        print("5----", result);
        result = [word.decode('utf-8') for word in result]  # bytes list to string list
        response = jsonify(output=list(result))
        print("onur " + result[0])
        conn.close()
        print(response)
        return response
    else:
        return jsonify(output=words_list)


if __name__ == '__main__':
    f = open("nouns.txt", "r")
    words_list = f.readlines()
    f.close()
    words_list = sample(words_list, len(words_list))
    app.run(host='0.0.0.0',debug=True)

