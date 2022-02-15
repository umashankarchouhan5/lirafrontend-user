<template>
    <ValidationProvider :vid="vid" :rules="rules" mode="passive" :name="name || label" v-slot="{ errors }">
        <div :class="$style.block">
            <VueTelInput validCharactersOnly :placeholder="placeholder" :disabled="disabled || readonly" :autofocus="false" v-model="innerValue" :id="id" :inputClasses="$style.input" v-bind="inputProps" />
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

    import validationMixin from 'Mixins/validationMixin'
    import { VueTelInput } from 'vue-tel-input'

    export default {
        name: "InputTel",
        mixins: [validationMixin],
        data() {
            return {
                inputProps: {
                    defaultCountry: "SC",
                    disabledFormatting: true,
                    inputOptions: {
                        showDialCode: true,
                    }
                }
            }
        },
        components: {
            VueTelInput
        },
        props: {
            name: String,
            disabled: {
                type: Boolean,
                default: false
            },
            label: {
                type: String,
                default: ""
            },
            value: {
                type: [String, Number],
                default: ""
            },
            placeholder: {
                type: [String],
                default: "Enter a phone number"
            },
            focused: {
                type: Boolean,
                default: false
            },
            id: String,
            vid: {
                type: String,
                default: ""
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },
    }
</script>

<style lang="scss" module>

    .block {
        position: relative;
        * {
            outline: none;
        }
        :global {
            .vue-tel-input {
                border: none;
                box-shadow: none;
                &:focus-within {
                    box-shadow: none;
                    border-color: transparent;
                }
            }
            .vti__dropdown:hover,
            .vti__dropdown.open {
                background: #fff;
            }
        }
        .input {
            color: #555;
            box-sizing: content-box;
            background-color: transparent;
            font-size: 13px;
            border: none;
            width: 100%;
            border-bottom: 1px solid #c7c7c7;
            height: 26px;
            padding: 7px 0 4px;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            &:focus {
                border-color: #4285f4;
                box-shadow: 0 1px 0 0 #4285f4;
            }
            &:disabled {
                color: #aaaaaa;
                cursor: not-allowed;
            }
        }
    }

    .label {
        transform: translateY(-11px) scale(0.8);
        color: #555;
        transform-origin: 0 100%;
        position: absolute;
        pointer-events: none;
        top: 0;
        left: 0;
        font-size: 13px;
        line-height: 19px;
        font-weight: 400;
        transition: transform 0.2s ease-out, color 0.2s ease-out;

        .blockFocused & {
            color: #4285f4;
        }

        .blockWithValue & {
            transform: translateY(-11px) scale(0.8);
        }
    }

    .error {
        color: #ff3547;
        position: absolute;
        max-width: 100%;
        left: 0;
        font-size: 11px;
        line-height: 16px;
        bottom: -18px;
        font-weight: 400;
    }

    .required {
        color: #ff3547;
        margin-left: 2px;
    }
</style>
