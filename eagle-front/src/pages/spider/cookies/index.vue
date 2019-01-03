<template>
    <d2-container>

        <el-row :gutter="20">
            <el-col :span="16">
                <el-card>
                    <h2>COOKIES列表</h2>

                    <el-collapse v-model="activePos" accordion>
                        <el-collapse-item name="weibo-collapse">
                            <template slot="title">
                                <img src="./img/weibo.svg"
                                     style="width: 30px; position: relative; padding-right: 8px;">
                                <span>微博账户cookies</span>
                            </template>

                            <div style="border-top: 1px solid #eceff5; padding: 15px;">
                                <el-button size="mini"
                                           round
                                           @click="addWeiboCookiesDialogVisible = true"
                                           icon="el-icon-plus">添加
                                </el-button>

                                <el-table
                                        style="width: 100%;"
                                        :data="weiboCookiesData">
                                    <el-table-column
                                            label="用户名"
                                            prop="username">
                                    </el-table-column>

                                    <el-table-column
                                            label="密码"
                                            prop="password">
                                    </el-table-column>

                                    <el-table-column
                                            label="创建时间"
                                            prop="time">
                                    </el-table-column>

                                    <el-table-column type="expand">
                                        <template slot-scope="props">
                                            <el-form label-position="left" inline class="custom-table-expand">
                                                <el-form-item label="cookie">
                                                    <span class="code-preview">{{props.row.cookie}}</span>
                                                </el-form-item>
                                                <el-button type="info" round icon="el-icon-tickets" size="mini">复制
                                                </el-button>
                                            </el-form>
                                        </template>
                                    </el-table-column>

                                </el-table>
                            </div>


                        </el-collapse-item>

                        <el-collapse-item name="wechat-collapse">
                            <template slot="title">
                                <img src="./img/wechat.svg"
                                     style="width: 30px; position: relative; padding-right: 8px;">
                                <span>微信账户cookies</span>
                            </template>

                            <div style="border-top: 1px solid #eceff5; padding: 15px;">
                                <el-button size="mini"
                                           round
                                           @click="addWeChatCookiesDialogVisible = true"
                                           icon="el-icon-plus">添加
                                </el-button>

                                <el-table
                                        style="width: 100%;"
                                        :data="wechatCookiesData">
                                    <el-table-column
                                            label="用户名"
                                            prop="username">
                                    </el-table-column>

                                    <el-table-column
                                            label="密码"
                                            prop="password">
                                    </el-table-column>

                                    <el-table-column
                                            label="创建时间"
                                            prop="time">
                                    </el-table-column>

                                    <el-table-column type="expand">
                                        <template slot-scope="props">
                                            <el-form label-position="left" inline class="custom-table-expand">
                                                <el-form-item label="cookie">
                                                    <!--<d2-highlight :code="wechatCookiesData.cookie"></d2-highlight>-->
                                                    <!--<d2-highlight :code="props.row.cookie"></d2-highlight>-->
                                                    <span class="code-preview">{{props.row.cookie}}</span>
                                                </el-form-item>
                                                <el-button type="info" round icon="el-icon-tickets" size="mini" v-on:click="copyCookie()">复制
                                                </el-button>
                                            </el-form>
                                        </template>
                                    </el-table-column>

                                </el-table>
                            </div>

                        </el-collapse-item>
                    </el-collapse>
                </el-card>
            </el-col>

            <el-col :span="8">
                <div style="padding: 18px 5px;">
                    <span>站点登陆url</span>
                    <el-button type="text" style="float: right; padding: 3px 0;" icon="el-icon-plus"
                               @click="editSiteURLDialogVisible = true">添加
                    </el-button>
                </div>


                <el-card>
                    <div class="custom-site-item">
                        <div class="site-header">
                            <img src="./img/weibo.svg" width="20px">
                            <span>微博</span>
                            <a href="https://m.weibo.cn/" target="_blank">https://m.weibo.cn/ <i class="fa fa-external-link"></i></a>
                        </div>

                        <p>
                            登陆url(点击复制)<br>
                            <i v-on:click="copyUrl()">https://passport.weibo.cn/signin/login</i>
                        </p>
                    </div>
                </el-card>

                <el-card>
                    <div class="custom-site-item">
                        <div class="site-header">
                            <img src="./img/wechat.svg" width="20px">
                            <span>微信公众号</span>
                            <a href="https://m.weibo.cn/" target="_blank">https://weixin.sogou.com/ <i class="fa fa-external-link"></i></a>
                        </div>
                        <p>
                            登陆url(点击复制)<br>
                            <i v-on:click="copyUrl()" style="word-break: break-word">https://open.weixin.qq.com/connect/qrconnect?appid=wx6634d697e8cc0a29&scope=snsapi_login&response_type=code&redirect_uri=https%3A%2F%2Faccount.sogou.com%2Fconnect%2Fcallback%2Fweixin</i>
                        </p>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog
                title="添加微博账户并生成cookie"
                :visible.sync="addWeiboCookiesDialogVisible"
                width="40%">

            <el-form
                    ref="form"
                    v-model="newWeiboAccount"
                    :visible.sync="addWeiboCookiesDialogVisible"
                    label-width="100px">
                <el-form-item label="登陆账户">
                    <el-input v-model="newWeiboAccount.username" size="small"/>
                </el-form-item>
                <el-form-item label="账户密码">
                    <el-input type="password" v-model="newWeiboAccount.password" size="small"/>
                </el-form-item>
            </el-form>


            <span slot="footer" class="dialog-footer">
                <el-button type="primary" v-on:click="addNewWeiboAccount()" size="small">添加</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="添加微信账户并生成cookie"
                :visible.sync="addWeChatCookiesDialogVisible"
                width="40%">
            <div class="custom-center-block">
                <span>登陆微信</span><br>
                <img src="./img/wechat-login.png"><br>
                <span>请使用微信扫描二维码登陆</span>
            </div>
        </el-dialog>

        <el-dialog title="修改站点的登陆url"
                   :visible.sync="editSiteURLDialogVisible"
                   width="40%">
            <el-form
                    ref="form"
                    v-model="newSiteURL"
                    :visible.sync="editSiteURLDialogVisible"
                    label-width="100px">
                <el-form-item label="站点名称">
                    <el-input v-model="newSiteURL.name" size="small"/>
                </el-form-item>
                <el-form-item label="首页URL">
                    <el-input v-model="newSiteURL.index_url" size="small"/>
                </el-form-item>
                <el-form-item label="登陆页URL">
                    <el-input v-model="newSiteURL.login_url" size="small"/>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" v-on:click="addLoginSiteURL()" size="small">添加</el-button>
            </span>
        </el-dialog>
    </d2-container>
