<template>
    <d2-container class="page">

        <h2>服务器爬虫项目状态</h2>

        <div style="display: block; font-size: 12px; margin: 15px 0 25px 0;">
            <span v-if="daemonstatus.selectedServer">
                <span><em>当前选定的服务器: {{daemonstatus.selectedServer}}</em></span>
                <span v-on:click="serverStatus"
                      style="color: #409EFF; cursor:pointer; margin-left: 20px;">Refresh</span>
            </span>

            <el-dropdown
                    @command="handleSelect"
                    style="float: right; top: 4px;">
                <!--todo 等待修复-->
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
            <el-col :span="5">
                <el-card class="box-card" v-if="daemonstatus.selectedServer">
                    <div class="custom-badge">
                        <span>status</span>
                        <span>{{daemonstatus.status}}</span>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="5">
                <el-card class="box-card" v-if="daemonstatus.selectedServer">
                    <div class="custom-badge">
                        <span class="running">Running</span>
                        <span>{{daemonstatus.running}}</span>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="5">
                <el-card class="box-card" v-if="daemonstatus.selectedServer">
                    <div class="custom-badge">
                        <span class="pending">Pending</span>
                        <span>{{daemonstatus.pending}}</span>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="5">
                <el-card class="box-card" v-if="daemonstatus.selectedServer">
                    <div class="custom-badge">
                        <span class="finished">finished</span>
                        <span>{{daemonstatus.finished}}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="24">
                <div class="custom-requirement-info">
                    <div class="requirement-header">
                        <span>服务器运行环境检查</span>
                        <el-button type="text" v-on:click="doTestRequirement()">运行检查</el-button>
                    </div>

                    <div class="requirement-body">
                        <p v-for="item in requirementTestList">
                            <i :class="item.result"></i>
                            {{item.content}}
                        </p>
                    </div>
                </div>
            </el-col>
        </el-row>

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

        <h2>服务器运行状态</h2>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card class="box-card" v-if="daemonstatus.selectedServer">
                    <div slot="header" class="clearfix">
                        <span>CPU</span>
                    </div>
                    <ve-line
                            :data="cpuChartData"
                            :tooltip-visible="false"
                            :legend-visible="false"
                            height="200px"
                            :colors="['#2f4554']"
                            :grid="{bottom:0,top:20}">
                    </ve-line>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card" v-if="daemonstatus.selectedServer">
                    <div slot="header" class="clearfix">
                        <span>网络</span>
                    </div>
                    <ve-line
                            :data="netChartData"
                            :tooltip-visible="false"
                            :legend-visible="false"
                            height="200px"
                            :colors="['#0694d6']"
                            :grid="{bottom:0, top:20}">
                    </ve-line>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card" v-if="daemonstatus.selectedServer">
                    <div slot="header" class="clearfix">
                        <span>内存</span>
                    </div>
                    <ve-line
                            :data="memoryChartData"
                            :tooltip-visible="false"
                            :legend-visible="false"
                            height="200px"
                            :colors="['#e6a23a']"
                            :grid="{bottom:0, top:20}">
                    </ve-line>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card" v-if="daemonstatus.selectedServer">
                    <div slot="header" class="clearfix">
                        <span>其他信息</span>
                    </div>

                    <p style="font-size: 12px; color: #909399;">磁盘总空间/可用空间: 113 871MB / 34 696MB</p>
                    <p style="font-size: 12px; color: #909399;">温度: CPU|52℃ &nbsp; ROM|34℃ &nbsp; HD|44℃</p>
                </el-card>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
    import {DaemonStatus} from '@/api/scrapyd-api/v1_2_0';
    import {ShowServer, GetDownloadSize} from '@/api/backend-api/servers';
    import Store from '../../store';
    import axios from 'axios';

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
            doTestRequirement() {

                // let PromiseTimeout = function (timeout, callback) {
                //     return new Promise(function (resolve) {
                //         console.log(resolve);
                //         setTimeout(() => {
                //             callback();
                //             resolve();
                //         }, timeout)
                //     })
                // };

                let that = this;
                let len = this.requirementTestList.length;
                let rqs = [];
                for (let i = 0; i < len; i++) {
                    this.requirementTestList[i].result = 'el-icon-loading';

                    (function (index) {
                        rqs.push(
                            axios.get('/api/runtime/check')
                                .then(function (r) {
                                    console.log('response %d %o', index, r);
                                    if (r.msg === 'ok') {
                                        that.requirementTestList[index].result = 'el-icon-success';
                                    } else {
                                        that.requirementTestList[index].result = 'el-icon-error';
                                    }
                                    return new Promise(function (resolve) {
                                        resolve();
                                    })
                                })
                        );
                    })(i);

                    // setTimeout(() => {
                    //     this.requirementTestList[i].result = 'el-icon-success';
                    // }, Math.random() * (1000 - 800 + 1) + 800)
                }
                console.log('finished!');

                axios.all(rqs).then(axios.spread(function () {
                    console.log('hahahahah!!');
                    that.$message('hahaha');
                }));
            },

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
                // GetDownloadSize({
                //     ip: this.daemonstatus.selectedServer,
                //     frequency: parseInt(this.selectedFrequency),
                // }).then(res => {
                //     if (res.msg === 'success') {
                //         let len = this.chartData.rows.length;
                //         if (len > this.charDataLimitLen) {
                //             this.chartData.rows = this.chartData.rows.slice(1, len);
                //         }
                //
                //         let current_size = len > 0 ? this.chartData.rows[len - 1]['下载量'] : 0;
                //         this.chartData.rows.push({
                //             '时间': formatDate(new Date(res.time * 1000)),
                //             '下载速度': (res.size.size__sum) / (1024 * this.selectedFrequency),
                //             '下载量': current_size + res.size.size__sum / (8 * 1024 * 1024)
                //         })
                //     }
                // }).catch(err => {
                //     console.log(err)
                // }).finally(() => {
                //
                // })

                // prototype todo change before release.

                let len = this.chartData.rows.length;
                if (len > this.charDataLimitLen) {
                    this.chartData.rows = this.chartData.rows.slice(1, len);
                }

                // Math.random() = [0, 1]
                // Math.random()*10 + 1 = [1, 10]
                // Math.random()*10000 + 1000 = [1000, 10000] : 1秒 ～ 10秒
                let time = (new Date()).getTime() + this.selectedFrequency * 1000;
                let download_rate = Math.random() * 100 + 10;
                let download_size = len > 0 ? this.chartData.rows[len - 1]['下载量'] : 0;

                this.chartData.rows.push({
                    '时间': formatDate(new Date(time)),
                    '下载速度': download_rate,
                    '下载量': download_size + (download_rate * this.selectedFrequency) / 1024
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
                // DaemonStatus({
                //     server: this.daemonstatus.selectedServer
                // }).then(res => {
                //     this.daemonstatus.status = res.status;
                //     this.daemonstatus.running = res.running;
                //     this.daemonstatus.pending = res.pending;
                //     this.daemonstatus.finished = res.finished;
                //
                //     this.$message({message: '服务器状态已刷新', type: 'success'});
                // }).catch(err => {
                //     this.$message({message: err, type: 'error'});
                // })

                // prototype todo change before release.
                this.$message({message: '服务器状态已刷新', type: 'success'});
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

                // prototype todo change before release.
                this.serverList.push({
                        id: 1,
                        name: 'server_name#1',
                        ip: '192.168.10.103',
                        port: 6800,
                        desc: ''
                    },
                    {
                        id: 2,
                        name: 'server_name#2',
                        ip: '192.168.10.16',
                        port: 6800,
                        desc: ''
                    })
            },

            fetchServerCPUData() {
                let now = (new Date()).getTime();
                for (let i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
                    this.cpuChartData.rows.push({
                        '时间': formatDate(new Date(now + i * 1000)),
                        '使用量': Math.random() * 30 + 10
                    })
                }
            },

            fetchNetworkData() {
                let now = (new Date()).getTime();
                for (let i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
                    this.netChartData.rows.push({
                        '时间': formatDate(new Date(now + i * 1000)),
                        '使用量': Math.random() * 30 + 20
                    })
                }
            },

            fetchMemoryData() {
                let now = (new Date()).getTime();
                for (let i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
                    this.memoryChartData.rows.push({
                        '时间': formatDate(new Date(now + i * 1000)),
                        '使用量': Math.random() * 10 + 55
                    })
                }
            }
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

                requirementTestList: [
                    {
                        content: 'python version gt 3.x',
                        result: 'el-icon-question',
                    },
                    {
                        content: 'mysql version gt 5.7.19',
                        result: 'el-icon-question',
                    },
                    {
                        content: 'Django version gt 1.11',
                        result: 'el-icon-question',
                    },
                    {
                        content: 'node.js version gt 6.1',
                        result: 'el-icon-question',
                    },
                    {
                        content: 'scrapyd version gt 1.2.0',
                        result: 'el-icon-question',
                    }
                ],

                daemonstatus: {
                    // prototype data todo change before release.
                    selectedServer: Store.getServer(),
                    running: '1',
                    pending: '0',
                    finished: '2',
                    status: 'ok'
                },

                chartData: {
                    columns: ['时间', '下载速度', '下载量'],
                    rows: [
                        // prototype data todo change before release.
                        {'时间': '11/18 22:44:15', '下载速度': 30, '下载量': 0.4},
                        {'时间': '11/18 22:44:25', '下载速度': 32, '下载量': 0.5},
                        {'时间': '11/18 22:44:35', '下载速度': 12, '下载量': 0.7},
                        {'时间': '11/18 22:44:45', '下载速度': 50, '下载量': 0.9},
                        {'时间': '11/18 22:44:55', '下载速度': 10, '下载量': 1.2},
                        {'时间': '11/18 22:45:02', '下载速度': 27, '下载量': 1.6},
                        {'时间': '11/18 22:45:12', '下载速度': 60, '下载量': 2.3},
                    ]
                },

                charDataLimitLen: 50,
                cpuChartData: {
                    columns: ['时间', '使用量'],
                    rows: []
                },
                netChartData: {
                    columns: ['时间', '使用量'],
                    rows: []
                },
                memoryChartData: {
                    columns: ['时间', '使用量'],
                    rows: []
                }
            }
        },

        mounted() {
            this.serverStatus();
            this.fetchServerList();

            // prototype todo delete
            this.fetchServerCPUData();
            this.fetchNetworkData();
            this.fetchMemoryData();
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

    .custom-requirement-info {
        background-color: $color-bg;
        padding: 20px 15px;
        margin: 15px 0 30px 0;
        border: 1px solid $color-border-1;
        border-radius: 5px;
        position: relative;

        .requirement-header {
            border-bottom: 1px solid #d8dbe1;
            padding-bottom: 15px;
            .el-button {
                float: right;
                position: relative;
                top: -8px;
            }
        }

        p {
            padding-left: 15px;
            font-size: 14px;
            color: $color-text-normal;

            i[class="el-icon-success"] {
                color: #67C23A;
            }
            i[class="el-icon-error"] {
                color: #F56C6C;
            }
        }

        .requirement-body {
            li {
                text-decoration: none;
            }
        }
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .box-card {
        margin-bottom: 20px;
    }

    .el-card {
        .el-card__body {
            padding: 0 !important;
        }
    }

    .custom-badge {
        margin: 0 auto;
        text-align: center;

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
