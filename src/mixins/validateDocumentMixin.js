export default {
    methods: {
        validateDocuments() {
            if (this.$refs.component && this.$refs.component.documents) {
                //mandatory
                const isAllDocumentsUploaded = this.$refs.component.documents.mandatory.every(item => item.name);
                if (!isAllDocumentsUploaded) {
                    this.$refs.component.error.areAllUploaded = true;
                    return false;
                }
                //optional
                const isOptionalDocumentsUploaded = this.$refs.component.documents.optional.every(item => {
                    if(item.file !== null){
                        return item.name ? true : false;
                    }
                    return true;
                });
                if (!isOptionalDocumentsUploaded) {
                    this.$refs.component.error.areAllOptionalUploaded = true;
                    return false;
                }
                //additional
                const isAdditionalDocumentsUploaded = this.$refs.component.documents.additional.every(item => {
                    if(item.file !== null){
                        return item.name ? true : false;
                    }
                    else if( item.documentBrief && item.documentBrief.trim() !== '' ){
                        return item.name ? true : false;
                    }
                    return true;
                });
                if (!isAdditionalDocumentsUploaded) {
                    this.$refs.component.error.areAllAdditionalUploaded = true;
                    return false;
                }
                this.$refs.component.error = false;
                return true;
            }
            return true;
        },
    }
};