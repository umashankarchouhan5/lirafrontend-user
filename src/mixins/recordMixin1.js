const recordMixin1 = {
    props: {
        value: {
            type: Array,
            required: true
        },
        readonly: {
            type: Boolean
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

export default recordMixin1;
