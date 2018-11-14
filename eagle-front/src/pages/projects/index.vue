<template>
    <d2-container>
        <el-row :gutter="20">
            <!--projects list-->
            <el-col :span="14">
                <div class="grid-content bg-purple-light">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>项目列表</span><br>
                            <span style="font-size: 12px;" v-bind="selectedServer"><em>当前选定的服务器: {{selectedServer?selectedServer:'未指定'}}</em></span>
                        </div>

                        <el-table
                                :data="projectData"
                                :loading="loading"
                                style="width: 100%"
                                max-height="350">
                            <el-table-column
                                    prop="projects"
                                    label="项目名称">
                            </el-table-column>

                            <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="300">
                                <template slot-scope="scope">
                                    <el-button v-on:click="checkSpiders(scope.row)" type="text" size="small">查看 Spiders
                                    </el-button>
                                    <el-button v-on:click="checkJobs(scope.row)" type="text" size="small">查看 Jobs
                                    </el-button>
                                    <el-button v-on:click="checkVersion(scope.row)" type="text" size="small">查看 Versions
                                    </el-button>
                                    <el-button v-on:click="delProject(scope.row)" type="text" size="small">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </div>
            </el-col>

            <!--version tables-->
            <el-col :span="10">
                <div class="grid-content">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="display: inline-block; padding-top: 8px;"
                                  v-if="selectedProject">{{selectedProject}}</span>&nbsp;
                            <span style="display: inline-block; padding-top: 8px;">项目的各个版本</span>
                            <el-button
                                    icon="el-icon-reset"
                                    type="text"
                                    style="float:right; color: #409EFF; font-size: 12px; cursor: pointer;"
                                    v-on:click="resetSelectedProject()">
                                重置
                            </el-button>

                            <el-button
                                    icon="el-icon-refresh"
                                    type="text"
                                    style="float:right; color: #409EFF; font-size: 12px; cursor: pointer;"
                                    v-if="selectedServer && selectedProject"
                                    v-on:click="requestVersionList()">
                                刷新
                            </el-button>

                        </div>

                        <div v-if="selectedProject">
                            <el-table
                                    :data="versionData"
                                    style="width: 100%"
                                    max-height="350">
                                <el-table-column
                                        prop="version"
                                        label="Version">
                                </el-table-column>

                                <el-table-column
                                        fixed="right"
                                        label="操作"
                                        width="50">
                                    <template slot-scope="scope">
                                        <el-button v-on:click="deleteVersion(scope.row)" type="text" size="small">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <span style="display: inline-block; font-size: 12px; color: #F56C6C; padding-top: 10px;">Tips: 如果该项目没有其他版本了，则项目也会被删除</span>
                        </div>


                        <span v-else style="font-size: 12px; color: #909399; display: block; text-align: center">
                            请先选择项目 >> 查看 Versions
                        </span>
                    </el-card>
                </div>
            </el-col>
        </el-row>

        <!--打包部署项目，未完成-->
        <el-row :gutter="20" style="display: block;">
            <el-col :span="24">
                <el-card class="box-card">
                    <div slot="header" class="clearfix custom-card-header">
                        <span style="display: inline-block; padding-top: 8px;">部署项目</span>
                        <el-button
                                icon="el-icon-refresh"
                                type="text"
                                style="float:right; color: #409EFF; font-size: 12px; cursor: pointer;"
                                v-on:click="getDeployList()">
                            刷新
                        </el-button>
                    </div>

                    <el-table
                            :data="projects"
                            style="width: 100%"
                            max-height="350">
                        <el-table-column
                                prop="name"
                                label="项目名称">
                        </el-table-column>

                        <el-table-column
                                prop="path"
                                label="路径">
                        </el-table-column>

                        <el-table-column
                                fixed="right"
                                label="操作"
                                width="100">
                            <template slot-scope="scope">
                                <el-button v-on:click="deploy(scope.row)" type="text" size="small">部署
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <span style="font-size: 12px; display: block; padding-top: 15px;" v-bind="selectedServer">
                        部署项目至目标服务器：<em>{{selectedServer}}</em>，请将项目拷贝到指定目录下: <em>/eagle/{{rootPath}}</em>
                    </span>
                </el-card>
            </el-col>
        </el-row>
    </d2-container>
</template>

