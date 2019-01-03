## 爬虫服务器环境搭建

> upated at：2018-12-05  
> by：邢益阳，刘洋

服务器环境： `centos7`

### 1. 保证网络连通
- 打开配置文件`sudo vi /etc/sysconfig/network-scripts/ifcfg-???`  
- 添加： `DNS1=8.8.8.8`  
- 重启网络服务 `systemctl restart network.service`

### 2. 使用 `oneinstack` 一键安装环境
- 地址：[oneinstack](https://oneinstack.com/)
- 安装内容：
    - Nginx
    - Apache 2.4
    - php 7.0 [with extends: redis]
    - Java (JDK1.8)
    - Tomcat 8.5
    - database(root@oneinstack)
        - mysql5.7
        - phpMyAdmin
        - redis
        - memcached
    - iptables
    - pure-FTPd
- 运行命令：
  
  ```
  yum -y install wget

  wget http://mirrors.linuxeye.com/oneinstack-full.tar.gz && tar xzf oneinstack-full.tar.gz && ./oneinstack/install.sh --nginx_option 1 --apache_option 1 --php_option 5 --phpcache_option 1 --php_extensions redis --phpmyadmin  --tomcat_option 2 --jdk_option 2 --db_option 2 --dbinstallmethod 1 --dbrootpwd Peishen1! --pureftpd  --redis  --memcached  --iptables  --reboot 
  ```
- 开启`mysql`远程访问
    - 参考文档：[cnblogs.com/goxcheer/p/8797377.html](https://www.cnblogs.com/goxcheer/p/8797377.html)
    - 关闭并禁用系统防火墙，使用`iptables`控制端口
        - `systemctl stop firewalld`
        - `systemctl mask firewalld`
        - 在`iptables`的配置文件中设置对外开放端口
            - `sudo vi /etc/sysconfig/iptables`
            - 插入：    
                ```
                -A INPUT -p TCP -m state --state NEW -m tcp --dport 3306 -j ACCEPT
                -A INPUT -p TCP -m state --state NEW -m tcp --dport 8080 -j ACCEPT
                -A INPUT -p TCP -m state --state NEW -m tcp --dport 6379 -j ACCEPT

                # 3306: mysql
                # 6379: redis
                ```

            - 重启iptables
                - `systemctl restart iptables.service`
                - `systemctl enable iptables.service`

- 开启`Redis`远程访问
    - `sudo vi /usr/local/redis/etc/redis.conf`
    - 修改内容：
        ```conf
        # bind 127.0.0.1
        bind 0.0.0.0

        # protected-mode yes
        protected-mode no
        ```
    - 重启`redis`
        ```
        # 查看 redis 的进程号
        ps aux
        # 杀死redis进程的进程号来重启
        kill -s 9 [process_id]
        ```
- 配置 `Redis` 内存上限
    - `sudo vi /usr/local/redis/etc/redis.conf`
    - 修改 `maxmemory` 属性
    ```conf
    # maxmemory <bytes>
    # maxmemory 124000000
    # set redis max-memory as 4GB(/8GB)
    maxmemory 4294967296
    ```

### 3. 安装 `Docker` 环境
- 删除旧版本：`yum remove docker docker-common docker-selinux`
- 添加依赖：`yum install -y yum-utils device-mapper-persistent-data`
- 配置稳定仓库：`yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo`
- 执行安装：`yum install docker-ce`
- 启动docker：`systemctl start docker`
- 设置开机自启动docker：`systemctl enable docker`
- 卸载：
  ```
  yum remove docker-ce
  rm -rf /var/lib/docker
  ```
- 安装 `docker-compose`
  ```
  pip3 install docker-compose
  ```

### 4. 在`docker`环境安装并配置`kafka`
```
docker pull wurstmeister/zookeeper  
docker pull wurstmeister/kafka  

# 启动 zookeeper
docker run -d --name zookeeper -p 2181 -t wurstmeister/zookeeper

# 启动 kafka
docker run --name kafka -e HOST_IP=localhost -e KAFKA_ADVERTISED_PORT=9092 -e KAFKA_BROKER_ID=1 -e ZK=zk -p 9092 --link zookeeper:zk -t wurstmeister/kafka
```

### 5. 在`docker`环境安装并配置`RabbitMQ`
- 安装 `rabbitmq`
    ```
    docker pull rabbitmq:3-management
    
    # 启动镜像（默认用户名密码）root@Peishen1!
    docker run -d --hostname my-rabbit --name rabbit -e RABBITMQ_DEFAULT_USER=root -e RABBITMQ_DEFAULT_PASS=Peishen1! -p 15672:15672 -p 5672:5672 rabbitmq:3-management
    ```
- 打开浏览器访问：`host:15672`

### 6. 配置爬虫环境
- 安装 `Python 3.6`
  ```conf
  sudo yum install https://centos7.iuscommunity.org/ius-release.rpm

  sudo yum install python36u
  sudo yum install python36u-pip
  sudo yum install python36u-devel

  pip3.6 install --upgrade pip
  ```
- 使用 `pip` 安装 `scrapy` 框架及其相关环境
    - `sudo pip install scrapy`
    - `sudo pip install scrapyd`
    - `sudo pip install scrapyd-client`
    - `sudo pip install scrapy-redis`
    - `sudo pip install pymysql`
