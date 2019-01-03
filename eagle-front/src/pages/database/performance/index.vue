<template>
    <d2-container>
        <el-row :gutter="20">
            <el-col :span="24">
                <h2>数据库内核性能图表</h2>

                <div style="display: block; font-size: 12px; margin: 15px 0 25px 0;">
                    <span v-if="selectedHost">
                        <span><em>当前选定的数据库: {{selectedHost}}</em></span>
                    </span>

                    <el-dropdown
                            @command="handleSelectDatabase"
                            style="float: right; top: 4px;">
                        <span class="el-dropdown-link">
                            {{selectedHost ? selectedHost : '请选择数据库'}}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                    v-for="item in databaseList"
                                    :command="item.hostAndPort">
                                {{item.type}}[{{item.hostAndPort}}]
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="8" class="custom-pie-pans">
                <el-card shadow="hover">
                    <div slot="header">
                        <span>连接池使用情况</span>
                    </div>
                    <ve-pie style="height: 250px;"
                            :settings="pieChartSettings"
                            :colors="colors"
                            :data="connectionChartData"></ve-pie>
                </el-card>
            </el-col>

            <el-col :span="8">
                <el-card shadow="hover">
                    <div slot="header">
                        <span>表缓存使用情况</span>
                    </div>
                    <ve-pie style="height: 250px;"
                            :settings="pieChartSettings"
                            :colors="colors"
                            :data="cacheTableChartData"></ve-pie>
                </el-card>
            </el-col>

            <el-col :span="8">
                <el-card shadow="hover">
                    <div slot="header">
                        <span>打开文件数</span>
                    </div>
                    <ve-pie style="height: 250px;"
                            :settings="pieChartSettings"
                            :colors="colors"
                            :data="openFileChartData"></ve-pie>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="12">
                <el-card>
                    <div slot="header">
                        <span>数据库线程</span>
                    </div>

                    <ve-line :data-zoom="dataZoom"
                             :colors="colors"
                             :data="processChartData"></ve-line>
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card>
                    <div slot="header">
                        <span>QPS - TPS</span>
                    </div>

                    <ve-line :data-zoom="dataZoom"
                             :colors="colors"
                             :data="queryChartData"></ve-line>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="24">
                <el-card>
                    <div slot="header">
                        <span>DML per second</span>
                    </div>

                    <ve-line :data-zoom="dataZoom"
                             :colors="colors"
                             :data="dmlChartData"></ve-line>
                </el-card>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
    function formatTime(time) {
        let hour = time.getHours();
        let minute = time.getMinutes();
        return hour + ":" + minute;
    }

    export default {
        name: "database-performance",
        methods: {
            handleSelectDatabase(command) {
                this.selectedHost = command;
                this.initGraph();
            },

            initGraph() {
                this.connectionChartData.rows = [];
                this.cacheTableChartData.rows = [];
                this.openFileChartData.rows = [];
                this.processChartData.rows = [];
                this.queryChartData.rows = [];
                 this.dmlChartData.rows = [];


                this.connectionChartData.rows.push(
                    {'key': '已用连接', 'value': Math.ceil(Math.random() * 401 + 800)},
                    {'key': '可用连接', 'value': Math.ceil(Math.random() * 1001 + 2000)},
                );

                this.cacheTableChartData.rows.push(
                    {'key': '已打开表数', 'value': Math.ceil(Math.random() * 401 + 1100)},
                    {'key': '可用表缓存', 'value': Math.ceil(Math.random() * 801 + 1400)},
                );

                this.openFileChartData.rows.push(
                    {'key': '已打开文件数', 'value': Math.ceil(Math.random() * 41 + 80)},
                    {'key': '可用文件句柄', 'value':  Math.ceil(Math.random() * 701 + 5500)},
                );


                let now = (new Date()).getTime();
                for (let i = 0; i < 500; i++) {
                    now += 60000;
                    let timeStr = formatTime(new Date(now));

                    this.processChartData.rows.push({
                        'time': timeStr,
                        'running': Math.ceil(Math.random() * 201 + 1000),
                        'connected': Math.ceil(Math.random() * 10 + 1),
                        'cached': Math.ceil(Math.random() * 10 + 1),
                    });

                    this.queryChartData.rows.push({
                        'time': timeStr,
                        'qps': Math.ceil(Math.random() * 1022),
                        'tps': Math.ceil(Math.random() * 8),
                    });

                    this.dmlChartData.rows.push({
                        'time': timeStr,
                        'select': Math.ceil(Math.random() * 221),
                        'insert': Math.ceil(Math.random() * 981),
                        'update': Math.ceil(Math.random() * 1095),
                        'delete': Math.ceil(Math.random() * 84)
                    })
                }
            }
        },

        data() {
            this.dataZoom = [
                {
                    type: 'slider',
                    start: 0,
                    end: 20
                }
            ];
            this.colors = ['#0694d6', '#e6a23a', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a',
                '#6e7074', '#546570', '#c4ccd3'];
            this.pieChartSettings = {
                radius: 50,
                offsetY: 150,
                grid: {bottom: 0, height: 150}
            };

            return {
                selectedHost: '',
                databaseList: [],
                connectionChartData: {
                    columns: ['key', 'value'],
                    rows: []
                },
                cacheTableChartData: {
                    columns: ['key', 'value'],
                    rows: []
                },
                openFileChartData: {
                    columns: ['key', 'value'],
                    rows: []
                },
                processChartData: {
                    columns: ['time', 'running', 'connected', 'cached'],
                    rows: []
                },
                queryChartData: {
                    columns: ['time', 'qps', 'tps'],
                    rows: []
                },
                dmlChartData: {
                    columns: ['time', 'select', 'insert', 'update', 'delete'],
                    rows: []
                },
            }
        },

        mounted() {
            for (let i = 0; i < 15; i++) {
                let random = Math.random();
                let type, hostAndPort;
                if (random < 0.4) {
                    type = 'MySQL';
                    if (random < 0.2)
                        hostAndPort = '112.64.45.30:3316';
                    else
                        hostAndPort = '219.234.6.180:3307';
                } else if (random < 0.6) {
                    type = 'Redis';
                    if (random < 0.5)
                        hostAndPort = '112.64.45.30:6709';
                    else
                        hostAndPort = '219.234.6.180:6709';
                } else if (random < 0.8) {
                    type = 'Oracle';
                    hostAndPort = '219.234.6.180:1521';
                } else {
                    type = 'MongoDB';
                    if (random < 0.8)
                        hostAndPort = '219.234.6.180:27017';
                    else
                        hostAndPort = '219.234.6.180:27018'
                }

                this.databaseList.push({
                    type: type,
                    hostAndPort: hostAndPort,
                })
            }


            if (this.$route.params.host_and_port) {
                this.selectedHost = this.$route.params.host_and_port;
                this.databaseList.push({
                    type: 'MySQL',
                    hostAndPort: this.selectedHost
                });
                this.initGraph();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '~@/assets/style/public.scss';

    .el-dropdown-link {
        cursor: pointer;
        color: $color-primary;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }

    .ve-pie {
        height: 250px;
    }

    .el-card {
        margin-bottom: 20px;
    }

</style>