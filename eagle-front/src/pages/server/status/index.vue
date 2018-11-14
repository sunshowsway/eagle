<template>
    <d2-container class="page">

        <h2>服务器状态</h2>

        <div style="display: block; font-size: 12px; margin: 15px 0;">
            <span v-if="daemonstatus.selectedServer">
                <span><em>当前选定的服务器: {{daemonstatus.selectedServer}}</em></span>
                <span v-on:click="serverStatus"
                      style="color: #409EFF; cursor:pointer; margin-left: 20px;">Refresh</span>
            </span>

            <el-dropdown
                    @command="handleSelect"
                    style="float: right; top: 4px;">
                <span class="el-dropdown-link">
                    {{daemonstatus.selectedServer ? daemonstatus.selectedServer : '请选择服务器'}}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                            v-for="server in serverList"
                            :command="server.ip +':' + server.port">
                        {{server.ip}}:{{server.port}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <!--<div class="custom_helper_info" v-if="helperInfoVisible">-->
        <!--<p>-->
        <!--to check the load status of a service-->
        <!--</p>-->
        <!--<el-button icon="el-icon-close" circle size="mini" v-on:click="CloseHelperInfo"/>-->
        <!--</div>-->

        <div class="custom_status_block" v-if="daemonstatus.selectedServer">
            <div class="custom-badge">
                <span class="running">Running</span>
                <span>{{daemonstatus.running}}</span>
            </div>

            <div class="custom-badge">
                <span class="pending">Pending</span>
                <span>{{daemonstatus.pending}}</span>
            </div>

            <div class="custom-badge">
                <span class="finished">finished</span>
                <span>{{daemonstatus.finished}}</span>
            </div>
        </div>

    </d2-container>
</template>

<script>
    import {DaemonStatus} from '@/api/scrapyd-api/v1_2_0';
    import {ShowServer} from '@/api/backend-api/servers';
    import Store from '../../store';

    export default {
        methods: {
            handleSelect(command) {
                this.daemonstatus.selectedServer = command;
                Store.setServer(command);

                this.serverStatus();
            },

            // CloseHelperInfo() {
            //     this.helperInfoVisible = !this.helperInfoVisible;
            // },

            serverStatus() {
                if (this.daemonstatus.selectedServer === '') {
                    this.$message({message: '先选择服务器', type: 'error'});
                    return;
                }
                DaemonStatus({
                    server: this.daemonstatus.selectedServer
                }).then(res => {
                    this.daemonstatus.status = res.status;
                    this.daemonstatus.running = res.running;
                    this.daemonstatus.pending = res.pending;
                    this.daemonstatus.finished = res.finished;

                    this.$message({message: '服务器状态已刷新', type: 'success'});
                }).catch(err => {
                    this.$message({message: err, type: 'error'});
                })
            },

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
        },

        data() {
            return {
                serverList: [],
                // helperInfoVisible: false,
                daemonstatus: {
                    selectedServer: Store.getServer(),
                    running: '',
                    pending: '',
                    finished: '',
                    status: ''
                }
            }
        },

        mounted() {
            this.serverStatus();
            this.fetchServerList();
        }
    }
</script>

<style lang="scss" scoped>
    @import '~@/assets/style/public.scss';

    .custom_status_block {
        background-color: $color-bg;
        padding: 5px 10px;
        margin: 15px 0;
        border: 1px solid $color-border-1;
        border-radius: 5px;
    }

    .custom_helper_info {
        background-color: $color-bg;
        padding: 5px 10px;
        margin: 15px 0;
        border: 1px solid $color-border-1;
        border-radius: 5px;
        position: relative;
        p {
            padding-left: 15px;
            font-size: 14px;
            color: $color-text-normal;
            display: inline-block;
        }
        .el-button {
            position: absolute;
            top: 0;
            right: 0;
            margin: 10px 10px 0 0;
        }
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .custom-badge {
        padding: 10px;

        .running {
            color: $color-success;
        }
        .pending {
            color: $color-warning;
        }
        .finished {
            color: $color-primary;
        }
        span {
            display: inline-block;
            padding: 10px 0;

            &:first-child {
                border-right: 1px solid $color-border-1;
                font-weight: bolder;
                padding-right: 20px;
            }
            &:last-child {
                margin-left: 20px;
            }
        }

        .el-dropdown-link {
            cursor: pointer;
            color: $color-primary;
        }

        .el-icon-arrow-down {
            font-size: 12px;
        }
    }
</style>
