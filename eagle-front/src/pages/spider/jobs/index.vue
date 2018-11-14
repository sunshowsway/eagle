<template>
    <d2-container>
        <el-row :gutter="20">
            <el-col :span="24">

                <div class="grid-content bg-purple-light">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>任务列表</span><br>
                            <span style="font-size: 12px;" v-bind="selectedServer"><em>当前选定的服务器: {{selectedServer?selectedServer:'未指定'}}</em></span>
                            <el-dropdown
                                    @command="handleSelect"
                                    style="float: right; top: 4px;">
                                <span class="el-dropdown-link">
                                    {{selectedProject ? selectedProject : '请选择项目'}}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                            v-for="project in projects"
                                            :command="project.name">
                                        {{project.name}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>

                        <el-table
                                :data="jobData"
                                height="300"
                                :default-sort="{prop: 'startTime', order: 'descending'}"
                                style="width: 100%">
                            <el-table-column
                                    prop="id"
                                    label="JobId"
                                    width="270">
                            </el-table-column>

                            <el-table-column
                                    prop="spiderName"
                                    label="爬虫名称"
                                    width="150">
                            </el-table-column>

                            <el-table-column
                                    prop="status"
                                    label="状态"
                                    width="100"
                                    :filters="[{ text: 'pending', value: 'pending' }, { text: 'running', value: 'running' }, { text:'finished', value:'finished' }]"
                                    filter-placement="bottom-end"
                                    :filter-method="filterStatus">
                                <template slot-scope="scope">
                                    <el-tag v-if="scope.row.status === 'running'"
                                            type="success"
                                            size="mini">{{scope.row.status}}
                                    </el-tag>

                                    <el-tag v-else-if="scope.row.status === 'pending'"
                                            type="warning"
                                            size="mini">{{scope.row.status}}
                                    </el-tag>

                                    <el-tag v-else size="mini">{{scope.row.status}}
                                    </el-tag>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="startTime"
                                    label="开始时间"
                                    width="150"
                                    sortable
                                    :formatter="startTimeFormatter">
                            </el-table-column>

                            <el-table-column
                                    prop="endTime"
                                    label="结束时间"
                                    width="150"
                                    sortable
                                    :formatter="endTimeFormatter">
                            </el-table-column>

                            <el-table-column
                                    fixed="right"
                                    label="操作">
                                <template slot-scope="scope">
                                    <el-button v-on:click="cancel(scope.row)" type="text" size="small">停止 / 删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </d2-container>
</template>

<style lang="scss">
    @import '~@/assets/style/public.scss';

    .el-dropdown-link {
        cursor: pointer;
        color: $color-primary;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }
</style>

<script>
    import {ProjectList} from '@/api/scrapyd-api/v1_2_0';
    import {JobList} from '@/api/scrapyd-api/v1_2_0';
    import {CancelJob} from '@/api/scrapyd-api/v1_2_0';
    import Store from '../../store'

    export default {
        name: 'jobs',
        methods: {
            getJobList() {
                JobList({
                    server: this.selectedServer,
                    project: this.selectedProject,
                }).then(res => {
                    if (res.status === 'ok') {
                        this.jobData = [];

                        for (const i in res.pending) {
                            this.jobData.push({
                                id: res.pending[i].id,
                                spiderName: res.pending[i].spider,
                                status: 'pending',
                            })
                        }

                        for (const i in res.running) {
                            this.jobData.push({
                                id: res.running[i].id,
                                spiderName: res.running[i].spider,
                                startTime: res.running[i].start_time,
                                status: 'running',
                            })
                        }

                        for (const i in res.finished) {
                            this.jobData.push({
                                id: res.finished[i].id,
                                spiderName: res.finished[i].spider,
                                startTime: res.finished[i].start_time,
                                endTime: res.finished[i].end_time,
                                status: 'finished',
                            })
                        }
                    } else {
                        this.$message({
                            message: `Get job-list for the selected project ${row.projects} failed, [error-msg]: ${res.message}`,
                            type: 'error'
                        })
                    }
                })
            },

            startTimeFormatter(row) {
                let time = row.startTime ? row.startTime : '';
                return this.timeFormatter(time);
            },
            endTimeFormatter(row) {
                let time = row.endTime ? row.endTime : '';
                return this.timeFormatter(time);
            },

            timeFormatter(str) {
                if (str === '') {
                    return '-';
                }
                return str.split('.')[0];
            },

            // cancel a spider run (aka.job)
            // delete a spider if prev-status is pending, terminate it if running;
            cancel(row) {
                this.$confirm(`此操作将使 pending 状态的任务删除; running 状态的任务终止. [当前选择的任务状态：${row.status}] 是否继续?`, '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning',

                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '操作中...';

                            CancelJob({
                                server: this.selectedServer,
                                project: this.selectedProject,
                                job: row.id
                            }).then(res => {
                                if (res.status === 'ok') {
                                    this.$message({
                                        message: `job-${row.id} [prev-state:${res.prevstate}] canceled.`,
                                        type: 'success'
                                    });

                                    this.getJobList();
                                } else {
                                    let msg = res.message === '' ? res.message : '未知错误';

                                    this.$message({
                                        message: `${msg}`,
                                        type: 'error'
                                    })
                                }

                            }).finally(() => {
                                done();
                                instance.confirmButtonLoading = false;
                            })
                        } else {
                            done();
                            instance.confirmButtonLoading = false;
                        }
                    }
                });
            },

            // handle drop down button
            handleSelect(command) {
                this.selectedProject = command;
                this.getJobList();
            },

            filterStatus(value, row, column) {
                return row.status === value;
            }
        },

        data() {
            return {
                selectedServer: Store.getServer(),
                selectedProject: '',
                projects: [],
                jobData: [
                    // test data
                    // {
                    //     id: '78391cc0fcaf11e1b0090800272a6d06',
                    //     spiderName: 'spider1',
                    //     status: 'running',
                    //     startTime: '2012-09-12 10:14:03.594664',
                    //     endTime: '2012-09-12 10:24:03.594664'
                    // },
                    // {
                    //     id: '78391cc0fcaf11e1b0090800272a6d06',
                    //     spiderName: 'spider2',
                    //     status: 'pending',
                    //     startTime: '2018-09-12 10:14:03.594664',
                    //     endTime: '2018-09-12 11:24:03.594664'
                    // }
                ],
                loading: true,
            }
        },

        mounted() {
            ProjectList({
                server: this.selectedServer
            }).then(res => {
                for (const i in res.projects) {
                    this.projects.push({name: res.projects[i]})
                }
            });

            if (this.$route.params.project_name) {
                this.selectedProject = this.$route.params.project_name;
                this.getJobList();
            }
        }
    }
</script>
