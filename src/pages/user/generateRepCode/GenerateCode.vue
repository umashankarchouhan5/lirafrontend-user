<template>
    <FormWrapper>
        <PageTitle title="Generate Code" slot="title" />
        <div>
            
            <div v-if="code !== ''">
                <p :class="$style.codeStyle">Your generated code is <span>{{code}}</span> </p>
            </div>
            <FormButton @click="generateCode()">Generate New Code</FormButton>
        </div>

    </FormWrapper>
</template>

<script>
    import { generateRepCode } from './api';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';

    export default {
        components: {
            FormWrapper,
            PageTitle
        },
        data() {
            return {
                code: '',
            }
        },
        methods: {
            generateCode(){
                generateRepCode().then(
                    res => {
                        this.code = res.data.sharingCode;
                    }
                )
            }
        }
    }
</script>
<style lang="scss" module>
    .codeStyle {
        margin-bottom: 15px;
        span {
            font-weight: 700;
            font-size: 14px;
        }
    }
</style>