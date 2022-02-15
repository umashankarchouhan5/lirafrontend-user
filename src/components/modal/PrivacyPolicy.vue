<template>
    <Popup :value="value.success.isVisible"
        width="700"
        type="info"
        title="Privacy Policy"
        :closable="true"
        :mask-closable="true"
        @close="() => value.success.isVisible = false">
        <div :class="$style.privacy">
            <template >
                <p>This is to inform users that the Financial Services Authority collects, uses and maintains any information collected from the user of this application confidential. Please note we will collect identification information from users only if the user voluntarily submits such information.</p>
                <br />
                <p>However, the Financial Services Authority reserves the right at all times to disclose any information as necessary to satisfy any applicable law, regulation, any legally enforceable demand, or to edit, refuse to post or to remove any information or materials on the website, in whole or in part, in the Financial Services Authority’s sole discretion. </p>
            </template>
        </div>
    </Popup>
</template>
<script>
export default {
    name: "PrivacyPolicy",
    props: {
        value: Object,
    }
}
</script>

<style lang="scss" module>
.privacy{
    padding: 0px 10px;
    h3{
        margin: 15px 0px;
    }
    p{
        text-align: justify;
    }
}

</style>