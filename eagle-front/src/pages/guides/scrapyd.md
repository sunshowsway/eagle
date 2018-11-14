## 安装并使用 scrapyd 管理 scrapy 项目

> 需要先安装 `scrapy`等环境，并假设已经存在项目 `edu-scrapy`

#### 第一部分、安装并运行 scrapyd
安装 scrapyd
```commandline
sudo pip install scrapyd
```
在 scrapy 项目目录下启动 scrapyd 服务
```commandline
scrapyd
```
scrapyd 会开启 `localhost:6800` 作为 rpc 终端，但是在虚拟机上开启后，无法从宿主浏览器访问
  - 首先，关闭虚拟机防火墙
  - 在 iptables 中将端口 6800 打开
  - 保证虚拟机和宿主在同一网段
  - 需要修改 scrapyd 的 bind address 为虚拟机的本机 ip。需要找到 scrapyd 的安装目录，找到 config 文件进行修改。
    如果找不到，可以使用 `pip install scrapyd` 再装一次，第一行会提示已经安装的路径 `Requirement already satisfied: scrapyd in /usr/lib/python2.7/site-packages`。找到目录下的 `/scrapyd/default_scrapyd.conf` 修改 `bind_address` 为本机 ip。
再次开启 scrapyd 就可以在宿主浏览器访问控制台，下一步查看： [api文档](https://scrapyd.readthedocs.io/en/latest/api.html#)

#### 部署 scrapy 项目
安装 scrapyd-client
```commandline
sudo pip install scrapyd-client
```
使用命令 scrapyd-deploy 对 scrapy 项目进行部署

![scrapyd deploy proccess]('img/scrapyd-deploy.png')

在打包前，我们需要对 Scrapy 项目进行设置。在 Scrapy 项目目录下，找到项目根目录的 .cfg 文件（通常是 scrapy.cfg ）并用编辑器打开：

```buildoutcfg
# Automatically created by: scrapy startproject
#
# For more information about the [deploy] section see:
# https://scrapyd.readthedocs.io/en/latest/deploy.html

[settings]
default = edu_scrapy.settings

# set deploy target
[deploy:locals] 
#url = http://scrapyd.book_toscrape.com/api/scrapyd
# url set deploy target address
url = http://192.168.10.13:6800
# deploy project name
project = edu_scrapy
```

在开启 scrapyd 服务后，进行打包操作。在 `.cfg` 同级目录下使用如下命令：
```commandline
scrapyd-deploy locals -p edu_scrapy

Packing version 1538645094
Deploying to project "arts" in http://localhost:6800/addversion.json
Server response (200):
{"node_name": "node-name", "status": "ok", "project": "arts", "version": "1538645094", "spiders": 1}
```

打包部署成功