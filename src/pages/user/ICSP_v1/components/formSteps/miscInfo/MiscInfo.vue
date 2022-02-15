<template>
    <div>
        <div >
            <FormRow>
                <!-- <h6>Training Program Details</h6> -->
                <div class="col-sm-12">
                    <InputTextArea rules="required" :readonly="readonly" label="Training Program Details" v-model="value.data.TrainingProgramDetail" rows="6" maxlength="300" />
                </div>
            </FormRow><br />
            <ButtonGroup>
                <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                <FormButton type="success" @click="saveRequest">Save</FormButton>
                <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
            </ButtonGroup>
        </div>
        
    </div>
</template>

<script>

    import { getICSPOperationType } from '../../../APIRequests'
    import formStepMixin from '../formStepMixin'
    import InputDate from 'Components/form/InputDate';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import Person from 'Components/Person'

    export default {
        name: "MiscInfo",
        mixins: [formStepMixin],
        props: {
            readonly: Boolean,
        },
        data() {
          return {
              operationTypes: [],
              isModalVisible: false,
              openedPanel: 'applying_for_license'
          }
        },
        methods: {
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
    .checkboxes {
        display: flex;
        margin-bottom: 20px;
        > span {
            margin-right: 30px;
        }
    }
</style>
