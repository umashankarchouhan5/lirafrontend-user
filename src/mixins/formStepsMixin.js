const formStepsMixin = {
    data() {
        return {
            steps: []
        }
    },
    computed: {
        activeStep() {
            return this.steps.find(step => step.isActive)
        }
    },
    methods: {
        setSteps(steps) {
            this.steps = steps;
        },
        setActiveStep(stepId) {
            if (stepId) {
                this.steps.forEach(step => step.isActive = step.id === stepId);
                window.scrollTo(0,0);
            }
        },
    }
};

export default formStepsMixin;