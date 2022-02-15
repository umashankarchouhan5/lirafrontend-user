<template>
    <div>
        <FormRow>
            <div class="col-sm-2">
                <InputText label="Entity Type"
                    rules="required"
                    readonly
                    v-model="value.EntityType" 
                    :width="150"/>
            </div>
            <div class="col-sm-5">
                <InputText label="Proposed Name"
                    v-model="value.ProposedName"
                    :maxlength="300"
                    :readonly="readonly"
                    rules="required|nameReservation_IBC"
                    :width="200"
                    />
            </div>
        </FormRow>
        <FormRow >
            <div class="col-sm-5">
                <InputText label="Foreign Name"
                    :maxlength="300"
                    :readonly="readonly"
                    :rules="value.TranslationFile || value.document_file ? 'required' : null"
                    v-model="value.ForeignName"/>
            </div>
            <div class="col-sm-5">
                <div :class="$style.currentEntityFile" v-if="value.TranslationFile !== undefined && value.TranslationFile !== null">
                    <a v-if="readonly" :href="value.document_file" target="_blank">
                        <Icon type="md-eye" /> 
                        {{ value.TranslationFile }}
                    </a>
                    <p v-if="!readonly">File: {{ value.TranslationFile.name }}</p>
                    <span v-if="!readonly" @click="removeCurrentFile">
                        <img src="../../../../../assets/images/delete.png" height="15px" alt="">
                    </span>
                </div>
                <InputFile v-else  @onChange="uploadFileHandler" :disabled="readonly" :value="value.TranslationFile" name="Upload" :rules="{required: value.ForeignName && value.ForeignName !== '' && value.ForeignName !== null ? true : false,docCheck:'pdf,jpg,jpeg,png',checkFileRegex: true}" />
            </div>
        </FormRow>
    </div>
</template>

<script>


    export default {
        name: "ProposedName",
        components: {
        },
        data() {
            return {
            }
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
        },
        watch: {
            'value.TranslationFile': {
                deep: true,
                handler(val){
                    console.log(val)
                }
            }
        },
        props: {
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
            value: {
                type: Object,
                required: true,
            },
        },
        created(){
        },
        methods: {
            removeCurrentFile() {
                this.value.TranslationFile = null;
            },
            uploadFileHandler(file) {
                this.value.TranslationFile = file;
            },
        },
    }
</script>

<style lang="scss" module>

    .limitedBy {
        display: flex;
        height: 38px;
        align-items: center;
        margin-bottom: 20px;

        > * {
            margin-right: 40px;
        }
    }

    .limitedByValues {
        display: flex;
        margin-bottom: 20px;

        > * {
            width: 200px;
            margin-right: 20px;

            &:first-child {
                width: 80px;
            }
        }
    }

    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
    }
    
    .currentEntityFile {
        display: inline-flex;
        span {
            margin-left: 20px;
            padding: 3px;
            cursor: pointer;
        }
    }

</style>
