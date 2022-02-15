<template>
    <a :class="$style.document" v-if="row.document_file" title="View translation file" target="_blank" :href="row.document_file">
        <Icon type="md-eye" />
    </a>
</template>

<script>
    export default {
        name: "actionCell",
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
