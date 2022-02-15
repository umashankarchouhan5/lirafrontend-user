<template>
    <ValidationProvider :vid="vid" :rules="rules" :name="name" ref="input" mode="passive" v-slot="{ errors }">
        <div :class="$style.block">
            <input
                @change="uploadFileHandler"
                ref="file"
                type="file"
                :disabled="disabled"
                :label="label"
                :class="$style.input"
            />
            <label :class="[$style.label , disabled? $style.disabledLabel : '']">
                {{ visibleLabel }}<span v-if="isRequired && !value" :class="$style.required">*</span>
            </label>
            <div :class="$style.error" v-if="errors[0]">
                {{ errors[0]  }}
            </div>
            <img :class="$style.selected" v-if="((innerValue && !url) || (innerValue && changeUploaded === true)) && !disabled" src="../../assets/images/cross.png" @click="cancelSelection" title="Cancel Selection" alt="FSA Selected File Cancel">
            <img :class="$style.select" v-else src="../../assets/images/upload.png" alt="Select Document" title="Select Document">
        </div>
    </ValidationProvider>
</template>

<script>
    // import { Validator } from 'vee-validate';
    import validationMixin from 'Mixins/validationMixin'
    // const validator = new Validator();

    export default {
        name: "InputFile",
        data() {
            return {
                file: null
            };
        },
        mixins: [validationMixin],
        props: {
            changeUploaded:{
                type: [Number,Boolean,String],
                default: false,
            } ,
            referenceId: {
                type: Number,
            },
            disabled: {
                type: Boolean
            },
            fileDetails: {
                type: Object
            },
            label: {
                type: String,
                default: "Upload File"
            },
            value: {
                type: File,
                default() {
                    return null
                }
            },
            immediate: {
                type: Boolean,
                default: false
            },
            required: {
                type: Boolean,
                default: false
            },
            name: {
                type: String,
            },
            url: String,
        },
        computed: {
            visibleLabel() {
                if (this.innerValue) {
                    return this.innerValue.name;
                }
                return this.label || 'Upload file';
            },
            userId() {
                return this.$store.state.user.user.user_id
            },
            processId() {
                return this.$store.state.common.currentProcessId;
            },
        },
        watch:{
            errors(val){
                return val;
            },
            value(val) {
                if(val == null || val == undefined) {
                    this.cancelSelection();
                }
            }
        },
        methods: {
            cancelSelection() {
                this.innerValue = null;
                this.$refs.input.value = '';
                this.$refs.file.value = null;
                this.$emit('onChange', this.innerValue)
            },
            uploadFileHandler(e) {
                if(e.target.files.length > 0){
                    this.$refs.input.validate(e.target.files).then((result) => {
                        if (result.valid) {
                            this.selectFile(e)
                        }
                        else{
                            this.innerValue = null;
                        }
                    })
                }
            },
            selectFile(e) {
                this.innerValue = e.target.files[0];
                this.$emit('onChange', this.innerValue)
            },
        }
    };
</script>

<style lang="scss" module>
    .block {
        position: relative;
    }

    .select,
    .selected {
        position: absolute;
        right: 0;
        padding: 5px;
        bottom: 7px;
    }

    .select {
        pointer-events: none;
    }

    .selected {
        cursor: pointer;
        right: 2px;
        bottom: 9px;
    }

    .required {
        color: #ff3547;
        margin-left: 2px;
    }

    .input {
        width: 100%;
        overflow: hidden;
        opacity: 0;
        outline: none;
        height: 38px;
        cursor: pointer;
        &:disabled {
            cursor: not-allowed;
        }
    }
    .label {
        pointer-events: none;
        color: #555;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        font-size: 13px;
        line-height: 15px;
        font-weight: 400;
        padding-top: 14px;
        height: 38px;
        border-bottom: 1px solid #c7c7c7;
    }
    .disabledLabel {
        color: #aaaaaa;
        -webkit-text-fill-color: #aaaaaa;
        cursor: not-allowed;
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
