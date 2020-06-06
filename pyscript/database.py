from neo4j import GraphDatabase

def database(user = 'kylin', pwd = '123'):
    driver = GraphDatabase.driver("bolt://localhost:7687", auth=(user, pwd))
    return driver