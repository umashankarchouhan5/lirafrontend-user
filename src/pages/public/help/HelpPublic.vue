<template>
    <FormWrapper :isLoading="isLoading">
        <PageTitle v-if="$route.path !== '/helpPublicPage/101'" title="Help" slot="title" />
        <PageTitle v-if="$route.path === '/helpPublicPage/101'" title="Instruction For Completing New user Registration" slot="title" />
        <FormRow>
            <SideLogo></SideLogo>
            <div class="col-sm-9">
                <div v-html="text"></div>
            </div>
        </FormRow>
    </FormWrapper>
</template>

<script>
    import SideLogo from 'Components/layout/public/SideLogo/SideLogo'
    import { getHelpText } from './api'
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin'
    import Ajax from 'Utils/ajax'
    import Auth from 'Utils/auth'

    export default {
        name: "HelpPublic",
        data() {
            return {
                text: ''
            }
        },
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            SideLogo
        },
        computed: {
            
            userData() {
                return this.$store.state.user.user;
            },
        },
        created() {
            this.showLoader();
            getHelpText({
                process_id: +this.$route.params.id,
            }).then(response => {
                this.text = response.data.helptext;
                this.hideLoader();
            }).catch(this.hideLoader)
            
            if(this.userData !== null){
                Auth.logoutUser();
                Ajax.removeToken();
                this.$router.go();
            }
        }
    }
</script>
<style lang="scss" module>
    p{
        text-align: left !important;
        font-size: 14px;
        font-family: 'Roboto';
        margin-bottom: 15px;
    }
    ul{
        padding: 0px 10px;

        li{
            // font-size: 11px;
            margin-bottom: 10px;
        }
    }
</style>