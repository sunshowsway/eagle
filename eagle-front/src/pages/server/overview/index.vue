<!--suppress ALL -->
<template>
    <d2-container>
        <el-row :gutter="20">
            <el-col :span="6" :xl="6" :lg="6" :sm="8" :xs="13">
                <div class="grid-content cu-aside">
                    <el-input size="mini" placeholder="请输入服务器名称" clearable disabled></el-input>
                    <el-button type="text" icon="el-icon-search" disabled></el-button>
                    <el-button type="text"
                               icon="el-icon-plus"
                               v-on:click="openAddServer()"
                               style="margin-right: 12px; float: right;"></el-button>

                    <el-card class="box-card cu-server-list" style="margin-top: 4px;" shadow="never">
                        <ul>
                            <li v-for="server in serverList">
                                <span class="el-icon-success"
                                      style="color:#67C23A; float: right; position: relative; top: 11px;"></span>
                                <p>{{server.name}}</p>
                                <span>{{server.ip}}</span>
                            </li>
                        </ul>
                    </el-card>
                </div>
            </el-col>

            <el-col :span="18" :xl="18" :lg="18" :sm="16" :xs="13">
                <div class="grid-content cu-main-content">
                    <el-card shadow="never" style="margin-bottom: 12px;">
                        <div slot="header" class="clearfix" style="vertical-align: middle">
                            <span>服务器信息</span>
                            <el-button
                                    type="text"
                                    icon="el-icon-delete"
                                    size="small"
                                    disabled
                                    v-on:click="delServer()"
                                    style="padding: 0; float: right; position: relative; top: 4px; margin: 0 12px; font-size: 14px;"></el-button>

                            <el-button
                                    type="text"
                                    icon="el-icon-edit"
                                    size="small"
                                    disabled
                                    v-on:click="onEditServer()"
                                    style="padding: 0; float: right; position: relative; top: 4px; margin: 0 12px; font-size: 14px;"></el-button>
                        </div>

                        <el-row :gutter="32" class="dashboard">

                            <el-col :span="4" :xl="4" :lg="6" :sm="12" :xs="24">
                                <table class="cu-server-info">
                                    <tr>
                                        <td>名称:</td>
                                        <td>[#server-name 1]</td>
                                    </tr>
                                    <tr>
                                        <td>IP地址:</td>
                                        <td>117.38.148.121</td>
                                    </tr>
                                    <tr>
                                        <td>端口:</td>
                                        <td>6800</td>
                                    </tr>
                                    <tr>
                                        <td>登录名:</td>
                                        <td>root</td>
                                    </tr>
                                    <tr>
                                        <td>密码:</td>
                                        <td>GMZCKRMDE</td>
                                    </tr>
                                </table>
                            </el-col>

                            <el-col :span="6" :xl="6" :lg="6" :sm="12" :xs="24">
                                <div class="cpu-usage-holder">
                                    <span>CPU Usage</span>
                                    <div id="cpu_usage" ref="cpu_usage" style="width: 200px; height: 100px;"></div>
                                </div>
                            </el-col>

                            <el-col :span="6" :xl="6" :lg="6" :sm="12" :xs="24">
                                <table style="display: inline-block;">
                                <tr>
                                    <td>
                                        <div class="memory-usage-holder">
                                            <span>Memory:6.9/7.9GB (86%)</span><br>
                                            <div id="memory_usage" ref="memory_usage"
                                                 style="width: 160px; height: 20px;"></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="storage-holder">
                                            <span>Disk Space:11.7/99GB (11.8%)</span><br>
                                            <div id="storage_usage" ref="storage_usage"
                                                 style="width: 160px; height: 20px;"></div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            </el-col>

                            <el-col :span="6" :xl="6" :lg="6" :sm="12" :xs="24">
                                <table class="service-status">
                                <tr>
                                    <td style="display: flex; flex: 1;">proxy_pool 状态:</td>
                                    <td>
                                        <i class="el-icon-circle-check" style="color: #67C23A;"></i>
                                        <!--<el-button type="text" size="mini" style="padding: 0;">启动</el-button>-->
                                    </td>
                                </tr>
                                <tr>
                                    <td>RabbitMQ 状态:</td>
                                    <td><i class="el-icon-circle-check" style="color: #67C23A;"></i></td>
                                </tr>
                                <tr>
                                    <td>MySQL 状态:</td>
                                    <td><i class="el-icon-circle-check" style="color: #67C23A;"></i></td>
                                </tr>
                                <!--<tr>-->
                                    <!--<td>Python 版本(3.7):</td>-->
                                    <!--<td><i class="el-icon-circle-check" style="color: #67C23A;"></i></td>-->
                                <!--</tr>-->
                                <!--<tr>-->
                                    <!--<td>Scrapyd 版本(1.2):</td>-->
                                    <!--<td><i class="el-icon-circle-check" style="color: #67C23A;"></i></td>-->
                                <!--</tr>-->
                                <!--<tr>-->
                                    <!--<td>Celery 版本(4.2.1):</td>-->
                                    <!--<td><i class="el-icon-circle-check" style="color: #67C23A;"></i></td>-->
                                <!--</tr>-->
                            </table>
                            </el-col>
                        </el-row>
                    </el-card>

                    <el-card shadow="never">
                        <div slot="header" class="clearfix" style="vertical-align: middle">
                            <span>已部署项目</span>
                            <el-button
                                    type="text"
                                    size="small"
                                    disabled
                                    v-on:click="checkAllProj()"
                                    style="padding: 0; float: right; position: relative; top: 4px; margin: 0 12px; font-size: 14px;">
                                查看所有项目
                            </el-button>
                        </div>

                        <el-row :gutter="20" class="deployed-proj">
                            <el-col :span="6" :xl="6" :lg="6" :sm="12" :xs="24">
                                <el-card :body-style="{padding:'0px'}" shadow="hover">
                                    <div style="position: relative;">
                                        <img src="./image/news_sina.svg" alt="sina news logo" class="cu-project-cover">
                                        <el-button circle size="mini" icon="el-icon-caret-right"
                                                   v-on:click="deploy('sina_news')"
                                                   style="color: #0694d6; font-size: 16px; padding: 4px; position: absolute; bottom: 10px; right: 10px;">
                                        </el-button>
                                    </div>
                                    <div style="border-top: 1px solid #ebebeb; padding: 14px; border-bottom: 1px solid #ebebeb;">
                                        <span class="cu-one-line">新浪教育新闻爬取项目(https://edu.sina.cn/)</span>
                                        <small class="cu-one-line">运行频次: 2h</small>
                                    </div>
                                    <div style="padding: 0 14px; float: right;">
                                        <el-button type="text" size="mini">配置</el-button>
                                        <el-button type="text" size="mini">查看项目</el-button>
                                    </div>
                                </el-card>
                            </el-col>

                            <!--<el-col :span="6" :xl="6" :lg="6" :sm="12" :xs="12">-->
                                <!--<el-card :body-style="{padding:'0px'}" shadow="hover">-->
                                    <!--<div style="position: relative;">-->
                                        <!--<img src="./image/douban.svg" alt="sina news logo" class="cu-project-cover">-->
                                        <!--<el-button circle size="mini" icon="el-icon-caret-right"-->
                                                   <!--v-on:click="deploy('douban')"-->
                                                   <!--disabled-->
                                                   <!--style="color: #0694d6; font-size: 16px; padding: 4px; position: absolute; bottom: 10px; right: 10px;">-->
                                        <!--</el-button>-->
                                    <!--</div>-->
                                    <!--<div style="border-top: 1px solid #ebebeb; padding: 14px; border-bottom: 1px solid #ebebeb;">-->
                                        <!--<span class="cu-one-line">豆瓣小组爬取项目(https://www.douban.com/group/search?cat=1019&q=教育)</span>-->
                                        <!--<small class="cu-one-line">运行频次: 20m</small>-->
                                    <!--</div>-->
                                    <!--<div style="padding: 0 14px; float: right;">-->
                                        <!--<el-button type="text" size="mini">配置</el-button>-->
                                        <!--<el-button type="text" size="mini">查看项目</el-button>-->
                                    <!--</div>-->
                                <!--</el-card>-->
                            <!--</el-col>-->

                            <!--<el-col :span="6" :xl="6" :lg="6" :sm="12" :xs="12">-->
                                <!--<el-card :body-style="{padding:'0px'}" shadow="hover">-->
                                    <!--<div style="position: relative;">-->
                                        <!--<img src="./image/news.svg" alt="news logo" class="cu-project-cover">-->
                                        <!--<el-button circle size="mini" icon="el-icon-caret-right"-->
                                                   <!--v-on:click="deploy('news')"-->
                                                   <!--disabled-->
                                                   <!--style="color: #0694d6; font-size: 16px; padding: 4px; position: absolute; bottom: 10px; right: 10px;">-->
                                        <!--</el-button>-->
                                    <!--</div>-->
                                    <!--<div style="border-top: 1px solid #ebebeb; padding: 14px; border-bottom: 1px solid #ebebeb;">-->
                                        <!--<span class="cu-one-line">新闻网站爬取项目(https://www.thepaper.cn/)</span>-->
                                        <!--<small class="cu-one-line">运行频次: 3h</small>-->
                                    <!--</div>-->
                                    <!--<div style="padding: 0 14px; float: right;">-->
                                        <!--<el-button type="text" size="mini">配置</el-button>-->
                                        <!--<el-button type="text" size="mini">查看项目</el-button>-->
                                    <!--</div>-->
                                <!--</el-card>-->
                            <!--</el-col>-->

                            <!--<el-col :span="6" :xl="6" :lg="6" :sm="12" :xs="12">-->
                                <!--<el-card :body-style="{padding:'0px'}" shadow="hover">-->
                                    <!--<div style="position: relative;">-->
                                        <!--<img src="./image/news_netease.png" alt="net news logo" class="cu-project-cover">-->
                                        <!--<el-button circle size="mini" icon="el-icon-caret-right"-->
                                                   <!--v-on:click="deploy('netease')"-->
                                                   <!--disabled-->
                                                   <!--style="color: #0694d6; font-size: 16px; padding: 4px; position: absolute; bottom: 10px; right: 10px;">-->
                                        <!--</el-button>-->
                                    <!--</div>-->
                                    <!--<div style="border-top: 1px solid #ebebeb; padding: 14px; border-bottom: 1px solid #ebebeb;">-->
                                        <!--<span class="cu-one-line">网易新闻网站爬取项目(https://3g.163.com/touch/edu)</span>-->
                                        <!--<small class="cu-one-line">运行频次: 3h</small>-->
                                    <!--</div>-->
                                    <!--<div style="padding: 0 14px; float: right;">-->
                                        <!--<el-button type="text" size="mini">配置</el-button>-->
                                        <!--<el-button type="text" size="mini">查看项目</el-button>-->
                                    <!--</div>-->
                                <!--</el-card>-->
                            <!--</el-col>-->

                            <!--<el-col :span="6" :xl="6" :lg="6" :sm="12" :xs="12">-->
                                <!--<el-card :body-style="{padding:'0px'}" shadow="hover">-->
                                    <!--<div style="position: relative;">-->
                                        <!--<img src="./image/news_qq.png" alt="qq news logo" class="cu-project-cover">-->
                                        <!--<el-button circle size="mini" icon="el-icon-caret-right"-->
                                                   <!--v-on:click="deploy('qq')"-->
                                                   <!--disabled-->
                                                   <!--style="color: #0694d6; font-size: 16px; padding: 4px; position: absolute; bottom: 10px; right: 10px;">-->
                                        <!--</el-button>-->
                                    <!--</div>-->
                                    <!--<div style="border-top: 1px solid #ebebeb; padding: 14px; border-bottom: 1px solid #ebebeb;">-->
                                        <!--<span class="cu-one-line">腾讯新闻网站爬取项目(https://xw.qq.com/m/edu)</span>-->
                                        <!--<small class="cu-one-line">运行频次: 3h</small>-->
                                    <!--</div>-->
                                    <!--<div style="padding: 0 14px; float: right;">-->
                                        <!--<el-button type="text" size="mini">配置</el-button>-->
                                        <!--<el-button type="text" size="mini">查看项目</el-button>-->
                                    <!--</div>-->
                                <!--</el-card>-->
                            <!--</el-col>-->
                        </el-row>
                    </el-card>
                </div>
            </el-col>
        </el-row>

        <el-dialog
                title="添加服务器"
                :visible.sync="addOrEditServerDialogVisible"
                width="35%">

            <el-form
                    ref="form"
                    v-model="newServerData"
                    label-width="100px">
                <el-input v-model="newServerData.id" type="hidden"/>
                <el-form-item label="名称">
                    <el-input v-model="newServerData.name" size="small"/>
                </el-form-item>
                <el-form-item label="ip">
                    <el-input v-model="newServerData.ip" size="small"/>
                </el-form-item>
                <el-form-item label="port">
                    <el-input v-model="newServerData.scrapyd_port" size="small"/>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="newServerData.desc" size="small" type="textarea"/>
                </el-form-item>

                <el-form-item label="配置SSH">
                    <el-switch
                            active-color="#409EFF"
                            inactive-color="#C0C4CC"
                            v-model="newServerData.ssh">
                    </el-switch>
                </el-form-item>

                <div v-if="newServerData.ssh"
                     class="custom-ssh-setting">
                    <el-form-item label="用户名">
                        <el-input v-model="newServerData.username"
                                  size="small">
                        </el-input>
                        <!--<small style="font-size: 12px; color: #909399;">{{schedulerData.jobId}}</small>-->
                    </el-form-item>

                    <el-form-item label="密码">
                        <el-input type="password" autocomplete="off" v-model="newServerData.password" size="small"/>
                    </el-form-item>

                    <el-form-item>
                        <el-button size="mini" type="primary" class="cu-button-icon" v-on:click="testSSHConnection()">
                            <i v-if="newServerData.ssh_connection" class="el-icon-success"
                               style="color: #ecf0f1;"></i>
                            测试SSH连接
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <span v-if="testConnectionFailed"
                      style="color: #F56C6C; font-size: 12px; margin-right: 20px">
                    SSH连接失败!
                </span>

                <el-button
                        v-if="addOrEdit === 'add'"
                        type="primary"
                        v-on:click="doAddServer()"
                        size="small">添加</el-button>
                <el-button
                        v-else-if="addOrEdit === 'edit'"
                        type="primary"
                        v-on:click="doEditServer()"
                        size="small">确认修改</el-button>
            </span>
        </el-dialog>

        <el-dialog
                :visible.sync="selectServerDialogVisible"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false"
                width="35%">

            <img src="./image/server.svg"
                 alt="add or edit server"
                 style="width: 130px; position: absolute; left: 36px; top: 18px; transform: rotate(15deg);">

            <el-tooltip content="选定当前需要管理/监控的服务器" placement="bottom">
                <i class="el-icon-question"
                   style="color: rgb(100, 100, 100); position: absolute; top: 105px; left: 22px;"></i>
            </el-tooltip>

            <el-select class="cu-input-10transparent"
                       v-model="selectedServer"
                       filterable
                       :filter-method="filterSelectServer"
                       style="width: 100%"
                       @change="handleSelectServer"
                       placeholder="请先选择服务器" value="">
                <el-option
                        v-for="item in queryServerList"
                        :key="item.ip"
                        :label="item.name"
                        :value="item.ip + ':' + item.scrapyd_port">
                    <span style="float: left;">{{item.name}}</span>
                    <span style="float: right; color: #8492a6; font-size: 14px;">{{item.ip}}:{{item.scrapyd_port}}</span>
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer" style="padding-bottom: 40px!important;">
                <!--<el-button type="primary" size="mini" @click="selectServerDialogVisible = false">确定</el-button>-->
            </span>
        </el-dialog>

    </d2-container>
</template>

<script>
    import {ShowServer, AddServer, TestConnection, DelServer, EditServer} from '@/api/backend-api/servers';
    import Store from '../../store';
    import axios from 'axios';

    export default {
        name: 'server-overview',

        methods: {
            fetchServerCPUData() {
                let cpuUsage = this.$echarts.init(document.getElementById('cpu_usage'));
                cpuUsage.setOption({
                    xAxis: {
                        show: false,
                        type: 'category'
                    },
                    yAxis: {
                        show: false,
                        splitLine: {show: false},
                        type: 'value',
                    },
                    series: [{
                        symbol: "none",
                        data: this.cpuChartData,
                        type: 'line',
                        smooth: true,
                    }],
                    color: ['#2f4554'],
                    grid: {
                        top: 30,
                        bottom: 10,
                    }
                });

                cpuUsage.resize()
            },

            fetchMemoryData() {
                let memoryUsage = this.$echarts.init(document.getElementById('memory_usage'));

                memoryUsage.setOption({
                    grid: {
                        left: 0,
                        right: 15,
                    },
                    xAxis: {
                        show: false,
                        type: 'value'
                    },
                    yAxis: {
                        show: false,
                        type: 'category',
                    },
                    series: [
                        {
                            name: 'used',
                            type: 'bar',
                            stack: '总量',
                            data: [6.7]
                        },
                        {
                            name: 'free',
                            type: 'bar',
                            stack: '总量',
                            data: [1.1]
                        },
                    ],
                    color: ['#e6a23a', '#9b9b9b']
                });
            },

            fetchStorageData() {
                let storageUsage = this.$echarts.init(document.getElementById('storage_usage'));

                storageUsage.setOption({
                    grid: {
                        left: 0,
                        right: 15
                    },
                    xAxis: {
                        show: false,
                        type: 'value'
                    },
                    yAxis: {
                        show: false,
                        type: 'category',
                    },
                    series: [
                        {
                            name: 'used',
                            type: 'bar',
                            stack: '总量',
                            data: [11.7]
                        },
                        {
                            name: 'free',
                            type: 'bar',
                            stack: '总量',
                            data: [88.2]
                        },
                    ],

                    color: ['#0694d6', '#9b9b9b']
                });
            },

            filterSelectServer(query) {

                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.queryServerList = this.serverList.filter(item => {
                        return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                            item.ip.indexOf(query) > -1 ||
                            (item.scrapyd_port + '').indexOf(query) > -1;
                    });

                }, 200);

            },

            handleSelectServer(command) {
                this.talog('server', 'select server:' + command);
                Store.setServer(command);
                this.$message({message: '服务器已选定', type: 'success'});
                this.selectServerDialogVisible = false;
            },

            openAddServer() {
                this.addOrEditServerDialogVisible = true;
                this.addOrEdit = 'add';

                this.newServerData.id = this.defaultServerData.id;
                this.newServerData.name = this.defaultServerData.name;
                this.newServerData.ip = this.defaultServerData.ip;
                this.newServerData.scrapyd_port = this.defaultServerData.scrapyd_port;
                this.newServerData.desc = this.defaultServerData.desc;
                this.newServerData.username = this.defaultServerData.username;
                this.newServerData.password = this.defaultServerData.password;
            },

            onEditServer(row) {
                this.talog('server', 'open edit server dialog.');
                console.log(row);
                this.newServerData.id = row.id;
                this.newServerData.name = row.name;
                this.newServerData.ip = row.ip;
                this.newServerData.scrapyd_port = row.scrapyd_port;
                this.newServerData.desc = row.desc;
                this.newServerData.username = row.username;
                this.newServerData.password = row.password;

                this.addOrEdit = 'edit';
                this.addOrEditServerDialogVisible = true;
            },

            fetchServerList() {
                // ShowServer().then(res => {
                //     this.serverList = [];
                //     for (let i in res.list) {
                //         this.serverList.push({
                //             id: res.list[i].pk,
                //             name: res.list[i].fields.name,
                //             ip: res.list[i].fields.ip,
                //             port: res.list[i].fields.port,
                //             desc: res.list[i].fields.desc
                //         })
                //     }
                // })
                // this.$message({message:''})
                let that = this;
                axios.get('/api/server/list').then(function (r) {
                    if (r.data.code === 0) {
                        that.serverList = r.data.servers;
                        that.filterSelectServer('');
                    }
                }).catch(err => {
                    console.log('err %o', err)
                })
            },

            testSSHConnection() {
                let that = this;
                that.newServerData.ssh_connection = false;

                // let params = new URLSearchParams();
                // params.append('username', that.newServerData.username);
                // params.append('password', that.newServerData.password);
                if (that.newServerData.username === '' || that.newServerData.password === '') {
                    that.$message({message: '用户名/密码不能为空', type: 'error'});
                    return;
                }

                axios.post('/api/server/ssh_check', {
                    username: that.newServerData.username,
                    password: that.newServerData.password
                }).then(r => {
                    if (r.data.code === 0) {
                        that.newServerData.ssh_connection = r.data.ssh_connection;
                        if (r.data.ssh_connection) {
                            that.$message({message: '测试通过，服务器可连接', type: 'success'});
                        } else {
                            that.$message({message: '暂时无法连接服务器', type: 'error'});
                        }
                    } else if (r.data.code === 300) {
                        that.$message({message: '用户名/密码不能为空', type: 'error'});
                    }
                }).catch(err => {
                    console.error('err: %o', err);
                });
            },

            doAddServer() {
                this.testConnectionFailed = false;

                let that = this;
                if (that.newServerData.ip === '' || that.newServerData.scrapyd_port === '') {
                    that.$message({message: '服务器ip/port不能为空', type: 'error'});
                    return;
                }

                axios.post('/api/server/add', that.newServerData).then(r => {
                    if (r.data.code === 0) {
                        that.$message({message: '服务器已添加', type: 'success'});
                        that.addOrEditServerDialogVisible = false;
                        that.newServerData.id = r.data.server_id;
                        that.fetchServerList();
                    } else {
                        that.$message({message: '服务器添加失败', type: 'error'});
                    }
                });

                // test connection
                // TestConnection({
                //     host: this.newServerData.ip,
                //     port: this.newServerData.port
                // }).then(res => {
                //     if (res.msg === 'success' && res.connect_status === 0) {
                //         AddServer(this.newServerData).then(res => {
                //             if (res.msg === 'success') {
                //                 this.addOrEditServerDialogVisible = false;
                //                 this.$message({message: '服务器已添加', type: 'success'});
                //                 this.fetchServerList();
                //             }
                //         })
                //     } else {
                //         this.testConnectionFailed = true;
                //     }
                // })

                // prototype
                // if (this.newServerData.name === '') {
                //     setTimeout(() => {
                //         this.testConnectionFailed = true;
                //     }, 1000);
                // } else {
                //     this.$message({message: '服务器已添加', type: 'success'});
                //     this.addOrEditServerDialogVisible = false;
                // }
            },

            doEditServer() {
                this.testConnectionFailed = false;

                let that = this;
                if (that.newServerData.ip === '' || that.newServerData.scrapyd_port === '') {
                    that.$message({message: '服务器ip/port不能为空', type: 'error'});
                    return;
                }

                axios.post('/api/server/edit', that.newServerData).then(r => {
                    if (r.data.code === 0) {
                        that.$message({message: '服务器已修改', type: 'success'});
                        that.addOrEditServerDialogVisible = false;
                        that.fetchServerList();
                    } else {
                        that.$message({message: '服务器修改失败', type: 'error'});
                    }
                });

                // EditServer(this.newServerData).then(res => {
                //     if (res.msg === 'success') {
                //         this.$message({message: '修改完成', type: 'success'});
                //         this.addOrEditServerDialogVisible = false;
                //         this.fetchServerList();
                //     } else {
                //         this.$message({message: res.msg, type: 'error'});
                //     }
                // })
            },

            delServer(index, row) {

                console.log(index, row);

                this.$confirm(`是否删除服务器 ${row.name}?`, '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'info',
                }).then(() => {
                    axios.post('/api/server/del', {
                        'id': row.id
                    }).then(res => {
                        if (res.data.code === 0) {
                            this.$message({message: '服务器已删除', type: 'success'});
                            this.fetchServerList();
                        }
                    });
                });

                // DelServer({
                //     id: row.id
                // }).then(res => {
                //     if (res.msg === 'success') {
                //         this.$message({message: row.name + ' 已被删除', type: 'success'});
                //         this.fetchServerList();
                //     } else {
                //         this.$message({message: res.msg, type: 'error'});
                //     }
                // })

                // prototype
                // this.$confirm(`是否删除服务器【${row.ip}:${row.port}】?`, '提示', {
                //     confirmButtonText: '删除',
                //     cancelButtonText: '取消',
                //     type: 'info',
                // }).then(() => {
                //     this.$message({message: '服务器已删除', type: 'success'});
                // }).catch(err => {
                //     this.$message('取消删除');
                // });

            },

            selectServer(row) {
                this.$confirm(`是否选定服务器【${row.ip}:${row.scrapyd_port}】?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info',
                }).then(() => {
                    // save selected server ip and port.
                    this.selectedServer = row.ip + ':' + row.scrapyd_port;
                    Store.setServer(this.selectedServer);
                    this.$message({message: '服务器已选定', type: 'success'});
                });
            }
        },

        data() {
            return {
                cpuChartData: [12, 10, 11, 10, 14, 12, 14, 15, 16, 24, 20, 18, 26, 28, 40, 21, 19, 10],

                addOrEdit: 'add',
                selectedServer: Store.getServer(),
                testConnectionFailed: false,
                addOrEditServerDialogVisible: false,
                selectServerDialogVisible: false,
                loading: true,
                newServerData: {},
                defaultServerData: {
                    id: undefined,
                    name: '',
                    ip: '',
                    scrapyd_port: 6800,
                    desc: '',
                    ssh: false,
                    username: '',
                    password: '',
                    ssh_connection: undefined
                },
                queryServerList: [],
                serverList: [],
            }
        },

        mounted() {
            this.fetchServerList();

            this.fetchServerCPUData();
            this.fetchMemoryData();
            this.fetchStorageData();

            if (this.selectedServer === '') {
                this.selectServerDialogVisible = true;
            }
        }
    }
</script>

<style lang="scss">
    @import '~@/assets/style/public.scss';

    .el-form-item {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }

        .el-form-item__content span {
            margin-left: 10px;
            font-size: 12px;
        }
    }

    div.el-input--suffix {
        background-color: transparent !important;
    }

    div.el-input--suffix input.el-input__inner {
        background-color: rgba(255, 255, 255, .9) !important;
    }

    .custom-ssh-setting {
        border: 1px dashed $color-border-1;
        border-radius: 3px;
        padding: 10px;
    }

    .cu-button-icon span {
        margin-left: 0 !important;
    }

    .el-dial.el-dialog__body {
        padding: 10px 20px !important;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .cu-aside {
        margin-bottom: 24px;

        .el-input {
            width: 160px;
            display: inline-block;
            margin-right: 6px;
            .el-input__inner {
                border-radius: 15px;
            }
        }

        button {
            position: relative;
            top: 2px;
        }
    }

    .cu-server-list .el-card__body {
        padding: 0;
        ul {
            padding: 0;
            margin: 0;
            li {
                border-bottom: 1px solid #dcdcdc;
                &:last-child {
                    border-bottom: 0;
                }

                p {
                    margin: 8px 12px 2px 12px;
                }

                span {
                    display: inline-block;
                    font-size: 12px;
                    margin: 2px 12px 8px 12px;
                    color: #9b9b9b;
                }
            }
        }
    }

    .cu-main-content {
        table.cu-server-info {
            width: 100%;
            font-size: 12px;
            /*padding-right: 24px;*/
            /*border-right: 1px solid #ebebeb;*/
            display: inline-block;
            /*margin-right: 20px;*/
            margin-bottom: 12px;

            tr td:first-child {
                min-width: 65px;
            }
        }
    }

    .dashboard {
        .el-col {
            padding-bottom: 12px;
            min-height: 130px;
        }
    }

    table.service-status {
        width: 100%;
        display: inline-block;
        font-size: 12px;
        vertical-align: top;

        tr td:first-child {
            min-width: 120px;
        }
        tr td:last-child {
            position: relative;
            top: 1px;
        }
    }

    .cpu-usage-holder,
    .memory-usage-holder,
    .storage-holder {
        display: inline-block;
        position: relative;
        span {
            position: absolute;
            left: 2px;
            font-size: 12px;
            color: #606266;
        }
        #cpu_usage,
        #memory_usage,
        #storage_usage {
            display: inline-block;
            div {
                display: inline-block;
            }
        }
    }

    .memory-usage-holder,
    .storage-holder {
        span {
            position: relative;
            display: inline-block;
            padding-bottom: 4px;
        }
    }

    .deployed-proj {
        .el-card {
            margin-top: 20px;
        }

        .cu-project-cover {
            display: block;
            margin: 0 auto;
            padding: 10px;
            height: 80px;
        }

        .cu-one-line {
            font-size: 12px;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
    }
</style>