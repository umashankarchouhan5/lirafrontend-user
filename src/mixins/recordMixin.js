const recordMixin = {
    props: {
        value: {
            type: Array,
            required: true
        },
        pqId: {
            type: [Number, String],
            required: true
        }
    },
    created() {
        if (this.value.length === 0) {
            this.pushEmptyValue()
        }
    },
    methods: {
        addRow() {
            this.pushEmptyValue()
        },
        deleteRow(i) {
            this.value.splice(i, 1)
        },
    }
};

export default recordMixin;
