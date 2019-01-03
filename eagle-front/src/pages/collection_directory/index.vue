<template>
    <d2-container>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>常用的采集目录管理</span>
                        <el-button style="float: right;"
                                   icon="el-icon-plus"
                                   round size="mini"
                                   @click="dialogVisible = true; addOrEdit='add';"
                                   type="primary">
                            添加采集站点
                        </el-button>
                    </div>

                    <el-table
                            :data="tableData"
                            style="width: 100%; margin-bottom: 20px;">
                        <el-table-column
                                prop="name"
                                label="名称"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="first_url"
                                label="首页URL"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="log_url"
                                label="登录URL"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="desc"
                                label="描述"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="operate"
                                label="操作"
                        >
                            <template slot-scope="scope">
                                <el-button
                                        v-on:click="editServer(scope.row)"
                                        type="text"
                                        icon="el-icon-edit"
                                        size="small">
                                    编辑
                                </el-button>
                                <el-button
                                        v-on:click="delServer(scope.row)"
                                        type="text"
                                        icon="el-icon-delete"
                                        size="small">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

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
            </el-col>
        </el-row>
        <el-dialog
                title="添加一个采集站点"
                :visible.sync="dialogVisible"
                width="40"
                :before-close="handleClose">
            <el-form
                    ref="from"
                    v-model="newCollectionData"
                    label-width="100px">
                <el-input v-model="newCollectionData.id" type="hidden"/>
                <el-form-item label="名称">
                    <el-input v-model="newCollectionData.name" size="small"/>
                </el-form-item>
                <el-form-item label="首页URL">
                    <el-input v-model="newCollectionData.first_url" size="small"/>
                </el-form-item>
                <el-form-item label="登录URL">
                    <el-input v-model="newCollectionData.log_url" size="small"/>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="newCollectionData.desc" size="small" type="textarea"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="el-dialog__footer">
                <el-button
                v-on:click="dialogVisible=false; doEdit()">添加</el-button>
                <el-button @click="dialogVisible=false">取消</el-button>
            </span>
        </el-dialog>
    </d2-container>
</template>

<script>
    export default {
        name: 'collection_directory',
        data() {
            return {
                currentPage:1,
                pageSize: 20,
                total: 5,
                activeNames:[],
                pageData: [],
                dialogVisible: false,
                addOrEdit: 'add',
                newCollectionData: {
                    id: undefined,
                    name: '',
                    first_url: '',
                    log_url: '',
                    desc: '',
                },
                tableData: [
                    {
                        id: 1,
                        name: '新浪1',
                        first_url: 'https://m.weib235o.cn',
                        log_url: 'https://passport.weibo.cn/signin/login',
                        desc: '哈哈哈哈哈235'
                    },
                    {
                        id: 2,
                        name: '新浪2',
                        first_url: 'https://m.wei3426bo.cn',
                        log_url: 'https://passport.weibo.cn/signin/login',
                        desc: '哈哈哈哈哈325'
                    }, {
                        id: 3,
                        name: '新浪124',
                        first_url: 'https://m.weib54645o.cn',
                        log_url: 'https://passport.weibo.cn/signin/login',
                        desc: '哈哈哈哈哈234'
                    }, {
                        id: 4,
                        name: '新浪124',
                        first_url: 'https://m.we5654ibo.cn',
                        log_url: 'https://passport.weibo.cn/signin/login',
                        desc: '哈哈哈哈哈214'
                    }, {
                        id: 5,
                        name: '新浪435',
                        first_url: 'https://www.baidu.com',
                        log_url: 'https://passport.weibo.cn/signin/login',
                        desc: '哈哈哈哈哈435'
                    },
                ]
            }
        },
        methods: {
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            delServer(row) {
                this.$confirm(`是否删除采集点【${row.name}:${row.first_url}】?`, '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'info',
                }).then(() => {
                    this.$message({message: '采集点已删除', type: 'success'});
                }).catch(err => {
                    this.$message('取消删除');
                });
            },
            onEditServer(row) {
                this.newCollectionData.id = row.id;
                this.newCollectionData.name = row.name;
                this.newCollectionData.first_url = row.first_url;
                this.newCollectionData.log_url = row.log_url;
                this.newCollectionData.desc = row.desc;

                this.addOrEdit = 'edit';
                this.dialogVisible = true;
            },
            doEdit(){
                this.$message({message: '采集点已添加', type: 'success'});
            },
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

        }
    }

</script>