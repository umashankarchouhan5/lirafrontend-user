<template>
    <div>
        <p>Details of any higher academic qualifications and the year in which they were obtained. (E.g. BA, LLB,
            MBA, etc.). Please provide certified true copies of certificates in relation to the qualifications
            obtained. In the event that the applicant is unable to provide proof of a stated qualification, the
            Authority would not consider the stated qualification in its assessment.</p>
        <AcadQualificationsRecords :pq-id="value.data.id" v-model="value.records.AQual" :readonly="readonly || value.NA" v-if="value.records" />
        <br>

        <p>Details of any professional qualifications and the year in which they were obtained (E.g. ACA, ACCA, ACIB
            etc.). Please provide certified true copies of certificates in relation to the qualifications obtained.
            Part Qualifications may also be included provided that they are indicated accordingly. In the event that
            the applicant is unable to provide proof of a stated qualification, the Authority would not consider the
            stated qualification in its assessment.</p>
        <p :class="$style.pad">
            <FormCheckbox :disabled="readonly" name="Not Applicable" :trueValue="1"  :falseValue="0 || null" v-model="value.data.NAProfQualification" ><span ><b> Not Applicable</b></span></FormCheckbox>
        </p>
        <ProfQualificationsRecords
            :pq-id="value.data.id"
            v-model="value.records.PQual"
            :notRequired="value.data.NAProfQualification === 1"
            :readonly="readonly || value.data.NAProfQualification === 1"
            v-if="value.records" />
        <br>

        <p>Details of current membership of any relevant professional bodies, their contact details and year of
            admission (e.g. Institute of Directors, Institute of Management, etc.).</p>
        <p :class="$style.pad">
            <FormCheckbox :disabled="readonly" name="Not Applicable" :trueValue="1"  :falseValue="0 || null" v-model="value.data.NAMemberShip" ><span ><b> Not Applicable</b></span></FormCheckbox>
        </p>
        <CurrentMembershipRecords :pq-id="value.data.id"
            v-model="value.records.CMemb"
            :readonly="readonly || value.data.NAMemberShip === 1"
            :notRequired="value.data.NAMemberShip === 1"
            v-if="value.records" />
        <br>

        <p>Details of any relevant training undertaken (e.g. AML/ CFT Training, Compliance Training, etc.)</p>
        <p :class="$style.pad">
            <FormCheckbox :disabled="readonly" name="Not Applicable" :trueValue="1"  :falseValue="0 || null" v-model="value.data.NATraining" ><span ><b> Not Applicable</b></span></FormCheckbox>
        </p>
        <TrainingRecords 
            :pq-id="value.data.id"
            v-model="value.records.Train"
            :readonly="readonly || value.data.NATraining === 1"
            :notRequired="value.data.NATraining === 1"
            v-if="value.records" />
        <br>
    </div>
</template>

<script>

    import AcadQualificationsRecords from './AcadQualificationsRecords'
    import ProfQualificationsRecords from './ProfQualificationsRecords'
    import CurrentMembershipRecords from './CurrentMembershipRecords'
    import TrainingRecords from './TrainingRecords'

    export default {
        name: "Qualifications",
        components: {
            AcadQualificationsRecords,
            ProfQualificationsRecords,
            CurrentMembershipRecords,
            TrainingRecords,
        },
        props: ['value', 'qualificationTypes', 'stepId','readonly'],
    }
</script>

<style lang="scss" module>
    .pad {
        // padding-left: 30px;
        margin-top: -10px;
    }
</style>