</template>

<script>

    function formatDate(now) {
        let month = now.getMonth() + 1;
        let date = now.getDate();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        return month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }

    export default {
        name: "index",
        data() {
            return {
                activePos: ['weibo-collapse', 'weichat-collapse'],
                weiboCookiesData: [],
                wechatCookiesData: [],
                addWeiboCookiesDialogVisible: false,
                addWeChatCookiesDialogVisible: false,
                editSiteURLDialogVisible: false,

                newSiteURL: {
                    name: '',
                    index_url: '',
                    login_url: '',
                },

                newWeiboAccount: {
                    username: '',
                    password: '',
                }
            }
        },

        methods: {
            copyUrl() {
                this.$message({message:'已复制到粘贴板', type:'success'});
            },

            copyCookie() {
                this.$message({message:'已复制到粘贴板', type:'success'});
            },

            getFakeCookiesData() {
                let cookies = [];
                for (let i = 0; i < 6; i++) {
                    cookies.push({
                        username: 'username #' + i,
                        password: 'password for user#' + i,
                        time: formatDate(new Date()),
                        cookie: 'BD_UPN=12314753; BD_CK_SAM=1; H_PS_645EC=c316VfARHGD21CcFR34aba4CjmzDnPttJ82xx6S%2BZ5jNEItMvzz19EdOTCN5RNcH3Gs4%2F4A; BD_HOME=1; BAIDUID=1FD4179FFF43A09CE35F5E95670F2AA7:FG=1; BDUSS=pnY2pQNXRXZmQxRXgxOUJPakQ0VUg4MFZPeFlzbjBUUHVCU25jVi1XVVpHQnRjQVFBQUFBJCQAAAAAAAAAAAEAAABmrJapc2VhbGl1MDIxNwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmL81sZi~NbN2; PSTM=1542687514; H_PS_PSSID=1453_21087_18560_27401_26350_22160; BIDUPSID=F4A8A664CDF3EE8CCF2B7569623A8B06; sug=0; sugstore=0; ORIGIN=2; bdime=0'
                    })
                }
                return cookies;
            },

            initWeiboCookies() {
                this.weiboCookiesData = this.getFakeCookiesData();
            },

            initWeChatCookies() {
                this.editSiteURLDialogVisible = false;
                this.wechatCookiesData = this.getFakeCookiesData();
            },

            addLoginSiteURL() {
                this.$message({message: '添加成功', type: 'success'});
            },

            addNewWeiboAccount() {
                this.addWeiboCookiesDialogVisible = false;
                this.$message({message: '添加成功', type: 'success'});
            },
        },

        mounted() {
            this.initWeiboCookies();
            this.initWeChatCookies();
        }
    }
</script>

<style lang="scss">
    @import '~@/assets/style/public.scss';

    .el-card {
        margin-bottom: 20px;
    }

    .code-preview {
        display: inline-block;
        word-break: break-word;
        font-size: 12px;
        line-height: 17px;
        padding: 10px;
        background: #f8f8f8;
        border-radius: 4px;
        margin-bottom: 10px;
    }

    .custom-table-expand {
        font-size: 0;

        label {
            width: 90px;
            color: #99a9bf;
        }

        .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
        }
    }

    .el-dialog__body {
        padding-bottom: 15px;
        .el-form {
            .el-form-item {
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    .custom-center-block {
        margin: 0 auto;
        text-align: center;
        span {
            font-size: 16px;
            display: inline-block;
            &:first-child {
                padding-bottom: 10px;
            }
            &:last-child {
                padding: 10px 0;
            }
        }
    }

    .el-card__body {
        padding: 10px;
    }

    .custom-site-item {
        span {
            position: relative;
            top: -3px;
            left: 8px;
        }
        a[href] {
            font-size: 12px;
            position: relative;
            top: -3px;
            left: 18px;
        }

        p {
            margin: 0;
            font-size: 12px;
            padding: 10px 0 5px 0;
            i {
                display: inline-block;
                margin-top: 5px;
                cursor: pointer;
            }
            i:hover {
                color: #409EFF;
            }
        }
        .site-header {
            padding: 0 10px 8px 10px;
            border-bottom: 1px solid #ebeff5;
        }
    }
</style>