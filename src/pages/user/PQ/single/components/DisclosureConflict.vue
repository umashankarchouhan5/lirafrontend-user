<template>
    <div>
        <p><strong>Please be advised that the information provided below will not affect your
            application.
            It is requested so that the  Authority can identify and manage potential conflicts of interest, both in the handling of this application
            and in any  future dealings with your organization.</strong></p>
        <p>Do you have any close connection with a member or  employee
            of the  Authority  (for  example,  friends,  close  business  relationship  or  immediate  family
            which includes spouse, partner, children and their  spouses or partners, parents or siblings)
            <span class="text-danger">*</span>
        </p>
        <FormRow>
            <div class="col-sm-8">
                <InputTextArea rows="3" rules="required" name="above field"  :readonly="readonly" :noLabel=true v-model="value.data.Conflict" />
            </div>
        </FormRow>
        <p>Please disclose any other facts that you believe are material to the Authority in considering your application.<span class="text-danger">*</span></p>
        <FormRow>
            <div class="col-sm-8">
                <InputTextArea rows="5" name="above field" rules="required" v-model="value.data.OtherFact" :readonly="readonly"/>
            </div>
        </FormRow>
    </div>
</template>

<script>
    export default {
        name: "DisclosureConflict",
        props: ['value','readonly'],
    }
</script>
