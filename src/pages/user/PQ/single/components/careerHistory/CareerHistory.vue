<template>
    <div>
        <p>Beginning with your present occupation or employment, please list all occupations and employment during the last 10 years including the full name and addresses of the employers, the nature of the businesses, the positions held and the relevant dates. Kindly provide the latest employment reference from the list below (NB: The Authority may seek references from previous employers.)
        </p>
        <p :class="$style.pad">
            <FormCheckbox :disabled="readonly" name="Not Applicable" :trueValue="1"  :falseValue="0 || null" v-model="value.data.NAEmployment" ><span><b> Not Applicable</b></span></FormCheckbox>
        </p>
        
        <!-- <br /> -->
        <EmployerRecords v-model="value.records.Emplr" :readonly="readonly || value.data.NAEmployment === 1" :notRequired="value.data.NAEmployment === 1" :pq-id="value.data.id" />
        <br>

        <p>Details of any body corporate of which you are a Director or Secretary.</p>
        <p :class="$style.pad">
            <FormCheckbox :disabled="readonly" name="Not Applicable" :trueValue="1"  :falseValue="0 || null" v-model="value.data.NADirector" ><span ><b> Not Applicable</b></span></FormCheckbox>
        </p>
        <DirectorRecords v-model="value.records.Direc" :readonly="readonly || value.data.NADirector === 1" :notRequired="value.data.NADirector === 1" :pq-id="value.data.id" />
        <br>

        <p>Details of any Trust on which you are the trustee, enforcer or protector in a personal capacity.</p>
        <p :class="$style.pad">
            <FormCheckbox :disabled="readonly" name="Not Applicable" :trueValue="1"  :falseValue="0 || null" v-model="value.data.NATrust" ><span ><b> Not Applicable</b></span></FormCheckbox>
        </p>
        <TrusteeRecords v-model="value.records.Trust" :readonly="readonly || value.data.NATrust === 1" :notRequired="value.data.NATrust === 1" :pq-id="value.data.id" />
        <br>

        <p>Details of any body corporate of which you are in partnership, have other business interests or affiliations</p>
        <p :class="$style.pad">
            <FormCheckbox :disabled="readonly" name="Not Applicable" :trueValue="1"  :falseValue="0 || null" v-model="value.data.NAPartnership" ><span ><b> Not Applicable</b></span></FormCheckbox>
        </p>
        <PartnerRecords v-model="value.records.Partn" :readonly="readonly || value.data.NAPartnership === 1" :notRequired="value.data.NAPartnership === 1" :pq-id="value.data.id" />
        <br>

        <p>Details of any previous approvals as a key person by a relevant financial services regulatory authority (or equivalent) in any jurisdiction (if applicable), including Seychelles.</p>
        <p :class="$style.pad">
            <FormCheckbox :disabled="readonly" name="Not Applicable" :trueValue="1"  :falseValue="0 || null" v-model="value.data.NAPreviousApprovalByFSA" ><span ><b> Not Applicable</b></span></FormCheckbox>
        </p>
        <KeyPersonRecords v-model="value.records.KPer" :readonly="readonly || value.data.NAPreviousApprovalByFSA === 1" :notRequired="value.data.NAPreviousApprovalByFSA === 1" :pq-id="value.data.id" />
        <br>
        
        <p>Details of any previous applications made by you, or any body corporate, partnership or unincorporated institution with which you are, or have been  associated as a director, controller, key person or company secretary, to carry on any financial services activity whether successful or not.</p>
        <p :class="$style.pad">
            <FormCheckbox :disabled="readonly" name="Not Applicable" :trueValue="1"  :falseValue="0 || null" v-model="value.data.NAPreviousApplication" ><span ><b> Not Applicable</b></span></FormCheckbox>
        </p>
        <PrevApplnRecords v-model="value.records.PrevA" :readonly="readonly || value.data.NAPreviousApplication === 1" :notRequired="value.data.NAPreviousApplication === 1" :pq-id="value.data.id" />
        <br>
    </div>
</template>

<script>
    import EmployerRecords from './EmployerRecords'
    import DirectorRecords from './DirectorRecords'
    import TrusteeRecords from './TrusteeRecords'
    import KeyPersonRecords from './KeyPersonRecords'
    import PartnerRecords from './PartnerRecords'
    import PrevApplnRecords from './PrevApplnRecords'

    export default {
        name: "CareerHistory",
        props: ['value','readonly'],
        data() {
            return {
                time: [
                    {
                        id: 'F',
                        name: 'Full Time'
                    },
                    {
                        id: 'P',
                        name: 'Part Time'
                    }
                ],
                agree: ['Yes', 'No'],
                period: ['None', '1 Month', '6 Months']
            }
        },
        components: {
            TrusteeRecords,
            KeyPersonRecords,
            PartnerRecords,
            PrevApplnRecords,
            EmployerRecords,
            DirectorRecords
        }
    }
</script>

<style lang="scss" module>
    .pad {
        // padding-left: 30px;
        margin-top: -10px
    }
</style>
