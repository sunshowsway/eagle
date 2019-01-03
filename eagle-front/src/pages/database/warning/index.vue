<template>
    <d2-container>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>告警系统</span>
                    </div>
                    <el-form :inline="true"
                            v-model="searchValue">
                        <el-form-item label="">
                            <el-date-picker
                                v-model="time"
                                type="datetimerange"
                                style="position: relative; top: 1px;"
                                :picker-options="pickerOptions"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right"
                                size="small">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item>
                            <el-input
                                v-model="content"
                                placeholder="请输入搜索内容"
                                size="small"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary"
                                       size="small"
                                       @click="searchWaringInfo" icon="el-icon-search">搜索</el-button>
                        </el-form-item>
                    </el-form>

                    <el-table
                            :data="warningData"
                            style="width: 100%">
                        <el-table-column
                                prop="ip"
                                label="主机"
                        ></el-table-column>
                        <el-table-column
                                prop="tag"
                                label="标签"
                        ></el-table-column>
                        <el-table-column
                                prop="types"
                                label="类型"
                        ></el-table-column>
                        <el-table-column
                                prop="level"
                                label="级别"
                                width="100"
                                :filters="[{text:'警急',value:'警急'},{text:'警告',value:'警告'}]"
                                :filter-method="filterStatus">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.level=='警急'"
                                        type="danger"
                                        size="small">
                                    {{scope.row.level}}
                                </el-tag>
                                <el-tag v-else-if="scope.row.level=='警告'"
                                        type="warning"
                                        size="small">
                                    {{scope.row.level}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="messages"
                                label="消息"
                        ></el-table-column>
                        <el-table-column
                                prop="time"
                                label="监控时间"
                        ></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
    export default {
        name: "database-warning",
        methods: {
            initWarningInfo(host) {
                this.warningData = [
                    {
                        id: 1,
                        ip: '219.234.6.180:6499',
                        tag: 'redis5',
                        types: 'redis',
                        level: '警急',
                        messages: 'redis server down',
                        time: '2018-11-22 22:03:21',
                    },
                    {
                        id: 2,
                        ip: '219.234.6.180:27018',
                        tag: 'mongo2',
                        types: 'mongodb',
                        level: '警急',
                        messages: 'mongodb server down',
                        time: '2018-18-22 22:30:21',
                    },
                    {
                        id: 3,
                        ip: '219.234.6.180:3326',
                        tag: 'm5',
                        types: 'mysql',
                        level: '警急',
                        messages: 'replication stop',
                        time: '2018-10-04 05:22:21',
                    },
                    {
                        id: 4,
                        ip: '123.254.109.227:6499',
                        tag: 'hk-webserver',
                        types: 'os',
                        level: '警急',
                        messages: 'snmp server down',
                        time: '2018-12-13 14:31:21',
                    },
                    {
                        id: 5,
                        ip: '219.234.6.180:1521',
                        tag: 'oracle11g',
                        types: 'oracle',
                        level: '警告',
                        messages: 'tablespace SYSAUX usage reach 93%',
                        time: '2018-07-22 23:03:21',
                    },
                ];
            },

            searchWaringInfo() {

            },

            filterStatus(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            }
        },

        data() {
            return {
                searchValue: {
                    time: '',
                    content: ''
                },
                selectedHost: '',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                warningData: [],
            }
        },
        mounted() {
            if (this.$route.params.host_and_port) {
                this.selectedHost = this.$route.params.host_and_port;
                this.initWarningInfo(host_and_port);
            } else {
                this.initWarningInfo('');
            }

        }
    }
</script>

<style scoped>

</style>