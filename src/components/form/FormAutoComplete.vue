<template>
    <ValidationProvider :vid="vid" :rules="rules" :name="name || label" mode="passive" v-slot="{ errors }">
        <div :class="$style.select">
            <AutoComplete
                clearable
                transfer
                :icon="icon"
                v-model="innerValue"
                :disabled="disabled"
                @on-search="onSearch"
                @on-select="onSelect"
                @on-change="onChange"
                @on-focus="onFocus"
                :class="$style.input"
                placeholder="Type min. 3 chars">
                <Option v-for="(item, i) in items" :value="getItemValue(item)" :key="i.CompanyRegNo">{{ getItemName(item) }}</Option>
            </AutoComplete>
            <label v-if="label" :class="$style.label">
                {{ label }}<span v-if="isRequired" :class="$style.required">*</span>
            </label>
            <div :class="$style.error" v-if="errors[0]">
                {{ errors[0] }}
            </div>
        </div>
    </ValidationProvider>
</template>

<script>

    import { AutoComplete, Option } from 'view-design';
    import validationMixin from 'Mixins/validationMixin';

    export default {
        name: "FormAutoComplete",
        mixins: [validationMixin],
        components: {
            AutoComplete, Option
        },
        props: {
            value: [String, Number],
            items: Array,
            itemValue: String,
            itemName: String,
            label: String,
            disabled: Boolean,
            isLoading: {
                type: Boolean,
                default: false
            },
            onSearch: {
                type: Function,
                default: () => {}
            },
            onFocus: {
                type: Function,
                default: () => {}
            },
            onChange: {
                type: Function,
                default: () => {}
            },
            onSelect: {
                type: Function,
                default: () => {}
            },
            name: String,
            width: Number
        },
        computed: {
            icon() {
                return this.isLoading ? 'ios-loading' :'ios-search'
            },
        },
        methods: {
            getItemValue(item) {
                return item[this.itemValue] !== 'undefined' ? item[this.itemValue] : item
            },
            getItemName(item) {
                return item[this.itemName] !== 'undefined' ? item[this.itemName] : item
            },
        }
    }
</script>

<style lang="scss" module>
    .select {
        position: relative;
        :global {
            .ivu-icon {
                margin-top: 7px;
                z-index: 1;
            }
            .ivu-input[disabled] {
                background-color: rgba(0,0,0,0);
                z-index: 2;
                color: lighten(#555, 30%)!important;
            }
            .ivu-icon-ios-loading {
                animation: ani-load-loop 1s linear infinite;
            }
        }
    }

    .label {
        color: #555;
        transform-origin: 0 100%;
        position: absolute;
        pointer-events: none;
        top: 0;
        left: 0;
        font-size: 13px;
        line-height: 19px;
        font-weight: 400;
        transform: translateY(-11px) scale(0.8);
    }

    :global(.ivu-select-visible) {
        + .label {
            color: #4285f4;
        }
    }

    .error {
        color: #ff3547;
        position: absolute;
        max-width: 100%;
        left: 0;
        font-size: 11px;
        line-height: 13px;
        top: calc(100% + 2px);
        font-weight: 400;
    }

    .required {
        color: #ff3547;
    }
    .input {
        
        &:disabled {
            color: #ccc;
            color: lighten(#555, 30%);
        }
        // &:read-only {
        //     color: #aaaaaa;
        //     cursor: not-allowed;
        //     // color: lighten(#555, 50%);
        // }
    }

</style>
