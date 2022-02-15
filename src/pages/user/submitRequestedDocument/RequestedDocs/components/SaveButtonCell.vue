<template>
    <div :class="$style.save">
        <div :class="$style.flex">
            <div v-if="row.RegisteredDocument == null || row.isChange"
                type="success"
                @click="saveDocument"
                left-icon="md-checkmark-circle-outline">

                <img src="../../../../../assets/images/save.png" alt="FSA Save" title="Save Document">
            </div>
            
            <div v-if="(row.RegisteredDocument != null) || row.isChange"
                type="success"
                @click="changeDocument"
                left-icon="md-edit-circle-outline">
                        
                <img src="../../../../../assets/images/cross_old.png" :class="$style.closeStyle" alt="FSA change" title="Cancel Change" v-if="row.isChange">
                <img src="../../../../../assets/images/changes.png" alt="FSA change" title="Change Document" v-else>
            </div>
        </div>

        <div v-if="!row.isSaved  && checkAllUploaded " :class="$style.error">
            Click to Upload.
        </div>
        <br/>
    </div>
</template> 

<script>

    export default {
        name: "SaveButtonCell",
        components: {
        },
        computed: {
            isAccepted() {
                return !!(+this.row.isAccepted)
            },
            checkAllUploaded(){
                return this.$store.state.common.allUploaded;
            },
        },
        props: {
            row: Object,
            readonly: Boolean,
            onSaveDocument: Function,
            onChangeDocument: Function,
            documents: Array,
        },
        methods: {
            changeDocument(){
                if(this.row.isChange && this.row.isChange == true){
                    this.row['isChange'] = false;
                }
                else{
                    this.row['isChange'] = true;
                }
                
                this.onChangeDocument(this.row);
            },
            saveDocument() {
                this.row['isChange'] = false;
                this.onSaveDocument(this.row)
            },
        }
    }
</script>

<style lang="scss" module>
    .closeStyle {
        margin-left: 10px;
        width: 11px;
        height: auto;
    }
    .save {
        position: relative;
        margin-top: 10px;
        min-height: 44px;
    }
    .accepted {
        color: #55a7a0;
        font-size: 13px;
        i {
            font-size: 17px;
            margin-right: 5px;
        }
    }
    .add {
        position: absolute;
        right: -32px;
        top: 50%;
        > * {
            transform: translate(0, -50%);
        }
    }
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 11px;
        margin: -3px 0 2px;
        font-weight: 400;
    }
    .flex {
        display: flex;
        align-items: center;
        justify-content: center;

        div{
            margin: 0px 2px
        }

    }
</style>
