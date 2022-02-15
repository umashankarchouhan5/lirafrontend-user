<template>
    <div>
        
        <ol >
            <li>To associate managerial staff please click Assign button. </li>
            <li>You can search the names of managerial staff using the unique PQID for each PQ form you have created or the name.</li>
            <li>You can associate one person in multiple positions.</li>
            <li>If you have not yet created PQ forms, you can press Save button below, and exit to first create PQ forms. </li>
            <li>PQ forms must be filled completely along with declaration before they can appear in your search. </li>

            <li v-if="processId == '2001'"><p>For Securities Dealer License application, you need the following managerial staff - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                    <li>Alternate Compliance Officer</li>
                    <li>AML Compliance Officer</li>
                 </ul>
            </li>
            <!-- <li v-if="processId == '2002'"><p>For Representative License application, you need the following managerial staff </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                </ul>
            </li> -->
            <li v-if="processId == '2003'"><p>For Investment Advisor License (Company) application, you need the following managerial staff -</p> 
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                    <li>Alternate Compliance Officer</li>
                    <li>AML Compliance Officer</li>
                </ul>
            </li>
            <li v-if="processId == '2004'"><p>For Investment Advisor License (Individual) application, you need the following managerial staff - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                    <li>Alternate Compliance Officer</li>
                    <li>AML Compliance Officer</li>
                </ul>
            </li>
            <li v-if="processId == '2005'"><p>For Security Exchange License application, you need the following managerial staff - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                    <li>Alternate Compliance Officer</li>
                    <li>AML Compliance Officer</li>
                </ul>
            </li>
            <li v-if="processId == '2006'"><p>For Securities Facility License application, you need the following managerial staff - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                    <li>Alternate Compliance Officer</li>
                    <li>AML Compliance Officer</li>
                </ul>
            </li>
            <li v-if="processId == '2007'"><p>For Clearing Agency License application, you need the following managerial staff - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                    <li>Alternate Compliance Officer</li>
                    <li>AML Compliance Officer</li>
                </ul>
            </li>
            <li v-if="processId == '2008'"><p>For Exempt Overseas Securities Dealer License application, you need the following managerial staff - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                </ul>
            </li>
            <li v-if="processId == '3001'"><p>For Domestic Insurer License application, you need the following managerial staff - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                    <li>Alternate Compliance Officer</li>
                    <li>AML Compliance Officer</li>
                    <li>Money Laundering Officer</li>
                </ul>
            </li>
            <li v-if="processId == '4001'"><p>For Casino and Slot Machine License application, you need the following managerial staff - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                    <li>Alternate Compliance Officer</li>
                    <li>AML Compliance Officer</li>
                    <li>Money Laundering Officer</li>
                </ul>
            </li>
            <li v-if="processId == '2000'"><p>For Fund Licence application, you need the following managerial staff - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                    <li>Alternate Compliance Officer</li>
                    <li>AML Compliance Officer</li>
                    <li>Money Laundering Officer</li>
                </ul>
            </li>
            <li v-if="processId == '2011'"><p>For Approved Foreign Administrator License application, you need the following managerial staff - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                    <li>Compliance Officer</li>
                    <li>AML Compliance Officer</li>
                </ul>
            </li>
            <li v-if="processId == '2012'"><p>For Exempt Foreign Fund License application, you need the following managerial staff - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                </ul>
            </li>
            <li v-if="processId == '2013'"><p>For Fund Administrator License application, you need the following managerial staff - </p>
                <ul :class="$style.listStyle">
                    <li>Two or more Directors</li>
                    <li>Alternate Compliance Officer</li>
                    <li>AML Compliance Officer</li>
                    <li>Compliance Officer</li>
                </ul>
            </li>
        </ol>




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
</template>

<script>
    import DataTable from 'Components/DataTable'
    import {
        getLicenseRequestpeople,
        fetchPQPositionByProcess,
        assignLicenseePosition,
        assignPosition,
        removeLicenseePosition
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
    import PQPassword from 'Components/pqPassword';

export default {
    name: "CompanyPersons",
    mixins: [loadingMixin, validateSelectedRows, valueMixin],
    props: {
        value: [Object,Array],
        readonly: Boolean,
        reference_id: [String,Number],
    },
    components: {
        ValidationObserver,
        DataTable,
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
        processId() {
            return this.$store.state.common.currentProcessId
        },

    },
    created() {
        this.getPositions();
        this.getPeople();
    },
    methods: {
        
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
            this.pqAuth.visible = false;
            this.isVisible = true;
        },
        remove() {
            if (this.validateSelectedLength(1)) {
                var row = this.selectedRows[0];
                removeLicenseePosition({
                    id: row.id,
                    licenseRequest_id: row.licenserequest_id
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
                licenseRequest_id: null,
                name: null,
            }
        },
        async getPositions() {
                const data = {
                    process_id: this.processId
                }
                const positions = await fetchPQPositionByProcess(data);
                this.positions = positions.data;
        },
        async getPeople() {
            const data = {
                licenseRequest_id: this.reference_id
            };
            const tableData = await getLicenseRequestpeople(data);
            if (tableData.data){
                this.tableData = tableData.data;
            }
        },
        async submitPosition() {
            const result = await this.$refs.validator.validate();
            if (result) {
                this.showLoader();
                const data = {
                    pq_id: this.pq.pq_id,
                    position: this.pqPositionName,
                    personType_id: this.data.position,
                    licenseRequest_id: this.reference_id
                };
                const response = await assignLicenseePosition(data);
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
