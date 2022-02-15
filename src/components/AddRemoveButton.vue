<template>
    <div :class="$style.flex">
        
        <div v-if="isLast" :class="cssClassAdd" @click="onAdd">
            <Icon type="md-add"/>
        </div>
        <div  >
            <div v-if="(!firstNonRemovable || (firstNonRemovable && i != 0)) && length > 0" :class="cssClassRemove" @click="onRemove">
                <Icon type="md-close"/>
            </div>
        </div>
        <!-- <div v-if="isLast  && !firstNonRemovable" :class="cssClassRemove" @click="onRemove">
            <Icon type="md-close"/>
        </div>
        <div v-if="isLast" :class="cssClassAdd" @click="onAdd">
            <Icon type="md-add"/>
        </div>
        <div v-else >
            <div v-if="!firstNonRemovable" :class="cssClassRemove" @click="onRemove">
                <Icon type="md-close"/>
            </div>
        </div> -->
    </div>
</template>

<script>
    export default {
        name: "AddRemoveButton",
        props: {
            i: Number,
            isLast: Boolean,
            length: Number,
            size: String,
            firstNonRemovable: {
                type: Boolean,
                default: false,
            }
        },
        computed: {
            cssClassAdd() {
                return [this.$style.add, this.size ? this.$style[this.size] : ''].join(' ')
            },
            cssClassRemove() {
                return [this.$style.remove, this.size ? this.$style[this.size] : ''].join(' ')
            }
        },
        methods: {
            onRemove() {
                this.$emit('remove')
            },
            onAdd() {
                this.$emit('add')
            }
        }
    }
</script>

<style lang="scss" module>
    .flex{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .add,
    .remove {
        width: 28px;
        height: 28px;
        cursor: pointer;
        overflow: hidden;
        display: block;
        border-radius: 50%;
        text-align: center;
        line-height: 27px;
        color: #fff;
        :global {
            .ivu-icon {
                font-size: 21px;
                font-weight: 700;
                vertical-align: middle;
            }
        }
    }

    .add {
        background: #60c5bd;
    }

    .small {
        width: 20px;
        height: 20px;
        line-height: 19px;
        :global {
            .ivu-icon {
                font-size: 17px;
            }
        }
    }

    .remove {
        color: darkred;
        background: none;
    }
</style>
