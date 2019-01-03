<template>
    <d2-container>

        <el-card class="box_card">
            <p style="font-size: 24px;">日志</p>
            <!--<div class="block">-->

            <el-row :gutter="20" style="margin-bottom: 20px;">
                <el-col :span="22">
                    <el-date-picker
                            v-model="value5"
                            type="datetimerange"
                            style="float: left"
                            :picker-options="pickerOptions2"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"
                            size="small">
                    </el-date-picker>

                    <el-select
                            clearable
                            v-model="options.value"
                            placeholder="日志级别"
                            style="margin-bottom: 10px; margin-left: 10px; margin-right: 20px; width: 120px;"
                            size="small">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>

                    <el-button type="primary" round>搜索</el-button>
                </el-col>

                <el-col :span="2" style="float: right">
                    <el-button type="text" size="small" v-on:click="collapseAll()">折叠全部</el-button>
                </el-col>
            </el-row>


            <!--</div>-->


            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item :title="'20181108230027.log - ' + index" :name="index"
                                  v-for="(item,index) in pageData"
                                  v-show="(currentPage - 1) * pageSize <= index && index < currentPage * pageSize">
                    <div>2018-11-08 23:00:27 [scrapy.middleware] INFO: Enabled spider middlewares:
                        ['scrapy.spidermiddlewares.httperror.HttpErrorMiddleware',
                        'scrapy.spidermiddlewares.offsite.OffsiteMiddleware',
                        'scrapy.spidermiddlewares.referer.RefererMiddleware',
                        'scrapy.spidermiddlewares.urllength.UrlLengthMiddleware',
                        'scrapy.spidermiddlewares.depth.DepthMiddleware']
                    </div>
                </el-collapse-item>
            </el-collapse>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[20, 40, 60, 80]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
    </d2-container>
</template>

<script>
    export default {
        name: 'logging',
        data() {
            return {
                pickerOptions2: {
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
                activeNames: [],
                value5: '',
                pageData: [],
                currentPage: 1,
                pageSize: 20,
                total: 0,
                options: [{
                    value: '选项1',
                    label: 'DEBUG'
                }, {
                    value: '选项2',
                    label: 'INFO'
                }, {
                    value: '选项3',
                    label: 'WARNING'
                }, {
                    value: '选项4',
                    label: 'ERROR'
                }, {
                    value: '选项5',
                    label: 'FATAL'
                }],
            };
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
            },
            collapseAll() {
                this.activeNames = [];
            }
        },

        mounted() {
            let data = [];
            for (let i = 0; i < 200; i++) {
                data.push(i);
            }
            this.pageData = data;
            this.total = data.length;
        }
    }
</script>