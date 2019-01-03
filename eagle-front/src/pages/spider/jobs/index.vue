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
                                    style="float: right;">
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

                            <el-button type="primary"
                                       round size="mini"
                                       v-on:click="stopAllJobs()"
                                       style="float: right; margin-right: 20px; position: relative; top: -5px;">
                                停止所有任务
                            </el-button>
                        </div>

                        <el-table
                                :data="jobData"
                                max-height="500"
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
import axios from 'axios'

export default {
    name: 'jobs',
    methods: {
        getJobList() {
            // JobList({
            //     server: this.selectedServer,
            //     project: this.selectedProject,
            // }).then(res => {
            //     if (res.status === 'ok') {
            //         this.jobData = [];
            //
            //         for (const i in res.pending) {
            //             this.jobData.push({
            //                 id: res.pending[i].id,
            //                 spiderName: res.pending[i].spider,
            //                 status: 'pending',
            //             })
            //         }
            //
            //         for (const i in res.running) {
            //             this.jobData.push({
            //                 id: res.running[i].id,
            //                 spiderName: res.running[i].spider,
            //                 startTime: res.running[i].start_time,
            //                 status: 'running',
            //             })
            //         }
            //
            //         for (const i in res.finished) {
            //             this.jobData.push({
            //                 id: res.finished[i].id,
            //                 spiderName: res.finished[i].spider,
            //                 startTime: res.finished[i].start_time,
            //                 endTime: res.finished[i].end_time,
            //                 status: 'finished',
            //             })
            //         }
            //     } else {
            //         this.$message({
            //             message: `Get job-list for the selected project ${row.projects} failed, [error-msg]: ${res.message}`,
            //             type: 'error'
            //         })
            //     }
            // })

            // prototype todo delete
            this.jobData = [];
            this.jobData.push(
                {
                    id: '1212sdlkfjq32r2012342013ksd',
                    spiderName: 'spider name #1',
                    status: 'pending',
                },
                {
                    id: '1212sdlkfjq32r2012342013ksd',
                    spiderName: 'spider name #1',
                    startTime: '2018-11-19 11:09:23',
                    endTime: '20018-11-19 11:20:10',
                    status: 'finished',
                },
                {
                    id: '1212sdlkfjq32r2012342013ksd',
                    spiderName: 'spider name #1',
                    startTime: '2018-11-19 11:29:34',
                    status: 'running',
                },
                {
                    id: '1212sdlkfjq32r2012342013ksd',
                    spiderName: 'spider name #1',
                    status: 'pending',
                },
                {
                    id: '1212sdlkfjq32r2012342013ksd',
                    spiderName: 'spider name #1',
                    startTime: '2018-11-19 11:19:55',
                    endTime: '20018-11-19 11:22:23',
                    status: 'finished',
                },
                {
                    id: '1212sdlkfjq32r2012342013ksd',
                    spiderName: 'spider name #1',
                    startTime: '2018-11-19 11:19:33',
                    status: 'running',
                },
                {
                    id: '1212sdlkfjq32r2012342013ksd',
                    spiderName: 'spider name #1',
                    status: 'pending',
                },
                {
                    id: '1212sdlkfjq32r2012342013ksd',
                    spiderName: 'spider name #1',
                    startTime: '2018-11-19 11:59:23',
                    endTime: '20018-11-19 12:30:11',
                    status: 'finished',
                },
                {
                    id: '1212sdlkfjq32r2012342013ksd',
                    spiderName: 'spider name #1',
                    startTime: '2018-11-19 12:09:23',
                    status: 'running',
                },
            )
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
            // this.$confirm(`此操作将使 pending 状态的任务删除; running 状态的任务终止. [当前选择的任务状态：${row.status}] 是否继续?`, '提示', {
            //     confirmButtonText: '继续',
            //     cancelButtonText: '取消',
            //     type: 'warning',
            //
            //     beforeClose: (action, instance, done) => {
            //         if (action === 'confirm') {
            //             instance.confirmButtonLoading = true;
            //             instance.confirmButtonText = '操作中...';
            //
            //             CancelJob({
            //                 server: this.selectedServer,
            //                 project: this.selectedProject,
            //                 job: row.id
            //             }).then(res => {
            //                 if (res.status === 'ok') {
            //                     this.$message({
            //                         message: `job-${row.id} [prev-state:${res.prevstate}] canceled.`,
            //                         type: 'success'
            //                     });
            //
            //                     this.getJobList();
            //                 } else {
            //                     let msg = res.message === '' ? res.message : '未知错误';
            //
            //                     this.$message({
            //                         message: `${msg}`,
            //                         type: 'error'
            //                     })
            //                 }
            //
            //             }).finally(() => {
            //                 done();
            //                 instance.confirmButtonLoading = false;
            //             })
            //         } else {
            //             done();
            //             instance.confirmButtonLoading = false;
            //         }
            //     }
            // });

            // prototype todo delete
            this.$confirm(`此操作将使 pending 状态的任务删除; running 状态的任务终止. [当前选择的任务状态：${row.status}] 是否继续?`, '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning',

                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '操作中...';

                        setTimeout(() => {
                            this.$message({
                                message: `job-${row.id} 操作已执行.`,
                                type: 'success'
                            });
                            done();
                            instance.confirmButtonLoading = false;
                        }, 1500);
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
        },

        stopAllJobs() {
            // prototype todo delete
            this.$confirm(`停止所有的任务, 是否继续?`, '提示', {
                confirmButtonText: '停止所有任务',
                cancelButtonText: '取消',
                type: 'warning',

                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '停止中...';

                        setTimeout(() => {
                            this.$message({
                                message: `操作已执行.`,
                                type: 'success'
                            });
                            done();
                            instance.confirmButtonLoading = false;

                            for (let i = 0; i < this.jobData.length; i++) {
                                this.jobData[i].status = 'finished';
                            }
                        }, 1500);
                    } else {
                        done();
                        instance.confirmButtonLoading = false;
                    }
                }
            });


            // axios.get('/api/runtime/stopalljobs').then(function (res) {
            //     console.log('response==============>' + res);
            //     console.log(res.code);
            //     console.log(res.msg);
            // })
        }
    },

    data() {
        return {
            selectedServer: Store.getServer(),
            selectedProject: '',
            projects: [],
            jobData: [
                // test data
                {
                    id: '78391cc0fcaf11e1b0090800272a6d06',
                    spiderName: 'spider1',
                    status: 'running',
                    startTime: '2012-09-12 10:14:03.594664',
                    endTime: '2012-09-12 10:24:03.594664'
                },
                {
                    id: '78391cc0fcaf11e1b0090800272a6d06',
                    spiderName: 'spider2',
                    status: 'pending',
                    startTime: '2018-09-12 10:14:03.594664',
                    endTime: '2018-09-12 11:24:03.594664'
                },
                {
                    id: '78391cc0fcaf11e1b0090800272a6d06',
                    spiderName: 'spider1',
                    status: 'running',
                    startTime: '2012-09-12 10:14:03.594664',
                    endTime: '2012-09-12 10:24:03.594664'
                },
                {
                    id: '78391cc0fcaf11e1b0090800272a6d06',
                    spiderName: 'spider2',
                    status: 'running',
                    startTime: '2018-09-12 10:14:03.594664',
                    endTime: '2018-09-12 11:24:03.594664'
                }
            ],
            loading: true,
        }
    },

    mounted() {
        // ProjectList({
        //     server: this.selectedServer
        // }).then(res => {
        //     for (const i in res.projects) {
        //         this.projects.push({name: res.projects[i]})
        //     }
        // });

        // prototype todo delete.
        this.projects.push({
                name: 'project name #1',
            },
            {
                name: 'project name #2'
            }
        );

        if (this.$route.params.project_name) {
            this.selectedProject = this.$route.params.project_name;
            this.getJobList();
        }
    }
}
</script>
