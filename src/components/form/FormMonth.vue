<template>
    <div :class="$style.block">
        <label v-if="label" :class="$style.label">
            {{ label }}<span v-if="isRequired" :class="$style.required">*</span>
        </label>
        <FormSelect placeholder="Month" :rules="rules" :disabled="readonly" :name="name" :items="months" v-model="innerValue" item-value="id" item-name="label" :onChange="onMonthChange" :width="width" :clearable="clearable" />
        <div :class="$style.error" v-if="errors && errors.indexOf('fd') !== -1">
            Provide correct Month
        </div>
    </div>
</template>

<script>

    import moment from 'moment';
    import dateUtil from 'Utils/dateUtil'
    import validationMixin from 'Mixins/validationMixin'

    export default {
        name: "Month",
        mixins: [validationMixin],
        data() {
            return {
                error: '',
                months: [],
            }
        },
        created() {
            this.fillMonth()
        },
        props: {
            label: {
                type: String,
                default: ""
            },
            readonly: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: false
            },
            errors: Array,
            rules: [String, Object],
            name: String,
            width: {
                type: [String,Number],
                default: 120
            }
        },
        methods: {
            onMonthChange(value) {
                this.innerValue = value;
                
                this.onChange();
            },
            fillMonth() {
                this.months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ].map((item, i) => {
                    return {
                        id: parseInt((i + 1) < 10 ? `0${i + 1}` : `${i + 1}`),
                        label: item
                    }
                })
            },
            onChange() {
                if ( this.innerValue ) {
                    this.$emit('onSelect', parseInt(this.innerValue))
                }
            }
        }
    }
</script>

<style lang="scss" module>
    .block {
        display: flex;
        position: relative;
        > * {
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
        }
    }

    .label {
        color: #555;
        transform-origin: 0 100%;
        position: absolute;
        pointer-events: none;
        white-space: nowrap;
        top: 0;
        left: 0;
        font-size: 13px;
        line-height: 19px;
        font-weight: 400;
        transition: transform 0.2s ease-out, color 0.2s ease-out;
        transform: translateY(-11px) scale(0.8);
        z-index: 1;
    }

    .error {
        color: #ff3547;
        position: absolute;
        left: 0;
        font-size: 11px;
        line-height: 13px;
        top: calc(100% + 2px);
        font-weight: 400;
    }


</style>
