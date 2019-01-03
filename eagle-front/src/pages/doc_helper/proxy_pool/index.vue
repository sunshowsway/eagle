<template>
    <d2-container>
        <d2-markdown :source="doc"/>
    </d2-container>
</template>

<script>
    import doc from '../md/proxy-pool.md'

    export default {
        name: "doc_helper-proxy_pool",
        data() {
            return {
                doc
            }
        }
    }
</script>

<style scoped>

</style>