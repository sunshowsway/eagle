<template>
    <d2-container>
        <el-row :gutter="20">
            <el-col :span="24">

                <div class="grid-content bg-purple-light">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>爬虫列表</span><br>
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

                            <!--<el-button style="float: right; position: relative; left: -25px;"-->
                            <!--icon="el-icon-plus"-->
                            <!--round size="mini"-->
                            <!--v-on:click="newJob()"-->
                            <!--v-if="selectedProject"-->
                            <!--type="primary">-->
                            <!--添加任务-->
                            <!--</el-button>-->

                        </div>
                        <el-table
                                :data="spiderData"
                                :loading="loading"
                                style="width: 100%"
                                height="300">

                            <el-table-column
                                    prop="project"
                                    label="项目">
                            </el-table-column>

                            <el-table-column
                                    prop="spiderName"
                                    label="爬虫名称">
                            </el-table-column>

                            <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="200">
                                <template slot-scope="scope">
                                    <el-button v-on:click="delete(scope.row)" type="text" size="small" disabled>delete
                                    </el-button>
                                    <el-button v-on:click="openSchedulerDialog(scope.row)" type="text" size="small">
                                        scheduler
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </div>
            </el-col>
        </el-row>

        <el-dialog
                title="创建任务"
                :visible.sync="dialogVisible"
                width="35%">

            <el-form
                    ref="form"
                    :rules="schedulerRules"
                    :model="schedulerData"
                    label-width="100px">
                <el-form-item label="项目">
                    <el-input :value="schedulerData.project" size="small" disabled/>
                </el-form-item>
                <el-form-item label="爬虫">
                    <el-input :value="schedulerData.spider" size="small" disabled/>
                </el-form-item>

                <el-form-item label="更多设置">
                    <el-tooltip class="item" effect="light" content="Building..." placement="bottom-start">
                        <el-switch
                                active-color="#409EFF"
                                inactive-color="#C0C4CC"
                                disabled
                                v-model="schedulerData.setting">
                        </el-switch>
                    </el-tooltip>
                </el-form-item>

                <div v-if="schedulerData.setting"
                     class="custom-more-setting">
                    <el-form-item label="任务ID">
                        <el-input v-model="schedulerData.jobId"
                                  size="small">
                        </el-input>
                        <!--<small style="font-size: 12px; color: #909399;">{{schedulerData.jobId}}</small>-->
                    </el-form-item>

                    <el-form-item label="版本号">
                        <el-input v-model="schedulerData.version" size="small"/>
                    </el-form-item>

                    <el-form-item label="下载计划">
                        <el-input-number
                                v-model="schedulerData.downloadDelay"
                                size="small"
                                style="width: 200px;"
                                :min="0"
                                :max="10">
                        </el-input-number>
                    </el-form-item>
                </div>
            </el-form>


            <span slot="footer" class="dialog-footer">
                    <el-button
                            type="primary"
                            v-on:click="scheduler"
                            size="small">创建</el-button>
                </span>
        </el-dialog>
    </d2-container>
</template>

<style lang="scss">
    @import '~@/assets/style/public.scss';

    .el-form-item__label {
        display: block;
    }

    .el-dialog__body {
        padding-top: 10px;
    }

    .el-form-item {
        margin-bottom: 8px;
        .el-input {
            width: 200px;
            display: block;
        }
    }

    .custom-more-setting {
        border: 1px dashed $color-border-1;
        border-radius: 3px;
        padding: 10px;
    }

    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .text {
        font-size: 14px;
    }

    .bg-purple {
        background: #d3dce6;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

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
    import {SpiderList} from '@/api/scrapyd-api/v1_2_0';
    import {Schedule} from '@/api/scrapyd-api/v1_2_0';
    import Store from '../../store';

    export default {
        methods: {
            delete(row) {
                this.$message({
                    message: `删除 ${row.spiderName}，开发中...`,
                    type: 'error'
                });
                console.log(row);
            },

            openSchedulerDialog(row) {
                this.schedulerData.project = this.selectedProject;
                this.schedulerData.spider = row.spiderName;

                this.dialogVisible = true;
            },

            //todo scheduler a spider run (also known as a job), then return the job id.
            scheduler() {
                Schedule({
                    server: this.selectedServer,
                    project: this.schedulerData.project,
                    spider: this.schedulerData.spider
                }).then(res => {
                    if (res.status === 'ok') {
                        this.$message({message: `Job -> [${res.jobid}] scheduled.`, type: 'success'});
                    } else {
                        this.$message({message: `${res.message}`, type: 'error'});
                    }
                }).finally(() => {
                    this.dialogVisible = false;
                })
            },

            handleSelect(command) {
                this.selectedProject = command;
                this.getSpiderList();
            },

            getSpiderList() {
                SpiderList({
                    server: this.selectedServer,
                    project: this.selectedProject
                }).then(res => {
                    this.spiderData = [];
                    for (const i in res.spiders) {
                        this.spiderData.push({
                            index: i,
                            project: this.selectedProject,
                            spiderName: res.spiders[i]
                        })
                    }
                }).finally(() => {
                    this.loading = false;
                })
            }
        },

        data() {
            return {
                selectedServer: Store.getServer(),
                dialogVisible: false,
                selectedProject: '',
                spiderData: [],
                projects: [],
                loading: true,

                schedulerData: {
                    project: '',
                    spider: '',
                    setting: false,
                    downloadDelay: 0,
                    jobId: '',
                    version: ''
                },

                schedulerRules: {}
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
                this.getSpiderList();
            }
        }
    }
</script>