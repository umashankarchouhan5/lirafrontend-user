<template>
    <div>
        <DataTable :actions="true"
            :data="personData"
            :columns="tableColumns"
            @on-selection-change="selectChange"
        >
            <template slot="actionsLeft" v-if="!readonly">
                <TableButton @click="openPQAuth(true)">
                    <img src="../../../../../assets/images/plus.png">
                    Associate 
                </TableButton>
                <TableButton @click="() => addChange('cessation')">
                    <img src="../../../../../assets/images/cessation.png">
                    Disassociate
                </TableButton>
                <TableButton @click="() => addChange('changeRole')">
                    <img src="../../../../../assets/images/cessation.png">
                    Change
                </TableButton>
            </template>
        </DataTable>
        <br />
        <Popup :value="modals.appointment.visible"  @close="() => cancel('appointment')" title="Change in Position">
            <Loader v-if="modals.appointment.loading" />
            
            <ValidationObserver tag="div" ref="CompanyPerson" v-if="modals.appointment.visible" >
                <FormRow>
                    <div class="col-sm-6">
                        <InputText label="PQ ID" readonly v-model="pq.UniqueRef" />
                    </div>
                    <div class="col-sm-6">
                        <InputText label="Name" readonly v-model="pq.Name" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-8">
                        <FormSelect label="Position for which applying"
                            item-name="Name"
                            rules="required"
                            item-value="id"
                            v-model="data.persontype_id"
                            :items="positions" />
                    </div>
                    <div class="col-sm-4">
                        <InputDate label="Date of Appointment" :options="dateOptions" rules="required" v-model="data.EffectiveDate"/>
                    </div>
                </FormRow>
                <FormRow v-if="data.persontype_id == 22">
                    <div class="col-sm-12">
                        <InputText label="Enter name of role" rules="required" v-model="pqPositionName" />
                    </div>
                </FormRow>
                
            </ValidationObserver>
            <ButtonGroup slot="footer">
                <FormButton @click.prevent="() =>saveData('appointment')" type="success">Save</FormButton>
                <FormButton @click="() => cancel('appointment')">Cancel</FormButton>
            </ButtonGroup>
        </Popup>

        <Popup :value="modals.changeRole.visible"  @close="() => cancel('changeRole')" title="Change in Position">
            <Loader v-if="modals.changeRole.loading" />
            <ValidationObserver tag="div" ref="CompanyPerson" v-if="modals.changeRole.visible" >
                <!-- <FormRow>
                    <div class="col-sm-6">
                        <InputText label="PQ ID" readonly v-model="pq.UniqueRef" />
                    </div>
                    <div class="col-sm-6">
                        <InputText label="Name" readonly v-model="pq.Name" />
                    </div>
                </FormRow> -->
                <FormRow>
                    <div class="col-sm-8">
                        <FormSelect label="Position for which applying"
                            item-name="Name"
                            rules="required"
                            item-value="id"
                            v-model="data.persontype_id"
                            :items="positions" />
                    </div>
                    <div class="col-sm-4">
                        <InputDate label="Date of Appointment" :options="dateOptions" rules="required" v-model="data.EffectiveDate"/>
                    </div>
                </FormRow>
                <FormRow v-if="data.persontype_id == 22">
                    <div class="col-sm-12">
                        <InputText label="Enter name of role" rules="required" v-model="pqPositionName" />
                    </div>
                </FormRow>
                
            </ValidationObserver>
            <ButtonGroup slot="footer">
                <FormButton @click.prevent="() =>saveData('changeRole')" type="success">Save</FormButton>
                <FormButton @click="() => cancel('changeRole')">Cancel</FormButton>
            </ButtonGroup>
        </Popup>

        <Popup :value="modals.cessation.visible" @close="() => cancel('cessation')" title="Cessation">
            <Loader v-if="modals.cessation.loading"/>
            <ValidationObserver tag="div" ref="CompanyPerson" v-if="modals.cessation.visible" >
            <FormRow>
                <div class="col-sm-4">
                    <InputDate :options="dateOptions" rules="required" label="Date of Cessation" v-model="data.EffectiveDate" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputText label="Reason of Resignation" rules="required" v-model="data.ResignationReason"/>
                </div>
            </FormRow>
            </ValidationObserver>
            <ButtonGroup slot="footer">
                <FormButton @click="() => saveData('cessation')" type="success">Save</FormButton>
                <FormButton @click="() => cancel('cessation')">Cancel</FormButton>
            </ButtonGroup>
        </Popup>

        <Popup :value="modals.success.visible" type="success" @close="() => modals.success.visible = false"
               title="Success">
            <p>Record has been saved!</p>
            <FormButton slot="footer" @click="() => modals.success.visible = false">Ok</FormButton>
        </Popup>
        <Popup :value="pqAuth.visible" :title="pqAuth.title" type="info" >
            <h5 v-if="pqAuth.message !== ''">{{pqAuth.message}} </h5>
            <PQPassword v-if="pqAuth.visible"  @forgotClicked="onForgot" @resetScreen="onResetScreen"  @pqValidation="checkPassword" :closePopup="true" @closeModal="openPQAuth(false)" />
               
        </Popup>
        
        <Popup title="Information"  :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>

    </div>
