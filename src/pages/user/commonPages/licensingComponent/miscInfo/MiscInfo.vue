<template>
    <div>
        <p><i>In accordance with the FSA Act and the AML/CFT Act, the compliance officer is responsible for establishing, implementing and maintaining a program for training staff members and other officers of the licensee. Please provide a brief description of your proposed training programme. Alternatively, you may upload your proposed training programme document. </i></p>

        <TrainingStaff :readonly="readonly" v-model="innerValue.staffJson"></TrainingStaff>

        <FormRow>
            <div class="col-sm-12">
                <InputTextArea rules="required" :readonly="readonly" label="Training Program Details" v-model="innerValue.data.TrainingProgramDetail" rows="6" maxlength="300" />
            </div>
        </FormRow><br />
        <ButtonGroup>
            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
            <FormButton type="success" @click="saveRequest">Save</FormButton>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>

<script>

    import formStepMixin from '../formStepMixin';
    import TrainingStaff from '../trainingStaff';
    import valueMixin from 'Mixins/valueMixin';

    export default {
        name: "MiscInfo",
        mixins: [ formStepMixin, valueMixin ],
        components: {
            TrainingStaff
        },
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
