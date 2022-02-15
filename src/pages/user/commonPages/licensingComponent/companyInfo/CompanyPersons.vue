<template>
<div>
    <div>

        <ol >
            <!-- <li>To associate a Managerial Staff to the application please click the Associate button.</li>
            <li>You can search the names of Managerial Staff by using the unique PQID of each PQ form you have created.</li>
            <li>One person can be associated to multiple positions (e.g. Director, Shareholder etc..).</li> -->
            <li>
                <ul :class="$style.listStyle">
                    <li>If you have not yet created your PQ form, please <a @click="openPQLink()">click here</a> to create one.</li>
                    <li> If you have created PQ Forms for directors and members of mangerial staff, please click on the associate button below to add PQ Forms to your licence application.</li>
                </ul>
            </li>
            <li>Please use your PQID to search and add a created PQID to your licence application.</li>
            <li>The fit and proper applicant can be associated with multiple positions within the organisational structure of the proposer applicant (e.g. Director, Office Manager, Compliance Officer etc…)</li>
            <li>If you have not yet created any PQ forms, you can select the Save button below, and exit tocomplete the PQ forms.</li>
            <li>The PQ form must be filled in completely along with the PQ Declaration before it can appear in your search.</li>
            <li v-if="$route.path === '/itspForm' || $route.name === 'itspFormRef'"><p>For ITSP application, you need the following managerial staff - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                    <li>Compliance Officer (pursuant to the FSA Act)</li>
                    <li>Compliance Officer (pursuant to the AML/CFT Act)</li>
                    <li>Alternate Compliance Officer (pursuant to the AML/CFT Act)</li>
                </ul>
            </li>
            <li v-if="$route.path === '/fspForm' || $route.name === 'fspFormRef'"><p>For FSP application, you need the following managerial staff - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                    <li>Compliance Officer (pursuant to the FSA Act)</li>
                    <li>Compliance Officer (pursuant to the AML/CFT Act)</li>
                    <li>Alternate Compliance Officer (pursuant to the AML/CFT Act)</li>
                </ul>
            </li>
            <li v-if="$route.path === '/icspForm' || $route.name === 'icspFormRef'"><p>For an ICSP application, the following managerial staff are required - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                    <li>Compliance Officer (pursuant to the FSA Act)</li>
                    <li>Compliance Officer (pursuant to the AML/CFT Act)</li>
                    <li>Alternate Compliance Officer (pursuant to the AML/CFT Act)</li>
                </ul>
            </li>
			<br>
            <i>NB. Regulation 8(2) of the AML/CFT Regulations permits licensees that have 5 staff or less to apply to the FSA for approval to be absolved from the requirement to appoint an Alternate Compliance Officer. Applications for same should be made in writing to the Authority supported by a proposed organizational structure of the applicant.</i>
        </ol>
        <br />

        <DataTable :actions="true" :data="tableData" :columns="tableColumns" @on-selection-change="selectChange">
            <template slot="actionsLeft">
                <TableButton v-if="!readonly" @click="openPQAuth(true)">
                    <img src="../../../../../assets/images/plus.png">
                    Associate
                </TableButton>
                <TableButton v-if="!readonly" @click="remove">
                    <img src="../../../../../assets/images/delete.png">
                    Disassociate
                </TableButton>
            </template>
        </DataTable>

        <br />
    <!-- <Legal  -->
            <LegalComponent :readonly="readonly" v-model="innerValue.legalJson" />
    <!-- Auditor -->
            <AuditorComponent :readonly="readonly" v-model="innerValue.auditorJson" />
    <!-- PQ Popup -->
        <Popup :value="isVisible" @close="() => cancel('appointment')" title="Assign Managerial Staff">
            <ValidationObserver v-if="isVisible" ref="validator">
                <br>
                <FormRow>
                    <div class="col-sm-6">
                        <InputText label="PQ ID" readonly v-model="pq.UniqueRef" />
                    </div>
                    <div class="col-sm-6">
                        <InputText label="Name" readonly v-model="pq.Name" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <FormSelect label="Position for which applying" item-name="Name" rules="required" item-value="id" v-model="data.position" :items="positions" />
                    </div>
                </FormRow>
                <FormRow v-if="data.position == 22">
                    <div class="col-sm-12">
                        <InputText label="Enter name of role" rules="required" v-model="pqPositionName" />
                    </div>
                </FormRow>
            </ValidationObserver>
            <ButtonGroup slot="footer">
                <FormButton @click="submitPosition" type="success">Submit</FormButton>
                <FormButton @click="() => cancel('appointment')">Cancel</FormButton>
            </ButtonGroup>
        </Popup>
        <br />

        <Popup :value="pqAuth.visible" :title="pqAuth.title" type="info" @close="() => pqAuth.visible = false" >
            <h5 v-if="pqAuth.message !== ''">{{pqAuth.message}} </h5>
            <PQPassword v-if="pqAuth.visible" @forgotClicked="onForgot" @resetScreen="onResetScreen" @pqValidation="checkPassword" status="true"  :closePopup="true" @closeModal="openPQAuth(false)" />
        </Popup>

        <ButtonGroup>
            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
            <FormButton type="success" @click="saveRequest">Save</FormButton>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>

    </div>
