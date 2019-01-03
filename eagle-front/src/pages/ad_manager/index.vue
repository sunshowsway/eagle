<template>
    <d2-container>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>广告过滤规则库</span>
                        <el-button
                                icon="el-icon-plus"
                                round
                                size="small"
                                type="primary"
                                @click="centerDialogVisible = true"
                                style="float: right">
                            <span id="btn_1">添加一个新的过滤列表</span>
                        </el-button>
                        <el-dialog
                                title="添加过滤列表"
                                :visible.sync="centerDialogVisible"
                                width="40"
                                :before-close="handleClose"
                                center
                        >
                            <el-form
                                    ref="from"
                                    :model="tableData"
                                    label-width="200px"
                            >
                                <el-input v-model="tableData.id" type="hidden"/>
                                <el-form-item label="网站：">
                                    <el-input :model="tableData.net_url"></el-input>
                                </el-form-item>
                                <el-form-item label="来源：">
                                    <el-input :model="tableData.source_url"></el-input>
                                </el-form-item>
                                <el-form-item label="上传过滤规则文件">
                                    <el-upload
                                            class="upload_1"
                                            action="https://jsonplaceholder.typicode.com/posts/"
                                            :on-preview="handlePreview"
                                            :on-remove="handleRemove"
                                            :before-remove="beforeRemove"
                                            multiple
                                            :limit="5"
                                            :on-exceed="handleExceed"
                                            :fileList="fileList"
                                    >
                                        <el-button
                                                icon="el-icon-plus"
                                                circle
                                                type="primary"
                                                size="small"></el-button>
                                    </el-upload>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="el-dialog__footer">
                <el-button
                        v-on:click="centerDialogVisible=false; doEdit()">添加</el-button>
                <el-button @click="centerDialogVisible=false">取消</el-button>
            </span>


                        </el-dialog>


                        <br/><br/>
                        <el-button
                                style="float: right; "
                                type="text"
                                size="small"
                                v-on:click="go_fresh_all(tableData)">
                            <span id="btn_2">更新所有过滤列表</span>
                        </el-button>
                        <br/>
                    </div>
                    <el-table
                            :data="tableData"
                            style="width: 100%">
                        <el-table-column
                                prop="filter_list"
                                label="过滤列表"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="fresh_time"
                                label="更新时间"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="operate"
                                label="操作"
                                width="240"
                                fixed="right"
                        >
                            <template slot-scope="scope">
                                <el-button
                                        v-on:click="go_net(scope.row)"
                                        type="text"
                                        icon="el-icon-view"
                                        size="small">
                                    网站
                                </el-button>
                                <el-button
                                        v-on:click="go_source(scope.row)"
                                        type="text"
                                        icon="el-icon-document"
                                        size="small">
                                    来源
                                </el-button>
                                <el-button
                                        v-on:click="go_fresh(scope.row)"
                                        type="text"
                                        icon="el-icon-refresh"
                                        size="small">
                                    更新
                                </el-button>
                                <el-button
                                        v-on:click="go_delete(scope.row)"
                                        type="text"
                                        icon="el-icon-delete"
                                        size="small">
                                    移除
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
        name: "ad_manager",
        data() {
            return {
                fileList: [],
                centerDialogVisible: false,
                tableData: [
                    {
                        id: 1,
                        filter_list: 'EasyList China+EasyList',
                        fresh_time: '几小时以前',
                        net_url: 'http://abpchina.org/forum/forum.php',
                        source_url: 'https://easylist-downloads.adblockplus.org/easylistchina+easylist.txt',
                    },
                    {
                        id: 2,
                        filter_list: 'CJX\'s Annoyance List',
                        fresh_time: '3天以前',
                        net_url: 'http://abpchina.org/forum/forum.php?mod=viewthread&tid=29667',
                        source_url: 'https://raw.githubusercontent.com/cjx82630/cjxlist/master/cjx-annoyance.txt',
                    },
                    {
                        id: 3,
                        filter_list: 'ABP filters',
                        fresh_time: '4天以前',
                        net_url: 'https://github.com/abp-filters/abp-filters-anti-cv',
                        source_url: 'https://easylist-downloads.adblockplus.org/abp-filters-anti-cv.txt',
                    },
                    {
                        id: 4,
                        filter_list: 'Adblock Warning Removal List',
                        fresh_time: '5天以前',
                        net_url: 'https://easylist.to/',
                        source_url: 'https://easylist-downloads.adblockplus.org/antiadblockfilters.txt',
                    },
                    {
                        id: 5,
                        filter_list: 'Malware Domains',
                        fresh_time: '1小时以前',
                        net_url: 'https://easylist.to/',
                        source_url: 'https://easylist-downloads.adblockplus.org/malwaredomains_full.txt',
                    },
                    {
                        id: 6,
                        filter_list: 'EasyPrivacy',
                        fresh_time: '1小时以前',
                        net_url: 'https://easylist.to/',
                        source_url: 'https://easylist-downloads.adblockplus.org/easyprivacy.txt',
                    },],

            };
        },
        methods: {
            handleClose(done) {
                this.$confirm('确认关闭?')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            doEdit() {
                this.$message({message: '过滤列表已添加', type: 'success'});
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            go_net(row) {
                window.open(row.net_url, '_blank');
            },
            go_source(row) {
                window.open(row.source_url, '_blank');
            },
            go_delete(row) {
                console.log(this.tableData.indexOf(row));
                this.tableData.splice(this.tableData.indexOf(row), 1);

                this.$message({message: `过滤列表 ${row.filter_list} 已删除`, type: 'success'});
            },
            go_fresh(row) {

                let index = this.tableData.indexOf(row);
                setTimeout(() => {
                    this.tableData[index].fresh_time = '刚刚';
                }, 500);

                this.$message({message: `过滤列表 ${row.filter_list} 已更新`, type: 'success'});
            },
            go_fresh_all(tableData) {
                let i = 0;
                for (i; i < tableData.length; i++) {
                    this.$set(this.tableData[i], 'fresh_time', '刚刚')

                }
                this.$message({message: '过滤列表已全部更新完毕', type: 'success'});
            },
        },
    }
</script>

<style scoped>

</style>