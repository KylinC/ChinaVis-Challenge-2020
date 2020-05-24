#!/usr/bin/env python
#encoding=utf-8

import sys
from flask import Flask, render_template, request, url_for, Response
import json
###############
# python script
###############

app = Flask(__name__)

@app.route('/', methods=['POST','GET'])
def index():
    return render_template('index.html')

@app.errorhandler(404)
def not_found(error):
    return render_template('404.html',result=404)


from demo import demo1
app.register_blueprint(demo1.mod1)
from demo import demo2
app.register_blueprint(demo2.mod2)

if __name__ == "__main__":
    app.run(debug = True)