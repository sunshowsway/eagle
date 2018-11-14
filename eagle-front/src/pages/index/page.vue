<template>
    <d2-container class="page">

        <h2>The Load Status of a Service</h2>

        <div class="custom_helper_info" v-if="helperInfoVisible">
            <p>
                to check the load status of a service
            </p>
            <el-button icon="el-icon-close" circle size="mini" v-on:click="CloseHelperInfo"/>
        </div>

        <div style="display: block; font-size: 12px; margin: 15px 0;">
            <span><em>node name: {{daemonstatus.node_name}}</em></span>
            <span v-on:click="Refresh" style="color: #409EFF; cursor:pointer; margin-left: 20px;">Refresh</span>
        </div>

        <el-row :gutter="20">
            <el-col :span="4">
                <div class="grid-content custom-badge">
                    <span class="running">Running</span>
                    <span>{{daemonstatus.running}}</span>
                </div>
            </el-col>

            <el-col :span="4">
                <div class="grid-content custom-badge">
                    <span class="pending">Pending</span>
                    <span>{{daemonstatus.pending}}</span>
                </div>
            </el-col>

            <el-col :span="4">
                <div class="grid-content custom-badge">
                    <span class="finished">finished</span>
                    <span>{{daemonstatus.finished}}</span>
                </div>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
    import {DaemonStatus} from '@/api/scrapyd-api/v1_2_0';

    export default {
        methods: {
            CloseHelperInfo() {
                this.helperInfoVisible = !this.helperInfoVisible;
            },
            serverStatus() {
                DaemonStatus().then(res => {
                    this.daemonstatus = res;
                    this.$message({message: 'service status refreshed.', type: 'success'});
                }).catch(err => {

                }).finally(() => {

                })
            }
        },
        data() {
            return {
                helperInfoVisible: true,
                daemonstatus: {
                    node_name: 'fetching',
                    running: '',
                    pending: '',
                    finished: '',
                    status: ''
                }
            }
        },

        mounted() {
            this.Refresh();
        }
    }
</script>

<style lang="scss" scoped>
    @import '~@/assets/style/public.scss';

    .custom_helper_info {
        background-color: $color-bg;
        padding: 5px 10px;
        border: 1px solid $color-border-1;
        border-radius: 5px;
        position: relative;
        p {
            padding-left: 15px;
            font-size: 14px;
            color: $color-text-normal;
            display: inline-block;
        }
        .el-button {
            position: absolute;
            top: 0;
            right: 0;
            margin: 10px 10px 0 0;
        }
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .custom-badge {
        border: 1px solid $color-border-1;
        padding: 10px;
        position: relative;
        .running {
            color: $color-success;
        }
        .pending {
            color: $color-warning;
        }
        .finished {
            color: $color-primary;
        }
        span {
            text-align: center;
            display: inline-block;
            padding: 10px 0;
            width: 30%;
            &:first-child {
                border-right: 1px solid $color-border-1;
                font-weight: bolder;
                width: 60%;
            }
            &:last-child {
                left: 200px;
            }
        }
    }
</style>
