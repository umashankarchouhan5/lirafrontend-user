<template>
    <a :class="$style.document" v-if="row.document_file" target="_blank" :href="row.document_file">
        {{ row.TranslationFile }}
        <Icon type="md-eye" />
    </a>
</template>

<script>
    export default {
        name: "documentCell",
        props: {
            row: Object,
        }
    }
</script>

<style lang="scss" module>
    .document {
        display: flex;
        align-items: center;
        :global {
            .ivu-icon {
                font-size: 19px;
                margin-left: 4px;
            }
        }
    }
</style>
