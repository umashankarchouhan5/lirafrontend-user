<template>

    <InstructionComponent :steps="steps"  licenseName="FUND_LICENSE" />
    
</template>

<script>
    import InstructionComponent from '../components/InstructionComponent'
    
    //for summary component
    import steps from './steps';
    import formStepsMixin from 'Mixins/formStepsMixin';

    export default {
        name:'Instruction',
        mixins: [formStepsMixin],
        components: {
            InstructionComponent
        },
        data() {
            return{
                // steps

            }
        },
        created() {
            this.setSteps(steps)
        }
        
    }
</script>