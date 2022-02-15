const formStepMixin = {
    props: {
        value: {
            type: Object,
            required: true,
        },
        stepId: {
            type: Number,
            required: true,
        },
    },
    methods: {
        saveRequest(activeStep) {
            this.$emit('onSave', activeStep)
        },
    }
};

export default formStepMixin;
