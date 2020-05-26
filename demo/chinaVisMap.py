#!/usr/bin/env python
#encoding=utf-8

import json
from flask import Blueprint, render_template, session, redirect, url_for, request, \
    Response, flash, g, jsonify, abort


visMap = Blueprint('chinaVisMap', __name__)

@visMap.route("/chinaVisMap")
def chinaVis_map():
    return render_template('chinaVisMap.html')