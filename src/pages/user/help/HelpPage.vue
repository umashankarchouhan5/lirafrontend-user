<template>
    <PageSimple>
        <FormWrapper :isLoading="isLoading">
            <PageTitle title="Help" slot="title" />
            <div v-html="text"></div>
        </FormWrapper>
    </PageSimple>
</template>

<script>

    import { getHelpText } from './api'
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import PageSimple from 'Components/layout/user/PageSimple';
    import loadingMixin from 'Mixins/loadingMixin'

    export default {
        name: "HelpPage",
        data() {
            return {
                text: ''
            }
        },
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            PageSimple
        },
        created() {
            this.showLoader();
            if(this.$route.query.m === undefined){
                getHelpText({
                    process_id: +this.$route.params.id,
                }).then(response => {
                    this.text = response.data.helptext;
                    this.hideLoader();
                    this.moveToTab();
                }).catch(this.hideLoader)
            }
            else{
                getHelpText({
                    process_id: +this.$route.params.id,
                    menu_id: +this.$route.query.m,
                }).then(response => {
                    this.text = response.data.helptext;
                    this.hideLoader();
                    this.moveToTab();
                }).catch(this.hideLoader)
            }
        },
        methods:{
            moveToTab(){
                if(this.$route.params.tab){
                    setTimeout(()=>{
                        var elmnt = document.getElementById(this.$route.params.tab);
                        elmnt.scrollIntoView();

                    },500)
                }
            }
        }
    }
</script>
