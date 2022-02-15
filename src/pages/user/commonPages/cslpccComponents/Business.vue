<template>
    <div>
        <FormRow>
            <div class="col-sm-12">
                <InputTextArea label="Please provide a description of each business that the company proposes to engage in" v-model="innerValue.BusinessStrategy" rows="10" maxlength="2000" :readonly="readonly" rules="required" />
            </div>
        </FormRow>
        <FormRow v-if="$route.name === 'CSLForm'">
            <div class="col-sm-9">
                Does the company intend to employ expatriates for whom work permit (s) would be required, or to set up additional offices other than that of the secretary which would require exemptions under Section 20(3), (4) and (5) of CSL Act, 2003? If Yes, please provide a detailed business plan. Use the attached checklist as a guide to the business plan. 
            </div>
            <div class="col-sm-3">
                <RadioGroup v-model="innerValue.ExpatriateYN" :disabled="readonly">
                    <Radio label="1" :disabled="readonly" rules="required">
                        Yes
                    </Radio>
                    <Radio label="0" :disabled="readonly">
                        No
                    </Radio>
                </RadioGroup>
            </div>
        </FormRow>
        <br />
        <FormRow>
            <ButtonGroup>
                <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                <FormButton  type="success" @click="saveRequest" v-if="!readonly">Save</FormButton>
                <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
            </ButtonGroup>
        </FormRow>

    </div>
</template>

<script>

    
    import valueMixin from 'Mixins/valueMixin';
    import { RadioGroup, Radio } from 'view-design'

    export default {
        name:"CSLPCCBusinessStrategy",
        mixins: [valueMixin],
        props: {
            readonly: Boolean
        },
        components: {
            RadioGroup,
            Radio
        },
        data(){
            return{
            }
        },
        computed:{
            countries() {
                return this.$store.state.common.countries;
            },
            userData() {
                return this.$store.state.user.user;
            },
            processId() {
                return this.$store.state.common.currentProcessId;
            },
        },
        created(){
           
        },
        methods:{
            saveRequest(activeStep) {
                this.$emit('onSave', activeStep)
            },
            nextStep() {
                this.$emit('nextStep')
            },
            prevStep() {
                this.$emit('prevStep')
            }
        },


    }
</script>


<style lang="scss" module>
    .checkList {
        position: relative;
        min-height: 30px;
        margin-bottom: 20px;
        border-radius: 3px;
        overflow: hidden;
        border: 1px solid #e1e1e1;
    }

    .checkItem {
        padding: 5px 8px;
        border-bottom: 1px solid #e1e1e1;
        display: flex;
        align-items: center;
        background: lighten(#ccc, 17%);

        &:last-child {
            border-bottom: none;
        }
    }

    .checkbox {
        flex-shrink: 0;
        flex-grow: 0;
        width: 25px;
        text-align: center;
        align-self: flex-start;
    }

    .checkBrief {
        flex-grow: 1;
    }

    .error {
        color: #ff3547;
        max-width: 100%;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
        margin: -18px 0 18px;
    }
</style>


