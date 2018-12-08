# -*- coding: utf-8 -*-
from flask import Flask,request,jsonify
from flask_restful import Resource, Api
import cosine
import sqlite3
import sys
reload(sys)
sys.setdefaultencoding('utf-8')


database_name = "kelimetris.db"
table_name="vectors"

app = Flask(__name__)
api = Api(app)


@app.route('/')
def get():
    args = request.args
    input_word = list()
    word_list = list()

    input_word.append(args['input'].encode())
    for i in args['words'].split(','):
        word_list.append(i.encode())

    conn = sqlite3.connect(database_name)

    word_sql = conn.execute(cosine.convert_query(input_word))
    list_sql = conn.execute(cosine.convert_query(word_list))

    result = cosine.find_all_cosine(word_sql,list_sql)

    conn.close()

    return jsonify(output=list(result))


if __name__ == '__main__':
    app.run(debug=True)