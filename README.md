# ChinaVis-Challenge-2020

[![https://img.shields.io/badge/python-3.7.2-blue](https://img.shields.io/badge/python-3.7.2-blue)]()

[![](https://img.shields.io/badge/flask-1.1.1-red)]()

[![](https://img.shields.io/badge/neo4j-3.5.7-green)]()

本可视化系统聚焦疫情下的经济与舆情监测分析，力图挖掘疫情发展态势与各经济指标、相
关事件的舆论风向的潜在时空关联，分析各地区各时间段内经济结构受疫情的影响程度、各地区各时间段内的舆情态势、疫情舆论与社会热点事件间的潜在关联以及传播溯源、各地舆论的情感态势以及与新闻发布平台的特征关联性，为各地区的生产恢复建设以及舆论导控提供一些建议，具有一定的社会意义和应用价值。



### 运行

- 安装 [neo4j server](https://neo4j.com/download-center/#community)

- 启动数据库

```bash
./neo4j-server/bin/neo4j start
```

- 安装python依赖

```bash
pip install requirements.txt
```

- 修改数据库连接密码

```
vim ChinaVis-Challenge-2020/pyscript/database.py
```



- 启动

```
python app.py
```



### 效果

![截屏2020-06-16 下午6.10.50](http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-06-16-101201.png)


![截屏2020-06-16 下午6.11.00](http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-06-16-101214.png)


