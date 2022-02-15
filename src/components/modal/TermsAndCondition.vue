<template>
    <Popup :value="value.success.isVisible"
        width="700"
        type="info"
        title="Terms and Conditions"
        :closable="true"
        :mask-closable="true"
        @close="() => value.success.isVisible = false">
        <div :class="$style.terms">
            <template >

                <p>As a condition of your use of this Financial Services Authority’s application, you warrant to the Authority that you will not use it for any purpose that is unlawful or prohibited by these terms, conditions, and notices. You may also not use it in any manner, which could damage, disable, overburden or impair or interfere with any other party's use of the application. You may not obtain or attempt to obtain any material or information through any means not intentionally made available or provided for through the application.</p>
                <br />
                <p>The Financial Services Authority reserves the right at all times to change the terms, conditions and notices under the Financial Services Authority’s, including but not limited to the charges associated with the use of the Financial Services Authority’s application. </p>
                <br />
                <p>Your use of the Financial Services Authority’s application constitutes your agreement to all such terms, conditions, and notices including the understanding that access to this application is at user’s own risk.</p>

            </template>
        </div>
    </Popup>
</template>
<script>
export default {
    name: "TermsAndCondition",
    props: {
        value: Object,
    }
}
</script>

<style lang="scss" module>
.terms{
    padding: 0px 10px;
    h3{
        margin: 15px 0px;
    }
    p{
        text-align: justify;
    }
}

</style>