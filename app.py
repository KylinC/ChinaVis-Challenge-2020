from datetime import timedelta
from flask import Flask, render_template, request, url_for, Response
import json
import sys

app = Flask(__name__)

# 页面reload
class Config(object):
    DEBUG=True
    SEND_FILE_MAX_AGE_DEFAULT=timedelta(seconds=1)
    TEMPLATES_AUTO_RELOAD = True
app.config.from_object(Config)


@app.route('/home', methods=['POST','GET'])
@app.route('/', methods=['POST','GET'])
def home():
    return render_template('home.html')

@app.errorhandler(404)
def not_found(error):
    return render_template('404.html',result=404)


if __name__ == '__main__':
    app.run(debug = True)
