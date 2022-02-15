<template>
    <div >
        <div  >
            
            <div v-for="(item, i) in innerValue"  :key="item.Qid">
                <ListItem  v-model="innerValue[i]" :readonly="readonly"  v-if="item.Page === stepId && item.SkipWhenQid === null"  >
                    <div :class="$style.flexClass">
                        <p :class="$style.firstItem"><b>{{item.QNo}} &nbsp; : </b></p><span v-html="item.QText"></span> 
                        <span  :class="$style.requiredWithoutLabel">*</span>
                    </div>
                </ListItem>
                <div v-if="item.Page === stepId && item.SkipWhenQid !== null">
                <ListItem  v-model="innerValue[i]" :readonly="readonly"  :disabled="checkDisabled(item)" :width="width" >
                    <div :class="$style.flexClass">
                        <p :class="$style.firstItem"><b>{{item.QNo}} &nbsp; : </b></p><span v-html="item.QText"></span> 
                        
                        <span  :class="$style.requiredWithoutLabel">*</span>
                    </div>
                </ListItem>
                </div>
            </div>

            <ButtonGroup>
                <FormButton type="primary" v-if="stepId !== 1" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                <FormButton v-if="!readonly" type="success" @click="saveRequest">Save</FormButton>
                <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
            </ButtonGroup>
        </div>
    </div>
</template>

<script>

    import valueMixin from 'Mixins/valueMixin';
    import ListItem from '../subComponent/listRender'

    export default {
        name: "GeneralInfo", 
        mixins: [ valueMixin ],
        data() {
          return {
                isModalVisible: false,
                isAddressSame: false,
                width: null,
          }
        },
        props: {
            readonly: Boolean,
            stepId: Number,
        },
        watch:{
            innerValue:{
                deep: true,
                handler(val){
                }
            },
            'innerValue.Stats':{
                deep: true,
                handler(val){
                }
            }
        },
        components: {
            ListItem,
        },
        mounted(){
            // this.getWidth();
        },
        methods: {
            getWidth(){
                this.width = this.refs.widthId.clientWidth;
            },
            checkDisabled(item){
                const commandingQuestion = this.innerValue.find((val) => {
                    return item.SkipWhenQid === val.Qid
                })
                if(commandingQuestion.CheckedYN === item.ResponseYN ){
                    return true;
                }
                else{
                    return false;
                }
            },
            saveRequest(activeStep) {
                this.$emit('onSave', activeStep)
            },
            nextStep() {
                this.$emit('nextStep')
            },
            
            prevStep() {
                this.$emit('prevStep')
            }
        }
    }
</script>

<style lang="scss" module>

    .requiredWithoutLabel {
        color: #ff3547;
        position: absolute;
        top: 1px;
        right: 0;
    }
    .flexClass {
        display: flex;
        justify-content: flex-start;
        .firstItem{
            min-width: 40px;
            p{
                margin: 0px;
            }
        }
    }
    .checkboxes {
        display: flex;
        margin-bottom: 20px;
        > span {
            margin-right: 30px;
        }
    }
    .selectSource {
        display: flex;
        justify-content: space-between;
        min-width: 200px;
    }
</style>
