<template>
    <div :class="$style.item">
        <slot />
        <div :class="$style.button" v-if="!readonly">
            <AddRemoveButton :isLast="isLast" @remove="deleteRow" @add="addRow" :i="recordIndex" :length="sizeArr" size="small"    :firstNonRemovable="firstNonRemovable" />
        </div>
    </div>
</template>

<script>

    import AddRemoveButton from 'Components/AddRemoveButton'

    export default {
        name: "RecordItem",
        props: {
            recordIndex: Number,
            length: Number,
            readonly: Boolean,
            firstNonRemovable: {
                type: Boolean,
                default: false,
            }
        },
        components: {
            AddRemoveButton
        },
        computed: {
            isLast(){
                return +this.recordIndex === this.length - 1;
            },
            sizeArr(){
                return this.length;
            },
            index() {
                return this.recordIndex;
            }

        },
        methods: {
            addRow() {
                this.$emit('onAddRow');
            },
            deleteRow() {
                this.$emit('onDeleteRow', this.recordIndex);
            },
        }
    }
</script>

<style lang="scss" module>

    .item {
        margin-bottom: 20px;
        padding-right: 55px;
        position: relative;
        .button {
            position: absolute;
            right: 0;
            top: 0;
        }
        h6 {
            margin: -10px 0 10px;
        }
    }

</style>
