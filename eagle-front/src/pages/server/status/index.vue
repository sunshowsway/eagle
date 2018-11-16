<template>
    <d2-container class="page">

        <h2>服务器状态</h2>

        <div style="display: block; font-size: 12px; margin: 15px 0 25px 0;">
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

        <el-row :gutter="20">
            <el-col :span="4">
                <el-card class="box-card" v-if="daemonstatus.selectedServer">
                    <div class="custom-badge">
                        <span class="running">Running</span>
                        <span>{{daemonstatus.running}}</span>
                    </div>
                </el-card>

                <el-card class="box-card" v-if="daemonstatus.selectedServer">
                    <div class="custom-badge">
                        <span class="pending">Pending</span>
                        <span>{{daemonstatus.pending}}</span>
                    </div>
                </el-card>

                <el-card class="box-card" v-if="daemonstatus.selectedServer">
                    <div class="custom-badge">
                        <span class="finished">finished</span>
                        <span>{{daemonstatus.finished}}</span>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="20">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>下载速度-kbps | 数据增量监控</span>
                        <el-dropdown
                                @command="handleSelectFrequency"
                                style="float: right; top: 4px;">
                            <span class="el-dropdown-link">
                                {{parseInt(selectedFrequency) !== -1 ? '每' + selectedFrequency + '秒刷新': '请选择刷新频率'}}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="-1">停止请求</el-dropdown-item>
                                <el-dropdown-item :command="2">每2秒刷新</el-dropdown-item>
                                <el-dropdown-item :command="5">每5秒刷新</el-dropdown-item>
                                <el-dropdown-item :command="10">每10秒刷新</el-dropdown-item>
                                <el-dropdown-item :command="20">每20秒刷新</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>

                    <ve-line v-if="daemonstatus.selectedServer"
                             :data="chartData"
                             :extend="extend"
                             :settings="chartSettings"
                             :grid="{bottom:0}">
                    </ve-line>

                    <span v-else
                          style="display: block; font-size: 12px; color: #909399; text-align: center; position:relative; top: 60px; height: 150px;">
                        请先选择服务器
                    </span>
                </el-card>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
    import {DaemonStatus} from '@/api/scrapyd-api/v1_2_0';
    import {ShowServer, GetDownloadSize} from '@/api/backend-api/servers';
    import Store from '../../store';

    function formatDate(now) {
        let month = now.getMonth() + 1;
        let date = now.getDate();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        return month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }

    export default {
        methods: {
            handleSelect(command) {
                this.daemonstatus.selectedServer = command;
                Store.setServer(command);

                this.serverStatus();
            },

            handleSelectFrequency(command) {
                if (command === -1) {
                    clearInterval(this.interval);

                    // stop interval before change 'this.selectedFrequency'.
                    this.selectedFrequency = command;
                } else {
                    this.selectedFrequency = command;
                    this.interval = setInterval(() => {
                        this.startDrawLine();
                    }, parseInt(this.selectedFrequency) * 1000);
                }
            },

            startDrawLine() {
                GetDownloadSize({
                    ip: this.daemonstatus.selectedServer,
                    frequency: parseInt(this.selectedFrequency),
                }).then(res => {
                    if (res.msg === 'success') {
                        let len = this.chartData.rows.length;
                        if (len > this.charDataLimitLen) {
                            this.chartData.rows = this.chartData.rows.slice(1, len);
                        }

                        let current_size = len > 0 ? this.chartData.rows[len - 1]['下载量'] : 0;
                        this.chartData.rows.push({
                            '时间': formatDate(new Date(res.time * 1000)),
                            '下载速度': (res.size.size__sum) / (1024 * this.selectedFrequency),
                            '下载量': current_size + res.size.size__sum / (8 * 1024 * 1024)
                        })
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {

                })
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
            this.chartSettings = {
                axisSite: {right: ['下载量']},
                metrics: ['下载速度', '下载量'],
                dimension: ['时间'],
                yAxisName: ['kbps', 'MB']
            };
            this.extend = {
                'xAxis.0.axisLabel.rotate': 45,
                series(v) {
                    v.forEach(i => {
                        if (i.name === '下载量') {

                        }
                        console.log(i)
                    });
                    return v
                },
            };


            return {
                interval: undefined,
                selectedFrequency: '-1',
                serverList: [],
                // helperInfoVisible: false,
                daemonstatus: {
                    selectedServer: Store.getServer(),
                    running: '',
                    pending: '',
                    finished: '',
                    status: ''
                },

                chartData: {
                    columns: ['时间', '下载速度', '下载量'],
                    rows: []
                },

                charDataLimitLen: 50
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

    .box-card {
        margin-bottom: 20px;
    }

    .custom-badge {
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
