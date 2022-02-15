<template>
    <div :class="$style.block">
        <input
                @change="immediateUpload"
                type="file"
                :disabled="disabled"
                :class="$style.input"
        />
        <label :class="$style.label">
            {{ visibleLabel }}
        </label>
        <img :class="$style.select" v-if="!file && !fileDetails.name" src="../../assets/images/upload.png" alt="">
        <a v-else target="_blank" :href="link || fileDetails.url">
            <img :class="$style.selected" src="../../assets/images/eye.png">
        </a>

    </div>
</template>

<script>

    import { uploadFile } from 'Pages/master/masterActions'

    export default {
        name: "InputFileImmediate",
        data() {
            return {
                file: null,
                link: ''
            };
        },
        props: {
            referenceId: {
                type: [String, Number],
            },
            disabled: {
                type: Boolean
            },
            fileDetails: {
                type: Object
            },
            label: {
                type: String,
                default: "Upload file"
            },
            name: String
        },
        computed: {
            visibleLabel() {
                if (this.file) {
                    return this.file.name;
                }
                if (this.fileDetails) {
                    return this.fileDetails.name;
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
        methods: {
            immediateUpload(e) {
                let data = new FormData();
                data.append("image", e.target.files[0], e.target.files[0].name);
                data.append("process_id", this.processId);
                data.append("masterid", this.fileDetails.documentmaster_id);
                data.append("code", this.fileDetails.DocumentCode);
                data.append("user_id", this.userId);
                data.append("reference_id", this.referenceId);
                uploadFile(data)
                    .then(res => {
                        this.file = e.target.files[0];
                        this.link = res.data.url;
                        this.$emit('onUpload', {
                            documentmaster_id: this.fileDetails.documentmaster_id,
                            url: this.link,
                            name: e.target.files[0].name
                        })
                    })
            }
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
        outline: none;
        height: 38px;
        cursor: pointer;
    }

    .label {
        pointer-events: none;
        color: #555;
        background: #fff;
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

    .error {
        color: #ff3547;
        position: absolute;
        left: 0;
        font-size: 11px;
        line-height: 13px;
        top: calc(100% - 5px);
        font-weight: 400;
    }
</style>
