<template>
    <div :class="$style.save">
        <div  >
            <AddRemoveButton :firstNonRemovable=" row._index === 0 ? true : false " :is-last="isLast" @add="addRow" size="small" :i="row._index" :length="statsData.length" @remove="removeRow" />
        </div>
        <br/>
    </div>
</template> 

<script>

    import AddRemoveButton from 'Components/AddRemoveButton'

    export default {
        name: "ActionCell",
        components: {
            AddRemoveButton
        },
        computed: {
            showAddButton() {
                return  this.isLast
            },
            isLast() {
                return this.row._index === this.statsData.length - 1;
            },
        },
        props: {
            row: Object,
            readonly: Boolean,
            onAddRow: Function,
            onRemoveRow: Function,
            statsData: [Array],
        },
        methods: {
            addRow() {
                this.onAddRow(this.row)
            },
            removeRow() {
                this.onRemoveRow(this.row._index)
            }
        }
    }
</script>

<style lang="scss" module>
    .save {
        position: relative;
        margin-top: 10px;
        min-height: 44px;
    }
    .add {
        position: absolute;
        right: -32px;
        top: 50%;
        > * {
            transform: translate(0, -50%);
        }
    }
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 11px;
        margin: -3px 0 2px;
        font-weight: 400;
    }
</style>
