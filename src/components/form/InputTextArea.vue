<template>
    <ValidationProvider :vid="vid" :rules="rules" :name="name || label" v-slot="{ errors }">
        <div :class="cssClass">
            <label v-if="label" :class="$style.label">
                {{ label }}<span v-if="isRequired" :class="$style.required">*</span>
            </label>
            <textarea
                    :disabled="disabled"
                    :readonly="readonly"
                    :placeholder="placeholder"
                    v-model="innerValue"
                    :rows="rows"
                    :maxlength="maxlength"
                    :class="$style.textarea"
            />
            <span :class="$style.characters" v-if="remainingChars">{{ remainingChars }}</span>
            <div :class="$style.error" v-if="errors[0]">
                {{ errors[0] }}
            </div>
        </div>
    </ValidationProvider>
</template>

<script>

    import validationMixin from 'Mixins/validationMixin'

    export default {
        name: "TextInput",
        mixins: [validationMixin],
        data() {
            return {
                isFocused: this.focused
            };
        },
        props: {
            vid: String,
            rules: {
                type: [Object, String],
                default: ""
            },
            name: String,
            rows: String,
            maxlength: {
                type: [String, Number],
                default() {
                    return 500
                }
            },
            disabled: {
                type: Boolean
            },
            label: {
                type: String,
                default: ""
            },
            required: {
                type: Boolean,
                default: false
            },
            value: {
                type: [String, Number],
                default: ""
            },
            readonly: Boolean,
            placeholder: {
                type: [String],
                default: ""
            },
        },
        computed: {
            remainingChars() {
              return (typeof this.innerValue === 'string' && this.innerValue.length > 0) ? `${this.maxlength - this.innerValue.length} characters remaining` : null
            },
            cssClass() {
                return [
                    this.$style.block,
                    this.isFocused ? this.$style.blockFocused : "",
                    this.value ? this.$style.blockWithValue : "",
                    this.error ? this.$style.blockInvalid : ""
                ].join(" ");
            }
        },
    };
</script>

<style lang="scss" module>

    .characters {
        position: absolute;
        color: #757575;
        font-size: 11px;
        bottom: -17px;
        right: 0
    }
    .block {
        position: relative;
    }

    .required {
        color: #ff3547;
        margin-left: 2px;
    }

    .textarea {
        color: #555;
        padding: 6px 12px;
        background-color: #fff;
        font-size: 13px;
        width: 100%;
        border: 1px solid #d2d6de;
        height: auto;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        outline: 0;
        display: block;

        &:focus {
            border-color: #3c8dbc;
        }
        &:disabled {
            color: lighten(#555, 30%);
            + .label {
                color: lighten(#555, 30%);
            }
        }
        &:read-only {
            color: #aaaaaa;
            cursor: not-allowed;
            // color: lighten(#555, 50%);
        }
    }

    .label {
        color: #555;
        font-size: 13px;
        line-height: 19px;
        font-weight: 400;
    }

    .error {
        color: #ff3547;
        position: absolute;
        left: 0;
        font-size: 11px;
        line-height: 16px;
        bottom: -16px;
        font-weight: 400;
    }
</style>
