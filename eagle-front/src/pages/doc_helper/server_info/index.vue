<template>
    <d2-container>
        <d2-markdown :source="doc"/>
    </d2-container>
</template>

<script>
    import doc from '../md/server-overview.md'

    export default {
        name: "doc_helper-server_info",
        data() {
            return {
                doc
            }
        }
    }
</script>

<style scoped>

</style>