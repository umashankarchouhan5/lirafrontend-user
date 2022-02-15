<template>
    <div :class="$style.wizard" v-if="steps.length > 1">
        <div :class="$style.wizardRow">
            <WizardStep v-for="step in steps" :style="stepStyle" :step="step" :key="step.id" @onClick="wizardStepClick" />
        </div>
    </div>
</template>

<script>
    import WizardStep from './WizardStep';

    export default {
        name: "Wizard",
        props: {
            steps: {
                type: Array,
                required: true
            }
        },
        components: {
            WizardStep
        },
        computed: {
            stepStyle() {
                return {
                    width: `${Math.floor(100 / this.steps.length)}%`
                }
            }
        },
        methods: {
            wizardStepClick(stepId) {
                this.$emit('changeStep', stepId)
            }
        }
    }
</script>

<style lang="scss" module>
    .wizard {
        display: table;
        width: 100%;
        margin: 0 0 30px;
    }
    .wizardRow {
        display: table-row;
    }
</style>
