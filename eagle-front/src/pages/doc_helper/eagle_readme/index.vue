<template>
    <d2-container>
        <d2-markdown :source="doc"/>
    </d2-container>
</template>

<script>
    import doc from '../md/eagle-readme.md'

    export default {
        name: "doc_helper-eagle_readme",
        data() {
            return {
                doc
            }
        }
    }
</script>

<style scoped>

</style>