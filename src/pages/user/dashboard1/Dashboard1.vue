<template>
    <FormWrapper >
        <PageTitle title="Dashboard" slot="title" />

        <div :class="$style.main">
            <div :class="$style.fsa_image"></div>
            <div :class="$style.content">
                <h1>FSA</h1>
                <br />
                <h3 >Our Vision</h3>
                <br />
                <ul :class="$style.list">
                    <li>To safeguard the interest of the Seychelles non-bank financial services sector, through the establishment of a sound and ethical regulatory environment.</li>
                </ul>
                <br>
                <div >
                    <h3>Our Mission</h3>
                <br />
                    <ul :class="$style.list">

                        <li>To uphold the good repute of the Seychelles through good governance and sound regulatory systems.</li>
                        <li>To promote capacity building, innovation and efficiency of services of services within the non-bank financial services sector.</li>
                        <li>Ensuring compliance with international regulatory norms and best practices.</li>
                    </ul>
                </div><br>
                <div >
                    <h3>Our Core Values</h3>
                <br />
                    <ul :class="$style.list">
                        <li>Vigilance</li>
                        <li>Integrity</li>
                        <li>Professionalism</li>
                    </ul>
                </div>
            </div>
        </div>
    </FormWrapper>
</template>
<script>

    import FormWrapper from 'Components/form/FormWrapper'
    import PageTitle from 'Components/layout/PageTitle'

    export default {
        name: 'DashBoard',
        components: {
            FormWrapper,
            PageTitle
        }
        
    }
</script>

<style lang="scss" module>
    .main {
        position: relative;
        .fsa_image {

            // background-image: url("http://apit.lira2020.com/api/uploads/user/FSA_LOGO_FULL_COLOUR_WEB.jpg");
            background-image: url("../../../assets/images/logo_web.png");
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            margin: auto;
            opacity: 0.4;
            position: absolute;
            width: 100%;
            height: 100%;
            top : 0;
            left: 0;
            z-index: 0;
        }
        .content {
            z-index: 1;
            position: relative;
        }
        .list{
            margin-left: 30px;
        }
    }

</style>