<template>
    <d2-container>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span>数据库监控</span>
                    </div>
                    <el-table width="100%"
                            :data="databaseOverview">
                        <el-table-column label="服务器">
                            <el-table-column
                                label="类型"
                                width="120"
                                :filters="[
                                {text: 'MySQL', value:'MySQL'},
                                {text: 'Oracle', value:'Oracle'},
                                {text: 'MongoDB', value:'MongoDB'},
                                {text: 'Redis', value:'Redis'},
                                {text: 'PostgreSQL', value:'PostgreSQL'},
                                {text: 'sqlite', value:'sqlite'},
                                ]"
                                :filter-method="filterDatabaseType"
                                prop="type">
                            </el-table-column>
                            <el-table-column
                                    label="主机"
                                    prop="hostAndPort">
                            </el-table-column>
                            <el-table-column
                                    label="标签"
                                    width="80"
                                    prop="tag">
                            </el-table-column>
                            <el-table-column
                                    label="版本"
                                    prop="version">
                            </el-table-column>
                        </el-table-column>

                        <el-table-column label="数据库">
                            <el-table-column
                                label="连接"
                                width="50"
                                prop="connection">
                                <template slot-scope="props">
                                    <i v-if="props.row.connection" class="el-icon-success"></i>
                                    <i v-else class="el-icon-error"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="会话"
                                width="50"
                                prop="session">
                                <template slot-scope="props">
                                    <i v-if="props.row.session" class="el-icon-success"></i>
                                    <i v-else class="el-icon-error"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="进程"
                                width="50"
                                prop="dbProcess">
                                <template slot-scope="props">
                                    <i v-if="props.row.dbProcess" class="el-icon-success"></i>
                                    <i v-else class="el-icon-error"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="同步"
                                width="50"
                                prop="synchronize">
                                <template slot-scope="props">
                                    <i v-if="props.row.synchronize" class="el-icon-success"></i>
                                    <i v-else class="el-icon-error"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="延时"
                                width="50"
                                prop="delay">
                                <template slot-scope="props">
                                    <i v-if="props.row.delay" class="el-icon-success"></i>
                                    <i v-else class="el-icon-error"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="表空间"
                                width="70"
                                prop="tableSpace">
                                <template slot-scope="props">
                                    <i v-if="props.row.tableSpace" class="el-icon-success"></i>
                                    <i v-else class="el-icon-error"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="SNMP"
                                width="70"
                                prop="snmp">
                                <template slot-scope="props">
                                    <i v-if="props.row.connection" class="el-icon-success"></i>
                                    <i v-else class="el-icon-error"></i>
                                </template>
                            </el-table-column>
                        </el-table-column>

                        <el-table-column label="操作系统">
                            <el-table-column
                                label="进程"
                                width="50"
                                prop="ioProcess">
                                <template slot-scope="props">
                                    <i v-if="props.row.ioProcess" class="el-icon-success"></i>
                                    <i v-else class="el-icon-error"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="负载"
                                width="50"
                                prop="load">
                                <template slot-scope="props">
                                    <i v-if="props.row.load" class="el-icon-success"></i>
                                    <i v-else class="el-icon-error"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="cpu"
                                width="50"
                                prop="cpu">
                                <template slot-scope="props">
                                    <i v-if="props.row.cpu" class="el-icon-success"></i>
                                    <i v-else class="el-icon-error"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="内存"
                                width="50"
                                prop="ram">
                                <template slot-scope="props">
                                    <i v-if="props.row.ram" class="el-icon-success"></i>
                                    <i v-else class="el-icon-error"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="网络"
                                width="50"
                                prop="internet">
                                <template slot-scope="props">
                                    <i v-if="props.row.internet" class="el-icon-success"></i>
                                    <i v-else class="el-icon-error"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="磁盘"
                                width="50"
                                prop="disk">
                                <template slot-scope="props">
                                    <i v-if="props.row.disk" class="el-icon-success"></i>
                                    <i v-else class="el-icon-error"></i>
                                </template>
                            </el-table-column>
                        </el-table-column>

                        <el-table-column fixed="right"
                                label="操作">
                            <template slot-scope="props">
                                <el-button v-on:click="checkPerformance(props.row)" type="text" size="small">
                                    查看性能
                                </el-button>
                                <el-button v-on:click="checkWarning(props.row)" type="text" size="small">
                                    告警信息
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
    export default {
        name: "database-overview",
        methods: {
            filterDatabaseType() {

            },

            checkPerformance(row) {
                this.$router.push({
                    path: `/database/performance/${row.hostAndPort}`
                });
            },

            checkWarning(row) {
                this.$router.push({
                    path: `/database/warning/${row.hostAndPort}`
                });
            }
        },

        data() {
            return {
                databaseOverview: [],
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

                this.databaseOverview.push({
                    type: type,
                    hostAndPort: hostAndPort,
                    tag: '#' + Math.ceil(Math.random() * 10 + 1),
                    version: 'v.'+Math.ceil(Math.random() * 10 + 1) + '.' + Math.ceil(Math.random() * 10 + 1) + '.' + Math.ceil(Math.random() * 41 + 20),
                    connection: Math.random() < 0.8,
                    session: Math.random() < 0.8,
                    dbProcess: Math.random() < 0.8,
                    synchronize: Math.random() < 0.8,
                    delay: Math.random() < 0.8,
                    tableSpace: Math.random() < 0.8,
                    snmp: Math.random() < 0.8,
                    ioProcess: Math.random() < 0.8,
                    load: Math.random() < 0.8,
                    cpu: Math.random() < 0.8,
                    ram: Math.random() < 0.8,
                    internet: Math.random() < 0.8,
                    disk: Math.random() < 0.8,
                })
            }
        },
    }
</script>

<style scoped>
    .el-icon-success {
        color: #67C23A;
    }
    .el-icon-error {
        color: #F56C6C;
    }
</style>