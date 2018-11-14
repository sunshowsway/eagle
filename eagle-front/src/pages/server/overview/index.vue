<template>
    <d2-container>
        <el-row :gutter="20">
            <el-col :span="24">
                <div class="grid-content bg-purple-light">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>服务器列表</span><br>
                            <span style="font-size: 12px;" v-bind="selectedServer"><em>当前选定的服务器: {{selectedServer?selectedServer:'未指定'}}</em></span>
                            <el-button style="float: right;"
                                       icon="el-icon-plus"
                                       round size="mini"
                                       v-on:click="dialogVisible = true; addOrEdit = 'add';"
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
                                    prop="name"
                                    label="名称">
                            </el-table-column>

                            <el-table-column
                                    prop="ip"
                                    label="IP地址">
                            </el-table-column>

                            <el-table-column
                                    prop="port"
                                    label="端口">
                            </el-table-column>

                            <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="200">
                                <template slot-scope="scope">
                                    <el-button v-on:click="detail(scope.row)"
                                               type="text"
                                               disabled
                                               size="small">
                                        查看
                                    </el-button>

                                    <el-button v-on:click="delServer(scope.row)"
                                               type="text"
                                               icon="el-icon-delete"
                                               size="small">
                                        删除
                                    </el-button>
                                    <el-button
                                            v-on:click="editServer(scope.row)"
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
                :visible.sync="dialogVisible"
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
                    <el-input v-model="newServerData.port" size="small"/>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="newServerData.desc" size="small" type="textarea"/>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <span v-if="testConnectionFailed"
                      style="color: #F56C6C; font-size: 12px; margin-right: 20px">
                    connection failed.
                </span>

                <el-button
                        v-if="addOrEdit === 'add'"
                        type="primary"
                        v-on:click="doConnect()"
                        size="small">Test Connection & Add</el-button>
                <el-button
                        v-else-if="addOrEdit === 'edit'"
                        type="primary"
                        v-on:click="doEditServer()"
                        size="small">确认修改</el-button>
            </span>
        </el-dialog>

    </d2-container>
</template>

<script>
    import {ShowServer, AddServer, TestConnection, DelServer, EditServer} from '@/api/backend-api/servers';
    import Store from '../../store'

    export default {
        name: 'serverOverview',

        methods: {
            fetchServerList() {
                ShowServer().then(res => {
                    this.serverList = [];
                    for (let i in res.list) {
                        this.serverList.push({
                            id: res.list[i].pk,
                            name: res.list[i].fields.name,
                            ip: res.list[i].fields.ip,
                            port: res.list[i].fields.port,
                            desc: res.list[i].fields.desc
                        })
                    }
                })
            },

            doConnect() {
                // test connection
                this.testConnectionFailed = false;
                TestConnection({
                    host: this.newServerData.ip,
                    port: this.newServerData.port
                }).then(res => {
                    if (res.msg === 'success' && res.connect_status === 0) {
                        AddServer(this.newServerData).then(res => {
                            if (res.msg === 'success') {
                                this.dialogVisible = false;
                                this.$message({message: '服务器已添加', type: 'success'});
                                this.fetchServerList();
                            }
                        })
                    } else {
                        this.testConnectionFailed = true;
                    }
                })
            },

            delServer(row) {
                DelServer({
                    id: row.id
                }).then(res => {
                    if (res.msg === 'success') {
                        this.$message({message: row.name + ' 已被删除', type: 'success'});
                        this.fetchServerList();
                    } else {
                        this.$message({message: res.msg, type: 'error'});
                    }
                })
            },

            editServer(row) {
                this.newServerData.id = row.id;
                this.newServerData.name = row.name;
                this.newServerData.ip = row.ip;
                this.newServerData.port = row.port;
                this.newServerData.desc = row.desc;

                this.addOrEdit = 'edit';
                this.dialogVisible = true;
            },

            doEditServer() {
                EditServer(this.newServerData).then(res => {
                    if (res.msg === 'success') {
                        this.$message({message: '修改完成', type: 'success'});
                        this.dialogVisible = false;
                        this.fetchServerList();
                    } else {
                        this.$message({message: res.msg, type: 'error'});
                    }
                })
            },

            selectServer(row) {
                this.$confirm(`是否选定服务器【${row.ip}:${row.port}】?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info',
                }).then(() => {
                    // save selected server ip and port.
                    this.selectedServer = row.ip + ':' + row.port;
                    Store.setServer(this.selectedServer);
                    this.$message({message: '服务器已选定', type: 'success'});
                }).catch(err => {
                    this.$message('服务器未选定 ' + err);
                });
            }
        },

        data() {
            return {
                addOrEdit: 'add',
                selectedServer: Store.getServer(),
                testConnectionFailed: false,
                dialogVisible: false,
                loading: true,
                newServerData: {
                    id: undefined,
                    name: '',
                    ip: '',
                    port: 6800,
                    desc: ''
                },
                serverList: [
                    // test data
                    // {
                    //     id: 2,
                    //     name: 'server_name#1',
                    //     ip: '192.168.10.103',
                    //     port: 6800,
                    //     desc: ''
                    // },
                    // {
                    //     id: 3,
                    //     name: 'server_name#2',
                    //     ip: '192.168.10.16',
                    //     port: 6800,
                    //     desc: ''
                    // }
                ],
            }
        },

        mounted() {
            this.fetchServerList();
        }
    }
</script>
