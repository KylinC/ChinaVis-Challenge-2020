#!/usr/bin/env python
#encoding=utf-8

import json
from flask import Blueprint, render_template, session, redirect, url_for, request, \
    Response, flash, g, jsonify, abort


mod1 = Blueprint('demo1', __name__)

@mod1.route("/demo1")
def demo1():
    return render_template('demo1.html')

@mod1.errorhandler(404)
def not_found(error):
    return render_template('404.html',result=404)