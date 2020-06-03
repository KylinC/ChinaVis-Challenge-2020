#!/usr/bin/env python
#encoding=utf-8

import sys
from flask import Blueprint, render_template, session, redirect, url_for, request, \
    Response, flash, g, jsonify, abort
from pyscript.database import database
from pyscript.data_init import *
import json

driver = database()
scatter_dict2 = {}

mod2 = Blueprint('demo2', __name__)

@mod2.route("/demo2")
def demo2():
    return render_template('demo2.html')

@mod2.route("/demo2/KG",methods = ['POST'])
def getdatafromDB():
    data = request.get_data()
    str_input = json.loads(data)

    seaorder ="match (a:News)-[r]->(w) return a,w,r"

    with driver.session() as session:

        results = session.run(seaorder).values()

        print(results)

        nodeList = []
        edgeList = []
        if(len(results)!=0):
             for result in results:
                nodeList.append(result[0])
                nodeList.append(result[1])
                edgeList.append(result[2])

        scatter_dict2.update({"results": results})

        nodeList = list(set(nodeList))
        edgeList = list(set(edgeList))
        cata=[]
        nodes=[]

        for nodelist in nodeList:
            nodes.append(intellNodes(nodelist, cata)[0])
        edges = []
        id_tmp = 0
        for edge in edgeList:
            data = {"id": str(id_tmp),
                    "source": str(edge.start_node._id),
                    "target": str(edge.end_node._id),
                    "name": str(edge.type)}
            id_tmp += 1
            edges.append(data)

    json_data = json.dumps({"nodes": nodes, "edges": edges, "catas": cata})
    callback = request.args.get('callback')
    return Response('{}({})'.format(callback, json_data))

@mod2.route("/demo2/click", methods=['POST'])
def click_node():
    data = request.get_data()
    data_input = json.loads(data)

    click_point_data = data_input[0]

    aim_name = "'" + click_point_data["name"] + "'"
    # print(aim_name)
    neoorder1 = 'MATCH (p1)-[r1]->(p2:%s{name:%s}) RETURN p1,p2,r1' % (click_point_data["label"], aim_name)
    neoorder2 = 'MATCH (p1:%s{name:%s})-[r1]->(p2) RETURN p1,p2,r1' % (click_point_data["label"], aim_name)

    nodeList = []
    edgeList = []
    with driver.session() as session:
        old_results = scatter_dict2["results"]
        results1 = session.run(neoorder1).values()
        results2 = session.run(neoorder2).values()
        results = results1 + results2 + old_results
        scatter_dict2.update({"results": results})
        for result in results:
            nodeList.append(result[0])
            nodeList.append(result[1])
            nodeList = list(set(nodeList))
            edgeList.append(result[2])
            edgeList = list(set(edgeList))

        tmp_nodeList = []
        tmp_nodeId = []
        tmp_edgeList = []
        tmp_edegId = []

        for item in nodeList:
            if item._id in tmp_nodeId:
                continue
            else:
                tmp_nodeList.append(item)
                tmp_nodeId.append(item._id)
        nodeList = tmp_nodeList

        for item in edgeList:
            if item._id in tmp_edegId:
                continue
            else:
                tmp_edgeList.append(item)
                tmp_edegId.append(item._id)
        edgeList = tmp_edgeList

        cata = {}
        nodes = []
        for node in nodeList:
            tmp_node, cata = buildweathernodes_test(node, cata)
            nodes.append(tmp_node)
        edges = []
        id_tmp = 0
        for edge in edgeList:
            data = {"id": id_tmp,
                    "source": str(edge.start_node._id),
                    "target": str(edge.end_node._id),
                    "name": str(edge.type)}
            id_tmp += 1
            edges.append(data)

    json_data = json.dumps({"nodes": nodes, "edges": edges, "catas": list(cata.keys())})
    callback = request.args.get('callback')
    return Response('{}({})'.format(callback, json_data))