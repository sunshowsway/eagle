<template>
    <d2-container>
        <d2-markdown :source="doc"/>
    </d2-container>
</template>

<script>
    import doc from '../md/server-deploy-helper.md'

    export default {
        name: "server_conf",
        data() {
            return {
                doc
            }
        }
    }
</script>

<style scoped>

</style>