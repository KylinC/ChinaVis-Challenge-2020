#!/usr/bin/env python
#encoding=utf-8

import sys
from flask import Flask, render_template, request, url_for, Response
import json
from datetime import timedelta
###############
# python script
###############

app = Flask(__name__)

####################添加配置##########################
class Config(object):
    DEBUG=True
    SEND_FILE_MAX_AGE_DEFAULT=timedelta(seconds=1)
    TEMPLATES_AUTO_RELOAD = True  # 刷新之后自动加载
app.config.from_object(Config)
######################################################

@app.route('/', methods=['POST','GET'])
def index():
    return render_template('demo1.html')

@app.errorhandler(404)
def not_found(error):
    return render_template('404.html',result=404)


from demo import demo1
app.register_blueprint(demo1.mod1)
from demo import demo2
app.register_blueprint(demo2.mod2)
from demo import chinaVisMap
app.register_blueprint(chinaVisMap.visMap)

if __name__ == "__main__":
    app.run(debug = True)