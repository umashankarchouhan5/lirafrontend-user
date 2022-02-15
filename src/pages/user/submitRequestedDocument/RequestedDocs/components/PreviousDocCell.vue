<template>
    <div >
        <a target="_blank" :href="row.originalDocument" v-if="row.originalDocument" :class="$style.view">
            <Icon type="md-eye" :class="$style.eye" />
            View
        </a>
    </div>
</template>

<script>


    export default {
        name: "PreviousDocCell",
        data() {
            return {
                
            }
        },
        props: {
            row: Object,
        },
    }
</script>

<style lang="scss" module>
    .eye{
        font-size: 17px;
    }
    .view {
        text-align: left;
        margin-left: auto;
        margin-right: 5px;
        display: inline-block;
        vertical-align: middle;
    }
</style>