<style lang="scss" scoped>
    @import '~@/assets/style/public.scss';

    .el-upload__tip {
        margin-top: 0;
    }

    .el-row {
        margin-bottom: 20px;
        & :last-child {
            margin-bottom: 0;
        }
    }

    .text {
        font-size: 14px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
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

    em {
        color: $color-primary;
    }
</style>

<script>
    import {ProjectList, VersionList, DelVersion, DelProject} from '@/api/scrapyd-api/v1_2_0';
    import {GetProjectPath, DoDeploy} from '@/api/backend-api/deploy';
    import Store from '../store';

    export default {
        name: "projects",
        methods: {
            // get project list
            getProjectList() {
                ProjectList({
                    server: this.selectedServer
                }).then(res => {
                    this.projectData = [];
                    for (const i in res.projects) {
                        this.projectData.push({
                            index: i,
                            projects: res.projects[i],
                        });
                    }
                }).catch(err => {
                    this.$message({message: err, type: 'error'});
                }).finally(() => {
                    this.loading = false;
                });
            },

            // go to '/spider/overview/:project_name'
            checkSpiders(row) {
                this.$router.push({
                    path: `/spider/overview/${row.projects}`
                });
            },

            // go to '/spider/jobs/:project_name'
            checkJobs(row) {
                this.$router.push({path: `/spider/jobs/${row.projects}`});
            },

            // call DelProject API
            doDelProject(name) {
                return DelProject({
                    server: this.selectedServer,
                    project: name
                });
            },

            // delete project with confirm info
            delProject(row) {
                this.$confirm(`此操作将永久删除该项目: ${row.projects}, 是否继续?`, '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',

                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '删除中...';

                            this.doDelProject(row.projects).then(res => {
                                // delete success
                                if (res.status === 'ok') {
                                    this.$message({
                                        message: `project ${row.projects} deleted`,
                                        type: 'success'
                                    });

                                    this.projectData.splice(row.index, 1);
                                } else if (res.status === 'error') {
                                    // delete failed
                                    this.$message({
                                        message: `${res.message}`,
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

            requestVersionList() {
                if (!this.selectedServer || !this.selectedProject) {
                    this.$message({message: '目标服务器未选定, 或未选择查看项目'});
                    return;
                }

                VersionList({
                    server: this.selectedServer,
                    project: this.selectedProject
                }).then(res => {
                    this.versionData = [];
                    for (const i in res.versions) {
                        this.versionData.push({
                            index: i,
                            version: res.versions[i]
                        })
                    }

                    // remove project from this.projectData if no more versions for the selected project
                    // and reset this.selectedProject
                    if (this.versionData.length === 0) {
                        this.projectData.splice(this.projectData.indexOf(this.selectedProject), 1);
                        this.selectedProject = '';
                    } else {
                        this.versionData.reverse();
                    }
                }).catch(err => {
                    console.error(err);
                })
            },

            // get the version list for the selected project
            checkVersion(row) {
                this.selectedProject = row.projects;
                this.requestVersionList();
            },

            // delete version with confirm info
            deleteVersion(row) {
                this.$confirm(`此操作将永久删除项目: ${this.selectedProject} 的 [${row.version}] 版本, 是否继续?`, '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',

                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '删除中...';

                            DelVersion({
                                server: this.selectedServer,
                                project: this.selectedProject,
                                version: row.version
                            }).then(res => {
                                // delete success
                                if (res.status === 'ok') {
                                    this.$message({
                                        message: `version ${row.version} deleted`,
                                        type: 'success'
                                    });

                                    this.requestVersionList();
                                } else {
                                    // delete failed
                                    this.$message({
                                        message: `version ${row.version} deleted failed, message: ${res.message}`,
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

            // reset this.selectedProject = ''
            resetSelectedProject() {
                this.selectedProject = '';
            },

            getDeployList() {
                GetProjectPath(this.rootPath).then(res => {
                    if (res.msg === 'success') {
                        this.projects = [];
                        for (let pro in res.paths) {
                            this.projects.push({
                                name: pro,
                                path: res.paths[pro]
                            })
                        }
                    }
                }).catch(err => {
                    this.$message({message: err, type: 'error'});
                });
            },

            deploy(row) {
                this.$confirm(`将项目${row.name}部署至${this.selectedServer}, 是否继续?`, '提示', {
                    confirmButtonText: '部署',
                    cancelButtonText: '取消',
                    type: 'warning',

                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '部署中...';

                            DoDeploy({
                                path: row.path,
                                project: row.name,
                                target: this.selectedServer
                            }).then(res => {
                                if (res.msg === 'success' && res.deploy_result.status === 'ok') {
                                    this.$message({message: '部署成功', type: 'success'});
                                    this.getProjectList();
                                } else {
                                    this.$message({message: res.msg, type: 'error'})
                                }
                            }).catch(err => {
                                this.$message({message: err, type: 'error'});
                            }).finally(() => {
                                done();
                                instance.confirmButtonLoading = false;
                            })
                        } else {
                            done();
                            instance.confirmButtonLoading = false;
                        }
                    }
                })
            }
        },

        data() {
            return {
                // isNotSupportFileReader: (typeof FileReader) === 'undefined',
                rootPath: 'scrapy-project/',
                projects: [],

                selectedServer: Store.getServer(),
                selectedProject: '',
                versionData: [],
                projectData: [],
                loading: true,
            }
        },

        mounted() {
            this.selectedServer = Store.getServer();
            this.getProjectList();
            this.getDeployList();
        }
    }
</script>