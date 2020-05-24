#!/usr/bin/env python
#encoding=utf-8

import sys
from flask import Blueprint, render_template, session, redirect, url_for, request, \
    Response, flash, g, jsonify, abort
import json

mod2 = Blueprint('demo2', __name__)

@mod2.route("/demo2")
def home2():
    return render_template('demo2.html')