<template>
    <Modal :width="width"
           :value="value"
           :closable="closable"
           :mask-closable="maskClosable"
           @on-visible-change="handleVisibleChange"
           role="dialog"
    >
        <div :class="cssHeader" v-if="title" slot="header">
            <div :class="$style.title">
                <Icon :type="icon" />
                {{ title }}
            </div>
        </div>
        <div :class="$style.content" aria-hidden="true">
            <slot/>
        </div>
        <div :class="$style.footer" slot="footer">
            <slot name="footer"/>
        </div>
    </Modal>
</template>

<script>
    import {Modal} from 'view-design'

    export default {
        name: "Popup",
        props: {
            width: [String, Number],
            title: {
                type: String
            },
            value: {
                type: Boolean,
                required: true
            },
            closable: {
                type: Boolean,
                default: true
            },
            maskClosable: {
                type: Boolean,
                default: true
            },
            type: String,

        },
        components: {
            Modal
        },
        computed: {
            cssHeader() {
                return [
                    this.$style.header,
                    this.type ? this.$style[this.type] : '',
                ].join(' ')
            },
            icon() {
                switch (true) {
                    case (this.type === 'error'):
                        return 'md-warning';
                    case (this.type === 'success'):
                        return 'md-checkmark-circle-outline';
                    default:
                        return 'md-information-circle'
                }
            }
        },
        methods: {
            handleVisibleChange(value) {
                !value && this.$emit('close', value)
            }
        },
        beforeDestroy() {
            if(document.getElementsByTagName("body")[0].style.overflow){
                document.getElementsByTagName("body")[0].style.removeProperty('overflow');
            }
            if(document.getElementsByTagName("body")[0].style.paddingRight){
                document.getElementsByTagName("body")[0].style.removeProperty('padding-right');
            }
        }
    };
</script>

<style lang="scss" module>

    .header {
        background: #6da2f9;
        border-radius: 0;
        position: relative;
        border: none;
        text-align: center;
        padding: 7px 15px;
        box-shadow: 0 4px 5px #00000073;
    }

    .error {
        background: #ff3c48;
        :global {
            .ivu-icon {
                color: #762327;
            }
        }
    }

    .warning {
        background: #ffeb59;
    }

    .success {
        background: #84ff9a;
        :global {
            .ivu-icon {
                color: #0e7922;
            }
        }
    }

    .title {
        font-size: 14px;
        font-weight: 500;
        line-height: 28px;
        > i {
            position: absolute;
            top: 0;
            left: 10px;
            font-size: 27px;
            line-height: 45px;
            color: #cee0ff;
        }
    }

    .close {
        padding: 0;
        cursor: pointer;
        background: none;
        border: 0;
        appearance: none;
        font-size: 24px;
        font-weight: 600;
        line-height: 1;
        color: #000;
        opacity: 0.5;
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        text-shadow: 0 1px 0 #fff;
    }

    .content {
        background: #fff;
    }

    :global {
        .ivu-modal-footer {
            text-align: left;
        }
    }
</style>
