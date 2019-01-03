<template>
    <d2-container>
        <d2-markdown :source="doc"/>
    </d2-container>
</template>

<script>
    import doc from '../md/conf.md'

    export default {
        name: "others_conf",
        data() {
            return {
                doc
            }
        }
    }
</script>

<style scoped>

</style>