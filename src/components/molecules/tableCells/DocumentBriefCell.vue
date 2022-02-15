<template>
    <div>
        <div :class="$style.brief" v-if="!row.isSaved">
            <InputText @focusout="onChangeHandler" :class="$style.input" :value="row.documentBrief" :readonly="readonly" />
            <div :class="$style.error" v-if="row.errors.indexOf('brief') !== -1">
                Add document brief
            </div>
            <br />
        </div>
        <div :class="$style.brief" v-else>
            <span :class="$style.brief" >
                {{ row.documentBrief }}
            </span>
        </div>
    </div>
</template>

<script>

    export default {
        name: "BriefCell",
        data() {
            return {
                brief: this.row.documentBrief
            }
        },
        props: {
            row: Object,
            readonly: Boolean,
            canEdit: Boolean,
            onChange: Function
        },
        methods: {
            onChangeHandler(value) {
                this.onChange(value, this.row)
            }
        }
    }
</script>

<style lang="scss" module>
    .brief{
        max-width: 30vw;
        word-break: break-word!important;
    }
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        margin-top: 3px;
        font-weight: 400;
    }
</style>
