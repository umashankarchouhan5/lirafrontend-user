<template>
    <CenterBlock :width="900">
        <FormRow>
            <div class="col-sm-12">
                <h3>Declare: </h3>
                <br/>
                <ol :class="$style.justifyText">
                    <li>that I have, to the best of my knowledge, truthfully and fully answered the relevant questions in this Questionnaire and disclosed any information which might reasonably be considered relevant; </li>
                    <li>that I will promptly notify the Financial Services Authority of any changes in the information I have provided and supply any other information that may arise; and </li>
                    <li>that I fully understand and acknowledge that a failure on my part to comply with the declaration will render the application liable to be refused and, if such failure is discovered after the application has been accepted, will render the application liable to be suspended or revoked.</li>
                </ol>

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
    .justifyText{
        text-align: justify;
    }
    .fields {
        width: 600px;
        margin: 0 auto;
    }
</style>
