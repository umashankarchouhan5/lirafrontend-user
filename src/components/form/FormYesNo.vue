<template>
    <ValidationProvider :vid="vid" :rules="rules" mode="passive" :name="name || label" v-slot="{ errors }">
        <div :class="$style.radioBox">
            <label :class="$style.label">
                <RadioGroup v-model="innerValue" :disabled="disabled" @on-change="onChange" >
                    <Radio label="Y" :disabled="disabled" >
                        Yes
                    </Radio>
                    <Radio label="N" :disabled="disabled">
                        No
                    </Radio>
                </RadioGroup>
                <!-- <Checkbox v-model="innerValue"  :true-value="trueValue" :false-value="falseValue"  /> -->
                <span>
                    <span v-if="isRequired && showAsterisk && requiredIcon" :class="$style.required">*</span>
                    <slot />
                </span>
            </label>
            <div :class="$style.error" v-if="errors[0]">
                {{ errors[0] }}
            </div>
        </div>
    </ValidationProvider>
</template>

<script>

   
    import { RadioGroup, Radio } from 'view-design'
    import validationMixin from 'Mixins/validationMixin'

    export default {
        name: "FormYesNo",
        mixins: [validationMixin],
        props: {
            value: [String, Number, Boolean],
            label: String,
            trueValue: [String, Number],
            falseValue: [String, Number],
            name: String,
            disabled: Boolean,
            showAsterisk: {
                type: Boolean,
                default: true
            },
            requiredIcon: {
                type: Boolean,
                default: true,
            }
            
        },
        components: {
            RadioGroup,
            Radio
        },
        methods:{
            onChange(val){
                this.$emit('onChangeEvent',val);
            }
        }
    }
</script>

<style lang="scss" module>
    .required {
        color: #ff3547;
        margin-right: 2px;
    }
    .error {
        color: #ff3547;
        position: absolute;
        max-width: 100%;
        left: 0;
        font-size: 11px;
        line-height: 13px;
        bottom: -15px;
        font-weight: 400;
    }
    .radioBox {
        position: relative;
    }
    .label {
        display: flex;
    }
</style>
