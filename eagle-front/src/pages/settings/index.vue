<template>
    <d2-container>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>爬虫的通用配置</span>
                        <el-tooltip class="item" effect="light" content="该配置会在部署项目时生效. 将项目中的 settings.py 内容替换成如下配置."
                                    placement="right">
                            <i class="el-icon-info custom-helper-info"></i>
                        </el-tooltip>

                        <el-button type="text" size="mini" style="float: right;" v-on:click="collapseSpiderConfig()">
                            折叠/展开
                        </el-button>
                    </div>

                    <div v-if="spiderConfigVisible">
                        <el-form
                                style="position: relative;"
                                ref="form"
                                v-model="spiderCommonConfig"
                                size="mini"
                                label-position="right"
                                label-width="180px">

                            <el-form-item label="bot名称">
                                <el-input style="width: 200px;"
                                          v-model="spiderCommonConfig.bot_name"></el-input>
                            </el-form-item>

                            <el-form-item label="Item Pipeline并行处理数量">
                                <el-input-number v-model="spiderCommonConfig.concurrent_items"
                                                 :min="50"
                                                 :step="50"
                                                 :max="1000">
                                </el-input-number>
                            </el-form-item>

                            <el-form-item label="Downloader并发量">
                                <el-input-number v-model="spiderCommonConfig.concurrent_requests"
                                                 :min="4"
                                                 :step="4"
                                                 :max="40">
                                </el-input-number>
                            </el-form-item>


                            <el-form-item label="Downloader并发控制策略">
                                <el-radio-group v-model="spiderCommonConfig.concurrent_requests_type">
                                    <el-radio border label="按域名控制"></el-radio>
                                    <el-radio border label="按IP控制"></el-radio>
                                </el-radio-group>
                            </el-form-item>

                            <div class="custom-config-sub_panel">
                                <el-form-item label="同一个域名的最大并发"
                                              v-if="spiderCommonConfig.concurrent_requests_type === '按域名控制'">
                                    <el-input-number v-model="spiderCommonConfig.concurrent_requests_per_domain"
                                                     :min="1"
                                                     :max="20">
                                    </el-input-number>
                                </el-form-item>

                                <el-form-item label="同一个IP的最大并发"
                                              v-if="spiderCommonConfig.concurrent_requests_type === '按IP控制'">
                                    <el-input-number v-model="spiderCommonConfig.concurrent_requests_per_ip"
                                                     :min="0"
                                                     :max="20">
                                    </el-input-number>
                                </el-form-item>
                            </div>

                            <el-form-item label="HEADERS-Accept">
                                <el-input type="textarea"
                                          v-model="spiderCommonConfig.default_request_headers.accept"></el-input>
                            </el-form-item>
                            <el-form-item label="HEADERS-语言">
                                <el-input style="width: 200px;"
                                          v-model="spiderCommonConfig.default_request_headers.accept_language"></el-input>
                            </el-form-item>

                            <el-form-item label="站点爬取深度限制">
                                <el-input-number v-model="spiderCommonConfig.depth_limit"
                                                 :min="0"
                                                 :max="50">
                                </el-input-number>
                            </el-form-item>

                            <el-form-item label="深度/广度优先设置">
                                <el-input-number v-model="spiderCommonConfig.depth_priority"
                                                 :min="-50"
                                                 :step="2"
                                                 :max="50">
                                </el-input-number>
                            </el-form-item>

                            <el-form-item label="启用DNS内存缓存">
                                <el-switch v-model="spiderCommonConfig.dnscache_enable"></el-switch>
                            </el-form-item>

                            <div class="custom-config-sub_panel" v-if="spiderCommonConfig.dnscache_enable">
                                <el-form-item label="DNS缓存大小(bytes??)">
                                    <el-input-number v-model="spiderCommonConfig.dnscache_size"
                                                     :min="5000"
                                                     :step="1000"
                                                     :max="100000">
                                    </el-input-number>
                                </el-form-item>

                                <el-form-item label="DNS超时(s)">
                                    <el-input-number v-model="spiderCommonConfig.dns_timeout"
                                                     :min="30"
                                                     :step="15"
                                                     :max="300">
                                    </el-input-number>
                                </el-form-item>
                            </div>

                            <el-form-item label="下载间隔(s)">
                                <el-input-number v-model="spiderCommonConfig.download_delay"
                                                 :min="0"
                                                 :step="0.1"
                                                 :max="300">
                                </el-input-number>
                            </el-form-item>

                            <el-form-item label="下载超时(s)">
                                <el-input-number v-model="spiderCommonConfig.download_timeout"
                                                 :min="60"
                                                 :step="30"
                                                 :max="300">
                                </el-input-number>
                            </el-form-item>

                            <el-form-item label="最大下载量(bytes)">
                                <!--min: 5MB-->
                                <!--step: 2MB-->
                                <!--max: 3GB-->
                                <el-input-number v-model="spiderCommonConfig.downlaod_maxsize"
                                                 style="width: 200px;"
                                                 :min="5 * 1024 * 1024"
                                                 :step="2 * 1024 * 1024"
                                                 :max="3 * 1024 * 1024 * 1024">
                                </el-input-number>
                            </el-form-item>

                            <el-form-item label="下载量警戒(bytes)">
                                <el-input-number style="width: 200px;"
                                                 v-model="spiderCommonConfig.download_warnsize"
                                                 :min="2 * 1024 * 1024"
                                                 :step="2 * 1024 * 1024"
                                                 :max="1024 * 1024 * 1024">
                                </el-input-number>
                            </el-form-item>

                            <el-form-item label="启用Log">
                                <el-switch v-model="spiderCommonConfig.log_enabled"></el-switch>
                            </el-form-item>

                            <div class="custom-config-sub_panel">
                                <el-form-item label="Log级别">
                                    <el-select v-model="spiderCommonConfig.log_level" value="">
                                        <el-option label="CRITICAL" value="CRITICAL"></el-option>
                                        <el-option label="ERROR" value="ERROR"></el-option>
                                        <el-option label="WARNING" value="WARNING"></el-option>
                                        <el-option label="INFO" value="INFO"></el-option>
                                        <el-option label="DEBUG" value="DEBUG"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="Log内容编码">
                                    <el-input style="width: 200px;"
                                              v-model="spiderCommonConfig.log_encoding"></el-input>
                                </el-form-item>
                                <el-form-item label="Log文件名称">
                                    <el-input style="width: 200px;"
                                              v-model="spiderCommonConfig.log_file"></el-input>
                                </el-form-item>
                                <el-form-item label="Log格式">
                                    <el-input v-model="spiderCommonConfig.log_format"></el-input>
                                </el-form-item>
                                <el-form-item label="日期格式">
                                    <el-input style="width: 200px;"
                                              v-model="spiderCommonConfig.log_dateformat"></el-input>
                                </el-form-item>
                            </div>

                            <el-form-item label="其他设置">
                                <el-checkbox label="遵守Robot.txt"
                                             v-model="spiderCommonConfig.robots_text_obey"></el-checkbox>
                                <el-checkbox label="启用Cookies"
                                             v-model="spiderCommonConfig.cookies_enable"></el-checkbox>
                                <el-checkbox label="启用Telnet控制台"
                                             v-model="spiderCommonConfig.telnetconsole_enable"></el-checkbox>
                                <el-checkbox label="数据丢失视为下载失败"
                                             v-model="spiderCommonConfig.download_fail_on_dataloss"></el-checkbox>
                                <el-checkbox label="记录所有重复Request"
                                             v-model="spiderCommonConfig.dupefilter_debug"></el-checkbox>
                                <el-checkbox label="开启日志"
                                             v-model="spiderCommonConfig.log_enabled"></el-checkbox>
                            </el-form-item>
                        </el-form>

                        <div style="float: right; margin-top: 30px;">
                            <el-button type="text" style="margin-right: 15px;" size="small">恢复默认</el-button>
                            <el-button type="primary" size="small">保存</el-button>
                        </div>
                        <div style="clear: both;"></div>
                    </div>

                </el-card>

                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>项目部署检查</span>
                        <el-tooltip class="item" effect="light" content="项目部署前会按照配置的模块路径检查.如果和提供的SHA1/MD5值不一致, 则给出警告."
                                    placement="right">
                            <i class="el-icon-info custom-helper-info"></i>
                        </el-tooltip>
                    </div>

                    <div>
                        <span style="font-size: 14px;">待检查的项目模块路径: </span><br>
                        <el-tag v-for="item in projectCheckingPaths"
                                closable
                                :disable-transitions="false"
                                @close="handleClosePathTag(item.path)"
                                :key="item.path">
                            {{item.path}}
                        </el-tag>
                        <el-input
                                class="input-new-tag"
                                v-if="inputPathVisible"
                                v-model="inputPathValue"
                                ref="saveTagInput"
                                size="small"
                                @blur="handlePathInputConfirm"
                                @keyup.enter.native="handlePathInputConfirm">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showPathInput">+ New Path
                        </el-button>

                        <div style="border-top: 1px solid #e7eaf0">
                            <el-form size="small" style="padding-top: 20px;">
                                <el-form-item label="使用算法:">
                                    <el-radio-group v-model="pathCheckingFunction">
                                        <el-radio border label="SHA1"></el-radio>
                                        <el-radio border label="MD5"></el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-form>
                            <div v-for="item in projectCheckingPaths" class="path-list">
                                <d2-highlight :code="'pattern = \''+item.path+'\''"></d2-highlight>
                                <d2-highlight v-if="pathCheckingFunction === 'SHA1' && item.sha1 !== ''"
                                              :code="'sha1(path) = ' + item.sha1"></d2-highlight>
                                <d2-highlight v-if="pathCheckingFunction === 'MD5' && item.md5 !== ''"
                                              :code="'md5(path) = ' + item.md5"></d2-highlight>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card class="box-card custom-nopadding-cardbody">
                    <div slot="header" class="clearfix">
                        <span>数据库配置</span>
                    </div>

                    <div style="padding: 20px;">
                        <div class="el-form-item">
                            <div class="el-form-item__content">
                                <el-form
                                        ref="form"
                                        size="small"
                                        v-model="databaseConfig"
                                        label-width="120px">

                                    <el-form-item label="Data Source">
                                        <el-select v-model="databaseConfig.name" value="">
                                            <el-option label="MySQL" value="MySQL"></el-option>
                                            <el-option label="Redis" value="Redis"></el-option>
                                            <el-option label="Oracle" value="WARNING"></el-option>
                                            <el-option label="PostgreSQL" value="PostgreSQL"></el-option>
                                            <el-option label="sqlite" value="sqlite"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="地址">
                                        <el-input v-model="databaseConfig.ip" placeholder="ip地址"
                                                  size="small"></el-input>
                                    </el-form-item>

                                    <el-form-item label="端口">
                                        <el-input v-model="databaseConfig.port" placeholder="端口号"
                                                  size="small"></el-input>
                                    </el-form-item>

                                    <el-form-item label="用户名">
                                        <el-input v-model="databaseConfig.username" placeholder="用户名"
                                                  size="small"></el-input>
                                    </el-form-item>

                                    <el-form-item label="密码">
                                        <el-input v-model="databaseConfig.password" placeholder="密码" size="small"
                                                  type="password"></el-input>
                                    </el-form-item>

                                    <el-form-item label="数据库">
                                        <el-input v-model="databaseConfig.database" placeholder="数据库"
                                                  size="small"></el-input>
                                    </el-form-item>
                                    <el-form-item label="字符集">
                                        <el-input v-model="databaseConfig.charset" placeholder="字符集"
                                                  size="small"></el-input>
                                    </el-form-item>
                                </el-form>

                                <el-button size="small" type="primary" style="margin-top:20px; float: right;">确定
                                </el-button>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
    export default {
        name: 'settings',
        data() {
            return {
                spiderConfigVisible: false,
                projectCheckingPaths: [
                    {
                        path: '/[\w]+/pipelines.py',
                        md5: 'D9710ED0898A43D5369EF4DB3907E155',
                        sha1: '297e4e84b412adfcdb6d441dca53e10c1fae5db8',
                    }, {
                        path: '/[\w]+/middlewares.py',
                        md5: 'a9fde8c084d6165419a07893a1d0d9b3',
                        sha1: '5649db45de5afcfbe7cfc1ed2f44879af7b1e85a',
                    }
                ],
                inputPathVisible: false,
                inputPathValue: '',
                pathCheckingFunction: 'MD5',

                databaseConfig: {
                    name: 'MySQL',
                    ip: '',
                    port: '',
                    username: '',
                    password: '',
                    database: '',
                    charset: '',
                },

                spiderCommonConfig: {
                    bot_name: 'scrapybot',
                    // Maximum number of concurrent items (per response) to process in parallel in the Item Processor
                    // (also known as the Item Pipeline).
                    concurrent_items: 100,
                    // The maximum number of concurrent (ie. simultaneous) requests that will be performed by the
                    // Scrapy downloader.
                    concurrent_requests: 16,
                    // The download delay setting will honor only one of:
                    // CONCURRENT_REQUESTS_PER_DOMAIN
                    // CONCURRENT_REQUESTS_PER_IP
                    concurrent_requests_type: '按域名控制',
                    // The maximum number of concurrent (ie. simultaneous) requests that will be performed to any
                    // single domain.
                    concurrent_requests_per_domain: 8,
                    // The maximum number of concurrent (ie. simultaneous) requests that will be performed to any
                    // single IP. If non-zero, the CONCURRENT_REQUESTS_PER_DOMAIN setting is ignored, and this one
                    // is used instead. In other words, concurrency limits will be applied per IP, not per domain.
                    //
                    // This setting also affects DOWNLOAD_DELAY and AutoThrottle extension: if
                    // CONCURRENT_REQUESTS_PER_IP is non-zero, download delay is enforced per IP, not per domain.
                    concurrent_requests_per_ip: 0,
                    // The default headers used for Scrapy HTTP Requests.
                    // They’re populated in the 'DefaultHeadersMiddleware'.
                    default_request_headers: {
                        // ex: 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        // ex: 'Accept-language': 'en
                        accept_language: 'en'
                    },
                    // The maximum depth that will be allowed to crawl for any site. If zero, no limit will be imposed.
                    // Scope: 'scrapy.spidermiddlewares.depth.DepthMiddleware'
                    depth_limit: 0,
                    // An integer that is used to adjust the request priority based on its depth:
                    //
                    // if zero (default), no priority adjustment is made from depth
                    // a positive value will decrease the priority, i.e. higher depth requests will be processed later ; this is commonly used when doing breadth-first crawls (BFO)
                    // a negative value will increase priority, i.e., higher depth requests will be processed sooner (DFO)
                    depth_priority: 0,
                    dnscache_enable: true,
                    dnscache_size: 10000,
                    dns_timeout: 60,
                    // The amount of time (in secs) that the downloader should wait before downloading consecutive
                    // pages from the same website. This can be used to throttle the crawling speed to avoid hitting
                    // servers too hard. Decimal numbers are supported. Example:
                    //
                    // DOWNLOAD_DELAY = 0.25    # 250 ms of delay
                    // Default: 0(s)
                    //
                    // This setting is also affected by the RANDOMIZE_DOWNLOAD_DELAY setting (which is enabled by
                    // default). By default, Scrapy doesn’t wait a fixed amount of time between requests, but uses
                    // a random interval between 0.5 * DOWNLOAD_DELAY and 1.5 * DOWNLOAD_DELAY.
                    //
                    // When CONCURRENT_REQUESTS_PER_IP is non-zero, delays are enforced per ip address instead of
                    // per domain.
                    //
                    // You can also change this setting per spider by setting download_delay spider attribute.
                    download_delay: 0,
                    // The amount of time (in secs) that the downloader will wait before timing out.
                    download_timeout: 180,
                    // The maximum response size (in bytes) that downloader will download.
                    // If you want to disable it set to 0.
                    downlaod_maxsize: 1073741824,
                    // The response size (in bytes) that downloader will start to warn.
                    // If you want to disable it set to 0.
                    download_warnsize: 33554432,
                    // Whether or not to fail on broken responses, that is, declared Content-Length does not match
                    // content sent by the server or chunked response was not properly finish. If True, these responses
                    // raise a ResponseFailed([_DataLoss]) error. If False, these responses are passed through and the
                    // flag dataloss is added to the response, i.e.: 'dataloss' in response.flags is True.
                    //
                    // Optionally, this can be set per-request basis by using the download_fail_on_dataloss Request.
                    // meta key to False.
                    //
                    // Note:
                    // A broken response, or data loss error, may happen under several circumstances, from server
                    // misconfiguration to network errors to data corruption. It is up to the user to decide if it
                    // makes sense to process broken responses considering they may contain partial or incomplete
                    // content. If RETRY_ENABLED is True and this setting is set to True, the
                    // ResponseFailed([_DataLoss]) failure will be retried as usual.
                    download_fail_on_dataloss: true,
                    // By default, RFPDupeFilter only logs the first duplicate request. Setting DUPEFILTER_DEBUG to
                    // True will make it log all duplicate requests.
                    dupefilter_debug: false,
                    // Whether to enable logging.
                    log_enabled: true,
                    // The encoding to use for logging.
                    log_encoding: 'utf-8',
                    // File name to use for logging output. If None, standard error will be used.
                    log_file: '',
                    // Default: '%(asctime)s [%(name)s] %(levelname)s: %(message)s'
                    // String for formatting log messsages. Refer to the Python logging documentation for the whole
                    // list of available placeholders.
                    log_format: '%(asctime)s [%(name)s] %(levelname)s: %(message)s',
                    // String for formatting date/time, expansion of the %(asctime)s placeholder in LOG_FORMAT.
                    // Refer to the Python datetime documentation for the whole list of available directives.
                    log_dateformat: '%Y-%m-%d %H:%M:%S',
                    // Minimum level to log. Available levels are: CRITICAL, ERROR, WARNING, INFO, DEBUG.
                    // For more info see [Logging](https://doc.scrapy.org/en/latest/topics/logging.html#topics-logging).
                    log_level: 'DEBUG',

                    user_agent: [],
                    // Obey robots.txt rules
                    robots_text_obey: false,
                    cookies_enable: true,
                    telnetconsole_enable: true,


                }
            };
        },

        methods: {
            collapseSpiderConfig() {
                this.spiderConfigVisible = !this.spiderConfigVisible;
            },

            handleClosePathTag(path) {
                this.projectCheckingPaths.splice(this.projectCheckingPaths.indexOf(path), 1);
            },

            handlePathInputConfirm() {
                let inputPathValue = this.inputPathValue;
                if (inputPathValue) {
                    this.projectCheckingPaths.push(inputPathValue);
                }
                this.inputPathVisible = false;
                this.inputPathValue = '';
            },

            showPathInput() {
                this.inputPathVisible = true;
                this.$nextTick(() => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .path-list {
        font-size: 14px;
        line-height: 20px;
        pre {
            padding-bottom: 0;
            display: block;
            &:last-child {
                margin-bottom: 15px;
            }
        }
    }

    .custom-helper-info {
        margin-left: 10px;
        color: #909399;
        cursor: pointer;
    }

    .el-tag + .el-tag {
        margin: 10px;
    }

    .el-tag:first-child,
    .input-new-tag:first-child {
        margin-left: 0;
    }

    .input-new-tag {
        width: 150px;
        margin: 10px;
        vertical-align: bottom;
    }

    .box-card {
        margin-bottom: 20px;
    }

    .custom-nopadding-cardbody > .el-card__body {
        padding: 0;
    }

    .custom-config-sub_panel {
        padding-top: 15px;
        margin: 0 0 15px 180px;
        border: 1px dashed #e7eaf0;
        background: #f1f4fa;
        border-radius: 4px;
    }
</style>
