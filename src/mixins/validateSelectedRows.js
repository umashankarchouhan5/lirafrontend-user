export default {
    data() {
        return {
            selectedRows: [],
            warningModal: {
                visible: false,
                buttons: {
                    ok: true,
                    confirm: false,
                    cancel: false
                }
            },
        }
    },
    methods: {
        showWarningModal(value) {
            this.warningModal.visible = value;
        },
        validateSelectedLength(value) {
            if (this.selectedRows.length === value) {
                return true;
            }
            if (value === 1 && this.selectedRows.length !== 1) {
                this.warningModal.message = 'Select one row please.';
                this.showWarningModal(true);
                return false
            }
            if (this.selectedRows.length === 0) {
                this.warningModal.message = 'Select at least one row!';
                this.showWarningModal(true);
                return false
            }
            return true;
        },
    }
}


