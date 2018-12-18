# -*- coding: utf-8 -*-
import sqlite3
import sys

from flask import Flask, request, jsonify
from flask_restful import Api

from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper

import cosine


reload(sys)
sys.setdefaultencoding('utf-8')


database_name = "kelimetris.db"
table_name="vectors"

app = Flask(__name__)
api = Api(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/',methods=['POST'])
def get():
    args = request.get_json()

    input_word = list()
    word_list = list()

    input_word.append(args.get('word').encode())
    for i in args.get('words').split(','):
        word_list.append(i.encode())
    conn = sqlite3.connect(database_name)
    print(input_word)
    word_sql = conn.execute(cosine.convert_query(input_word))
    list_sql = conn.execute(cosine.convert_query(word_list))

    result = cosine.find_all_cosine(word_sql,list_sql)
    response = jsonify(output=list(result))

    conn.close()

    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)

