def intellNodes(nodeRecord, cata):
    if (len(nodeRecord._labels) != 0):
        data = {"id": nodeRecord._id, "label": list(nodeRecord._labels)[0], "symbolSize": 15}
        i = 0
        for cata2 in cata:
            if (cata2 == data['label']):
                i = i + 1
        if (i == 0):
            cata.append(data['label'])
        for cata3 in cata:
            if (data['label'] == cata3):
                data.update({'category': cata.index(cata3)})

    else:
        data = {"id": nodeRecord._id, "label": 'others', "symbolSize": 15}
        i = 0;
        for cata2 in cata:
            if (cata2 == data['label']):
                i = i + 1
        if (i == 0):
            cata.append(data['label'])
        for cata3 in cata:
            if (data['label'] == cata3):
                data.update({'category': cata.index(cata3)})

    if ("id" in nodeRecord._properties.keys()):
        del nodeRecord._properties["id"]
    data.update(dict(nodeRecord._properties))

    if ('title' in data):
        data["name"] = data["title"]
    data["detail"] = str(nodeRecord._properties)
    return data, cata

def buildweathernodes_test(nodeRecord, cata):
    if (len(nodeRecord._labels) != 0):
        data = {"id": nodeRecord._id, "label": list(nodeRecord._labels)[0], "symbolSize": 20}
        if (data['label'] in cata.keys()):
            data.update({'category': cata[data['label']]})
        else:
            length = len(cata)
            cata.update({data['label']: length})
            data.update({'category': length})
    else:
        data = {"id": nodeRecord._id, "symbolSize": 15}
    data.update(dict(nodeRecord._properties))
    if ('title' in data):
        data["name"] = data["title"]
    if("delete" in nodeRecord._properties.keys()):
        del nodeRecord._properties["delete"]
    if ("bbox" in nodeRecord._properties.keys()):
        del nodeRecord._properties["bbox"]
    data["detail"] = str(nodeRecord._properties)
    return data, cata