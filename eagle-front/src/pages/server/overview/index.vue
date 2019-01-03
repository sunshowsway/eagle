<template>
    <d2-container>
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="grid-content cu-aside">
                    <el-input size="mini" placeholder="请输入服务器名称" clearable disabled></el-input>
                    <el-button type="text" icon="el-icon-search" disabled></el-button>
                    <el-button type="text" icon="el-icon-plus" class="pull-right"
                               style="margin-right: 12px;"></el-button>

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

            <el-col :span="18">
                <div class="grid-content bg-purple-light cu-main-content">
                    <el-card shadow="never">
                        <div slot="header" class="clearfix">
                            <span>服务器信息</span>
                        </div>

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

                        <div id="cpu_usage" ref="cpu_usage"></div>
                        <!--<ve-line-->
                                <!--style="width: 200px;"-->
                                <!--:data="cpuChartData"-->
                                <!--:tooltip-visible="false"-->
                                <!--:legend-visible="false"-->
                                <!--height="200px"-->
                                <!--:colors="['#2f4554']"-->
                                <!--:xAxis="xAxis"-->
                                <!--:yAxis="yAxis"-->
                                <!--:grid="{bottom:0, top:20}">-->
                        <!--</ve-line>-->
                    </el-card>
                </div>
            </el-col>

            <el-col :span="24">
                <div class="grid-content bg-purple-light">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>服务器列表</span><br>
                            <span style="font-size: 12px;"><em>当前选定的服务器: {{selectedServer?selectedServer:'未指定'}}</em></span>
                            <el-button style="float: right;"
                                       icon="el-icon-plus"
                                       round size="mini"
                                       v-on:click="openAddServer()"
                                       type="primary">
                                添加服务器
                            </el-button>
                        </div>

                        <el-table
                                :data="serverList"
                                :loading="loading"
                                style="width: 100%"
                                height="300">

                            <el-table-column
                                    prop="id"
                                    width="50"
                                    label="#">
                            </el-table-column>

                            <el-table-column
                                    prop="name"
                                    label="名称">
                            </el-table-column>

                            <el-table-column
                                    prop="ip"
                                    label="IP地址">
                            </el-table-column>

                            <el-table-column
                                    prop="scrapyd_port"
                                    label="端口">
                            </el-table-column>

                            <el-table-column prop="username" label="登录名">
                            </el-table-column>

                            <el-table-column prop="password" label="密码">
                            </el-table-column>

                            <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="200">
                                <template slot-scope="scope">
                                    <!--<el-button v-on:click="ssh(scope.row)"-->
                                    <!--type="text"-->
                                    <!--size="small">-->
                                    <!--SSH-->
                                    <!--</el-button>-->

                                    <el-button v-on:click="delServer(scope.$index, scope.row)"
                                               type="text"
                                               icon="el-icon-delete"
                                               size="small">
                                        删除
                                    </el-button>
                                    <el-button
                                            v-on:click="onEditServer(scope.row)"
                                            type="text"
                                            icon="el-icon-edit"
                                            size="small">
                                        编辑
                                    </el-button>
                                    <el-button
                                            v-on:click="selectServer(scope.row)"
                                            type="text"
                                            size="small">
                                        选定
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
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
                for (let i in [1, 2, 3, 4, 5, 6, 7, 8]) {
                    this.cpuChartData[i - 1] = Math.random() * 30 + 10;
                }

                let cpuUsage = this.$echarts.init(document.getElementById('cpu_usage'));
                cpuUsage.setOption({
                    xAxis: {
                        show: false
                    },
                    yAxis: {
                        show: false
                    },
                    series: [{
                        data: this.cpuChartData,
                        type: 'line',
                        smooth: true,
                    }]
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
                cpuChartData: [],

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

    .cu-aside .el-input {
        width: 160px;
        display: inline-block;
        margin-right: 6px;
    }

    .cu-aside .el-input .el-input__inner {
        border-radius: 15px;
    }

    .cu-aside button {
        position: relative;
        top: 2px;
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
                    font-weight: bolder;
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
            font-size: 12px;
            padding-right: 24px;
            border-right: 1px solid #ebebeb;

            tr td:first-child {
                min-width: 65px;
            }
        }
    }
</style>