</template>

<script>
    
    import DataTable from 'Components/DataTable'
    import loadingMixin from 'Mixins/loadingMixin'
    import InputDate from 'Components/form/InputDate';
    import DateUtil from 'Utils/dateUtil';
    import valueMixin from 'Mixins/valueMixin';
    import { changePeople, fetchPQPosition, searchForPQ, } from '../api';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import PQPassword from 'Components/pqPassword';
    import { ValidationObserver } from "vee-validate";

    export default {
        name: "CompanyPersons",
        mixins: [valueMixin,loadingMixin,validateSelectedRows],
        components: {
            InputDate,
            DataTable,
            PQPassword,
            ValidationObserver
        },
        props: {
            value: Object,
            personData: Array,
            readonly: Boolean,
            licenseType: String
        },
        data() {
            return {
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
                modals: {
                    warning: {
                        visible: false
                    },
                    appointment: {
                        visible: false,
                        loading: false
                    },
                    cessation: {
                        visible: false,
                        loading: false
                    },
                    changeName: {
                        visible: false,
                        loading: false
                    },
                    changeAddress: {
                        visible: false,
                        loading: false
                    },
                    success: {
                        visible: false,
                        loading: false
                    },
                    changeRole: {
                        visible: false,
                        loading: false
                    }
                },
                peopleList: [],
                changeTypes: {
                    appointment: 'APPT',
                    cessation: 'CESS',
                    changeRole: 'CHANGE'
                },
                selectedRows: [],
                data: {
                    person_id: '',
                    ChangeType: null,
                    EffectiveDate: '',
                    ResignationReason: '',
                    pq_id: '',
                    persontype_id: '',
                    companypeople_id: 0
                },
                positions: [],
                dateOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                tableData: [],
                tableColumns: [
                    {
                        type: 'selection',
                        width: 38,
                        align: 'center'
                    },
                    
                    {
                        title: 'PQ ID',
                        key: 'uniqueRef',
                        width: 80
                    },
                    {
                        title: 'Name',
                        render: (h, params) => {
                            return h('span', (params.row.Salutation ? params.row.Salutation : '')+ ' ' + params.row.Fname + ' ' + params.row.Lname);
                        },
                    },
                    {
                        title: 'Position',
                        key: 'position',
                    },
                    {
                        title: 'ChangeType',
                        key: 'ChangeType',
                    },
                    {
                        title: 'Effective Date',
                        render: (h, params) => {
                            return h('span', DateUtil.formatDate(params.row.effectivedate));
                        },
                        align: 'left',
                        width: 100
                    }
                ],
                pqAuth: {
                    title:'PQ Authenthication',
                    message: '',
                    visible: false, 
                },
                oldValues: {
                    title:'PQ Authenthication',
                    message: '',
                },
                pqPositionName: null,
                ICSPChangePeopleRequest_id: null,
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user;
            },
            currentAddressId() {
                return this.data.person_id ? this.peopleList.find(item => item.person_id === this.data.person_id).Address : '';
            }
        },
        watch:{
            personData(val){
                if(val.length > 0){
                    this.tableData = val;
                }
                if(val === null){
                    this.personData = [];
                }
            },
            'data.person_id':function(val){
                if(val !== '' && val !== undefined){
                    if(this.data.ChangeType !== "NAME"){
                        this.data.Name = this.peopleList.find(item => item.person_id === val).Name;
                    }
                    if(this.data.ChangeType !== "ADDR"){
                        this.data.ResidenceAddress = this.peopleList.find(item => item.person_id === val).Address;
                    }
                    if(val !== undefined && val !== 22) {
                        this.pqPositionName = null;
                    }
                }
            },
            'data.persontype_id':function(val){
                if(val !== '' && val !== undefined && val !== null){
                    if(val !== 22) {
                        this.pqPositionName = this.positions.find(item => item.id === val).Name;
                    }
                    if(val == 22){
                        this.pqPositionName = ''
                    }
                }
            },
        },
        created() {
            this.getPositions();
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
                    this.data.pq_id = val.pq_id,
                    this.pq.UniqueRef = val.UniqueRef,
                    this.pq.Name = val.FullName
                }
                this.pqAuth.visible = false;
                this.add();
            },
            async getPositions() {
                if(this.licenseType == "ICSP"){
                    const data = {process_id: 700}
                    const positions = await fetchPQPosition(data);
                    this.positions = positions.data;
                }
                else if(this.licenseType == "ITSP"){
                    const data = {process_id: 704}
                    const positions = await fetchPQPosition(data);
                    this.positions = positions.data;
                }
                else if(this.licenseType == "FSP"){
                    const data = {process_id: 701}
                    const positions = await fetchPQPosition(data);
                    this.positions = positions.data;
                }
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            personJsonData(){
                return JSON.parse(this.innerValue.peopleJson)
            },
            getPeopleHandler() {
                getchangePeopleRequestList({
                    Company_id: this.innerValue.Company_id,
                    process_id: this.innerValue.process_id,
                    reference_id: this.innerValue.reference_id
                }).then(res => {
                    this.tableData = res.data;
                })
            },
            resetData() {
                this.data = {
                    ChangeType: null,
                    EffectiveDate: '',
                    ResignationReason: '',
                    person_id: '',
                    persontype_id: '',
                    companypeople_id: 0
                };
                this.pqPositionName = null;
            },
            saveData(type) {
                this.$refs.CompanyPerson.validate().then(
                    res => {
                        if(res){
                            this.modals[type].loading = true;
                            changePeople({

                                ...this.data,
                                process_id: this.innerValue.process_id,
                                reference_id: this.innerValue.reference_id,
                                position: this.pqPositionName,
                                ...(type == 'changeRole' && { ICSPChangePeopleRequest_id : this.ICSPChangePeopleRequest_id})
                            }).then(res => {
                                this.modals[type].loading = false;
                                this.personData = JSON.parse(res.data[0].PeopleJson)
                                this.resetData();
                                this.modals.success.visible = true;
                                this.modals[type].visible = false;
                                this.$emit('onAction',true);
                            }).catch(() => {
                                this.modals[type].loading = false;
                            })
                        }
                    }
                )
                
            },
            cancel(type) {
                this.modals[type].visible = false;
                this.resetData();
            },
            add() {
                this.data.ChangeType = this.changeTypes.appointment;
                this.modals.appointment.visible = true;
            },
            addChange(type) {
                if (this.validateSelectedLength(1)){
                    var row = this.selectedRows[0];
                    this.modals[type].visible = true;
                    this.data.pq_id = row.pq_id;
                    if(type != 'changeRole'){
                        this.data.persontype_id = row.persontype_id;
                        this.data.companypeople_id = row.companypeople_id;
                    }
                    if(type == 'changeRole'){
                        this.ICSPChangePeopleRequest_id = row.id;
                        this.data.companypeople_id = row.companypeople_id;
                    }
                    this.data.ChangeType = this.changeTypes[type];
                }
            }
        }
    }
</script>
