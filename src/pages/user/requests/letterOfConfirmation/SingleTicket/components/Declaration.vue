<template>
    <CenterBlock :width="900">
        <FormRow>
            <div class="col-sm-12">
                <DeclarationComponent v-model="value.declaration" />
            </div>
        </FormRow>
    </CenterBlock>
</template>

<script>

    import DeclarationComponent, { fetchDeclaration } from 'Components/Declaration';

    export default {
        name: "Declaration",
        components: {
            DeclarationComponent
        },
        created() {
            this.getDeclaration()
        },
        props: ['value'],
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId;
            },
        },
        methods: {
            getDeclaration() {
                const data = {
                    process_id: this.processId,
                    reference_id: this.value.data.id,
                };
                fetchDeclaration(data).then(res => {
                    this.value.declaration.DisplayText = res.data[0].DisplayText;
                })
            },
        }
    }
</script>

<style lang="scss" module>
    .fields {
        width: 600px;
        margin: 0 auto;
    }
</style>