</div>
</template>

<script>
    import DataTable from 'Components/DataTable'
    import {
        fetchPQPosition,
        searchForPQ,
        assignPosition,
        getICSPRequestPeople,
        removePosition
    } from '../APIRequests'
    import loadingMixin from 'Mixins/loadingMixin'
    import valueMixin from 'Mixins/valueMixin'
    import {
        ValidationObserver
    } from 'vee-validate';
    import DateUtil from 'Utils/dateUtil'
    // import FormAutoComplete from 'Components/form/FormAutoComplete';
    import PQAction from './refCell/referenceCell'
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import LegalComponent from 'Pages/user/commonPages/licensingComponent/legal';
    import AuditorComponent from 'Pages/user/commonPages/licensingComponent/auditor';
    import PQPassword from 'Components/pqPassword';

export default {
    name: "CompanyPersons",
    mixins: [loadingMixin, validateSelectedRows, valueMixin],
    props: {
        value: Object,
        readonly: Boolean
    },
    components: {
        ValidationObserver,
        // FormAutoComplete,
        DataTable,
        LegalComponent,
        AuditorComponent,
        PQPassword
    },
    data() {
        return {
            isVisible: false,
            loaders: {
                pqId: false,
                pqName: false
            },
            pq: {
                UniqueRef: '',
                Name: '',
                id: ''
            },
            pq_list: [],
            positions: [],
            data: {
                position: null,
                Licensee: null,
                name: null,
            },
            pqPositionName: null,
            tableData: [],
            tableColumns: [{
                    type: 'selection',
                    width: 45,
                    align: 'center'
                },
                {
                    title: 'PQ ID',
                    key: 'UniqueRef',
                    width: 110,
                    render: (h, params) => {
                        return h(PQAction, {
                            props: {
                                row: params.row
                            }
                        });
                    },
                },
                {
                    title: 'Name',
                    key: 'Name',
                    maxWidth: 250,
                },
                {
                    title: 'Position',
                    key: 'RoleDesc',
                },
            ],
            selectedRows: [],
            pqAuth: {
                title:'PQ Authenthication',
                message: '',
                visible: false, 
            },
            oldValues: {
                title:'PQ Authenthication',
                message: '',
            }
        }
    },
    watch: {
        'data.position': function (id) {
            if(id !== undefined) {
                this.pqPositionName = null;
            }
            if (id !== undefined && id !== 22) {
                this.pqPositionName = this.positionName
            }
        }
    },
    computed: {
        userData() {
            return this.$store.state.user.user
        },
        positionName() {
            var data = this.positions.filter((val) => {
                return val.id === this.data.position
            });
            return data[0].Name;
        },

        csp_id() {
            return this.$store.state.user.csp_id;
        },
        currentProcessId() {
            return this.$store.state.common.currentProcessId
        },
    },
    created() {
        this.getPositions();
        this.getPeople();
    },
    methods: {
        openPQLink() {
            window.open('/pq-forms','_blank')
        },
        onResetScreen(){
            this.pqAuth.title = this.oldValues.title;
            this.pqAuth.message = this.oldValues.message;
        },
        onForgot(value){
            this.pqAuth.title = value.title;
            this.pqAuth.message = value.message;
        },
        openPQAuth(val){
            this.pqAuth.visible = val;
        },
        checkPassword(val){
            if(val.pq_id){
                this.pq.pq_id = val.pq_id,
                this.pq.UniqueRef = val.UniqueRef,
                this.pq.Name = val.FullName
            }
            this.getPositions();
            this.pqAuth.visible = false;
            this.isVisible = true;
        },
        remove() {
            if (this.validateSelectedLength(1)) {
                var row = this.selectedRows[0];
                removePosition({
                    id: row.id,
                    icsprequest_id: row.icsprequest_id
                }).then(
                    res => {
                        this.getPeople();
                    }
                )
            }
        },
        validateValueNew() {
            return this.pq.UniqueRef.length >= 1
        },
        saveRequest(activeStep) {
            this.$emit('onSave', activeStep)
        },
        nextStep() {
            this.$emit('nextStep')
        },
        prevStep() {
            this.$emit('prevStep')
        },
        add() {
            this.isVisible = true;
        },
        onSelectPQ(pq_id) {
            this.pq = this.pq_list.find(item => item.pq_id === pq_id)
        },
        searchForPQHandler(event) {
            if (event.keyCode === 9 || event.keyCode === 13) {
                if (this.validateValueNew()) {
                    this.loaders.pqId = true;
                    const {
                        Name,
                        UniqueRef
                    } = this.pq;
                    searchForPQ({
                        UniqueRef,
                        Name,
                    }).then(res => {
                        this.loaders.pqName = false;
                        this.loaders.pqId = false;
                        this.pq_list = res.data[0];
                    })
                }
            }
        },
        searchForPQHandler1() {
            this.loaders.pqId = true;
            const {
                Name,
                UniqueRef
            } = this.pq;
            searchForPQ({
                UniqueRef,
                Name,
            }).then(res => {
                this.loaders.pqName = false;
                this.loaders.pqId = false;
                this.pq_list = res.data[0];
            })
        },
        validateValue(value) {
            return value.length > 3
        },
        reset() {
            this.pq = {
                UniqueRef: '',
                Name: '',
                id: ''
            };
            this.data = {
                position_id: null,
                Licensee: null,
                csp_id: null,
                name: null,
            }
        },
        async getPositions() {
            const data ={
                    process_id: this.currentProcessId
                }
                
                const positions = await fetchPQPosition(data);
                this.positions = positions.data;
            // if(this.$route.path === '/icspForm' || this.$route.name === 'icspFormRef'){
            //     const data = {
            //         isICSP: 1
            //     }
            //     const positions = await fetchPQPosition(data);
            //     this.positions = positions.data;
            // }
            // else if(this.$route.path === '/itspForm' || this.$route.name === 'itspFormRef'){
            //     const data = {
            //         isITSP: 1
            //     }
                
            //     const positions = await fetchPQPosition(data);
            //     this.positions = positions.data;
            // }
            // else if(this.$route.path === '/fspForm' || this.$route.name == 'fspFormRef'){
            //     const data ={
            //         isFSP: 1
            //     }
                
            //     const positions = await fetchPQPosition(data);
            //     this.positions = positions.data;
            // }
        },
        async getPeople() {
            const data = {
                icsprequest_id: this.csp_id,
                webuser_id: this.userData.user_id,
            };
            const tableData = await getICSPRequestPeople(data);
            if (tableData.data)
                this.tableData = tableData.data;
        },
        async submitPosition() {
            const result = await this.$refs.validator.validate();
            if (result) {
                this.showLoader();
                const data = {
                    pq_id: this.pq.pq_id,
                    position: this.pqPositionName,
                    persontype_id: this.data.position,
                    icsprequest_id: this.csp_id
                };
                const response = await assignPosition(data);
                this.hideLoader();
                this.reset();
                this.isVisible = false;
                this.getPeople();
            }
        },
        cancel() {
            this.reset();
            this.isVisible = false;
        },
        selectChange(data) {
            this.selectedRows = data;
        },
    }
}
</script>

<style lang="scss" module>
    .listStyle {
        margin-left: 30px;
    }
</style>
