<template>
    <div>
        <p>
            <strong>
                If any of the answers to questions below are "Yes", please upload full details relating to the question. Please note that no time restrictions apply to the matters you are asked to disclose. Any convictions and other facts must be stated. The questions refer to all jurisdictions and countries, and your answers should not be restricted to any one jurisdiction in isolation. Declaring a conviction etc. should not be seen as an automatic bar to licensing, as all matters are judged individually on their merits.
            </strong>
        </p>

        <div v-for="(item, i) in value.checkList"  :key="item.PQMasterChecklist_id">
            <CivilDisciplinaryItem :readonly="readonly" v-model="value.checkList[i]" :i="i" >
                {{ item.QText }}
            </CivilDisciplinaryItem>
        </div>
        <br>
        <p>Provide details of all banks (or other financial institutions) which you have conducted your financial affairs over the previous five years.</p>

        <BankRecords v-model="value.records.Bank" :readonly="readonly" :pq-id="value.data.id" />
        <br>
    </div>
</template>

<script>

    import CivilDisciplinaryItem from './CivilDisciplinaryItem'
    import BankRecords from './BankRecords'
    import { getPQChecklistDataByPQId, addUpdatePQFormChecklistData } from '../../config/requests'

    export default {
        name: "CivilDisciplinary",
        data() {
            return {
                banks: []
            }
        },
        props: ['value','readonly'],
        components: {
            CivilDisciplinaryItem,
            BankRecords
        },
    }
</script>
