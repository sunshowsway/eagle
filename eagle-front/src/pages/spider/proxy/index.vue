<template>
    <d2-container>

        <el-row :gutter="20">
            <el-col :span="18">
                <el-card>
                    <div slot="header" class="clearfix">
                        <el-form :inline="true" :model="newProxy" size="mini"
                                 style="border-bottom: 1px solid #e9edf5; padding: 10px 0;">
                            <el-form-item label="">
                                <el-input v-model="newProxy.ip" placeholder="IP"/>
                            </el-form-item>
                            <el-form-item label="">
                                <el-input v-model="newProxy.port" placeholder="Port"/>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onAddNewProxy" icon="el-icon-plus">添加</el-button>
                            </el-form-item>
                        </el-form>
                    </div>

                    <el-table
                            :data="proxies"
                            style="width: 100%; margin-top: 10px; margin-bottom: 20px;"
                            height="550">
                        <el-table-column
                                fixed
                                prop="ip"
                                label="IP">
                        </el-table-column>
                        <el-table-column
                                prop="port"
                                label="端口">
                        </el-table-column>
                        <el-table-column
                                prop="response_time"
                                label="响应时间(秒)"
                                sortable>
                            <template slot-scope="scope">
                                <span v-if="scope.row.response_time <= 1.0" style="color: #67C23A; font-weight: bold">
                                    {{scope.row.response_time}}
                                </span>
                                <span v-else-if="scope.row.response_time <= 5.0"
                                      style="color: #E6A23C; font-weight: bold">
                                    {{scope.row.response_time}}
                                </span>
                                <span v-else style="color: #F56C6C; font-weight: bold">
                                    {{scope.row.response_time}}
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column
                                prop="last_time"
                                sortable
                                label="最后使用时间">
                        </el-table-column>
                        <el-table-column
                                prop="status"
                                :filters="[{ text: '可用', value: '可用' }, { text: '停用', value: '停用' }, { text:'暂时不可用', value:'暂时不可用' }]"
                                filter-placement="bottom-end"
                                :filter-method="filterStatus"
                                label="状态">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.status === '可用'"
                                        type="success"
                                        size="mini">{{scope.row.status}}
                                </el-tag>

                                <el-tag v-else-if="scope.row.status === '停用'"
                                        type="warning"
                                        size="mini">{{scope.row.status}}
                                </el-tag>

                                <el-tag v-else size="mini">{{scope.row.status}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                label="操作">
                            <template slot-scope="scope">
                                <el-button v-on:click="stopProxy(scope.row)" type="text" size="small">
                                    停用
                                </el-button>
                                <el-button v-on:click="deleteProxy(scope.row)" type="text" size="small">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pageSize"
                            :page-sizes="[50, 80, 120, 150]"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span>代理源</span>
                        <el-button type="text"
                                   style="float: right; position: relative; top: -8px;"
                                   v-on:click="addProxiesURL()"
                                   icon="el-icon-circle-plus">
                            添加代理源
                        </el-button>
                    </div>

                    <el-table
                            :data="proxySource"
                            style="width: 100%; margin-top: 10px; margin-bottom: 20px;"
                            height="550">
                        <el-table-column
                                prop="url"
                                label="地址">
                        </el-table-column>

                        <el-table-column
                                fixed="right"
                                label="操作"
                        width="120">
                            <template slot-scope="scope">
                                <el-button v-on:click="deleteProxySource(scope.row)" type="text" size="small">
                                    删除
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
        name: 'proxy',

        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
            },

            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
            },

            onAddNewProxy() {
                if (this.newProxy.ip === '' || this.newProxy.port === '') {
                    this.$message({message: 'ip和端口不能为空', type: 'error'});
                    return;
                }
                this.$confirm(`添加新的代理：${this.newProxy.ip}:${this.newProxy.port}, 是否继续?`, '提示', {
                    confirmButtonText: '添加',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.$message({message: '代理ip已添加', type: 'success'})
                }).catch(err => {
                    this.$message('取消添加')
                });
            },

            addProxiesURL() {
                this.$prompt('请输入代理IP网站url: ', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    //inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                    inputErrorMessage: '格式不正确'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '已添加代理ip网站url, 后台爬取后入库.'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消添加'
                    });
                });
            },

            filterStatus(value, row, column) {
                return row.status === value;
            },

            deleteProxy(row) {
                this.$confirm(`删除代理：${row.ip}:${row.port}, 是否继续?`, '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.$message({message: '代理ip已删除', type: 'success'})
                }).catch(err => {
                    this.$message('取消删除')
                });
            },

            stopProxy(row) {
                this.$confirm(`停用代理：${row.ip}:${row.port}, 是否继续?`, '提示', {
                    confirmButtonText: '停用',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.$message({message: '代理ip已停用', type: 'success'})
                }).catch(err => {
                    this.$message('操作已取消')
                });
            },

            deleteProxySource(row) {
                this.$confirm(`删除代理源：${row.url}, 是否继续?`, '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.$message({message: '代理源已删除', type: 'success'})
                }).catch(err => {
                    this.$message('取消删除')
                });
            },

            getPrototypeTestData() {
                let ips = ['183.215.132.110',
                    '117.87.178.32',
                    '134.175.55.15',
                    '180.104.62.189',
                    '122.7.207.189',
                    '183.129.207.82',
                    '61.187.206.207',
                    '124.235.181.175',
                    '121.232.194.220',
                    '58.56.149.198',
                    '117.87.176.17',
                    '180.118.247.30',
                    '39.108.136.37',
                    '115.223.203.173',
                    '121.232.194.109',
                ];
                let ports = [44194,
                    9000,
                    8888,
                    9000,
                    8060,
                    11031,
                    48408,
                    80,
                    9000,
                    53281,
                    9000,
                    9000,
                    80,
                    9000,
                    9000
                ];
                let last_times = [
                    '2018-11-19 13:31:01',
                    '2018-11-19 12:31:18',
                    '2018-11-19 11:31:15',
                    '2018-11-19 10:31:16',
                    '2018-11-19 09:31:15',
                    '2018-11-19 08:31:14',
                    '2018-11-19 07:31:13',
                    '2018-11-19 06:31:11',
                    '2018-11-19 05:31:07',
                    '2018-11-19 04:31:09',
                    '2018-11-19 03:31:07',
                    '2018-11-19 02:31:02',
                    '2018-11-19 01:31:03',
                    '2018-11-19 00:31:04',
                    '2018-11-18 23:31:01'
                ];
                let status = ['可用', '停用', '暂时不可用'];

                for (let j = 0; j < 10; j++) {
                    for (let i = 0; i < ips.length; i++) {
                        this.proxies.push({
                            ip: ips[i],
                            port: ports[i],
                            response_time: (Math.random() * 5 + 0.5).toFixed(2),
                            status: status[Math.floor(Math.random() * status.length)],
                            last_time: last_times[i]
                        })
                    }
                }
                this.total = 10 * ips.length;
            }
        },

        data() {
            return {
                newProxy: {
                    ip: '',
                    port: ''
                },
                proxies: [],
                proxySource: [],
                currentPage: 1,
                pageSize: 20,
                total: 0,
            }
        },

        mounted() {
            this.getPrototypeTestData();
            this.proxySource.push(
                {url: 'https://proxysource_page1.com'},
                {url: 'https://proxysource_page2.com'},
                {url: 'https://proxysource_page3.com'},
                {url: 'https://proxysource_page4.com'},
                {url: 'https://proxysource_page5.com'},
                {url: 'https://proxysource_page6.com'},
                {url: 'https://proxysource_page7.com'},
                {url: 'https://proxysource_page8.com'},
            )
        }
    }
</script>

<style lang="scss" scoped>
    .el-card__body {
        padding-top: 8px;
    }

    .custom-list {
        p {
            margin: 0;
            font-size: 14px;
            padding: 10px 0;
            border-bottom: 1px solid #eceff5;
        }
        &:first-child p {
            margin-top: 0;
        }
        &:last-child p {
            margin-bottom: 0;
        }
    }
</style>
