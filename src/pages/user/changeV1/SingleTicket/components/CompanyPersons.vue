<template>
    <div>
        <DataTable :actions="true"
                   :data="tableData"
                   :columns="tableColumns()">
            <template slot="actionsLeft" v-if="!readonly">
                <TableButton @click="add">
                    <img src="../../../../../assets/images/plus.png">
                    Appointment
                </TableButton>
                <TableButton @click="() => addChange('cessation')">
                    <img src="../../../../../assets/images/cessation.png">
                    Cessation
                </TableButton>
                <TableButton @click="() => addChange('changeName')">
                    <img src="../../../../../assets/images/changes.png">
                    Change Name
                </TableButton>
                <TableButton @click="() => addChange('changeAddress')">
                    <img src="../../../../../assets/images/changes.png">
                    Change Address
                </TableButton>
            </template>
        </DataTable>

        <Popup :value="modals.appointment.visible" @close="() => cancel('appointment')" :title="entityType && entityType.toLowerCase() == 'lp' ? 'Partner Appointment':'Councillor Appointment'">
            <Loader v-if="modals.appointment.loading"/>
            <ValidationObserver v-if="modals.appointment.visible" ref="appointmentValidator" v-slot="{ passes }">
                <FormRow>
                    <div class="col-sm-4">
                        <InputText label="Name" rules="required" v-model="data.Name"/>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <InputText label="Address" rules="required" v-model="data.ResidenceAddress"/>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <InputDate label="Date of Appointment" rules="required" :options="dateOptions" v-model="data.EffectiveDate"/>
                    </div>
                </FormRow>
                <ButtonGroup slot="footer">
                    <FormButton @click.prevent="() => passes(callApointment)" type="success">Save</FormButton>
                    <FormButton @click="() => cancel('appointment')">Cancel</FormButton>
                </ButtonGroup>
            </ValidationObserver>
        </Popup>

        <Popup :value="modals.cessation.visible" @close="() => cancel('cessation')" :title="entityType && entityType.toLowerCase() == 'lp' ? 'Cessation of a Partner':'Cessation of a Councillor'">
            <Loader v-if="modals.cessation.loading"/>
            <ValidationObserver v-if="modals.cessation.visible" ref="cessationValidator" v-slot="{ passes }">
            <FormRow>
                <div class="col-sm-12">
                    <FormSelect :items="peopleList"
                        rules="required"
                        item-value="person_id"
                        item-name="Name"
                        name="Select Person"
                        v-model="data.person_id"/>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputText label="Address" readonly :value="currentAddressId" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputDate :options="dateOptions" rules="required" label="Date of Cessation" v-model="data.EffectiveDate" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputText label="Reason of Resignation" rules="required" v-model="data.ResignationReason"/>
                </div>
            </FormRow>
            <ButtonGroup slot="footer">
                <FormButton @click="() => passes(callCessation)" type="success">Save</FormButton>
                <FormButton @click="() => cancel('cessation')">Cancel</FormButton>
            </ButtonGroup>
            </ValidationObserver>
        </Popup>

        <Popup :value="modals.changeName.visible" @close="() => cancel('changeName')" :title="entityType && entityType.toLowerCase() == 'lp' ? 'Change of Name of a Partner':'Change of Name of a Councillor'">
            <Loader v-if="modals.changeName.loading" />
            
            <ValidationObserver v-if="modals.changeName.visible" ref="changeNameValidator" v-slot="{ passes }">
            <FormRow>
                <div class="col-sm-12">
                    <FormSelect :items="peopleList"
                        rules="required"
                        item-value="person_id"
                        item-name="Name"
                        name="Select Person"
                        v-model="data.person_id"/>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Name" rules="required" v-model="data.Name"/>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputText label="Address" readonly :value="currentAddressId" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputDate label="Date of Change" rules="required" :options="dateOptions" v-model="data.EffectiveDate"/>
                </div>
            </FormRow>
            <ButtonGroup slot="footer">
                <FormButton type="success" @click="() => passes(callChangeName)">Save</FormButton>
                <FormButton @click="() => cancel('changeName')">Cancel</FormButton>
            </ButtonGroup>
            </ValidationObserver>
        </Popup>

        <Popup :value="modals.changeAddress.visible" @close="() => cancel('changeAddress')" :title="entityType && entityType.toLowerCase() == 'lp' ? 'Change of Address of a Partner':'Change of Address of a Councillor'">
            <Loader v-if="modals.changeAddress.loading" />
            <ValidationObserver v-if="modals.changeAddress.visible" ref="changeAddressValidator" v-slot="{ passes }">
            <FormRow>
                <div class="col-sm-12">
                    <FormSelect :items="peopleList"
                        rules="required"
                        item-value="person_id"
                        item-name="Name"
                        name="Select Person"
                        v-model="data.person_id"/>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputText label="Old Address" readonly :value="currentAddressId" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputText label="New Address" rules="required" v-model="data.ResidenceAddress" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputDate :options="dateOptions" rules="required" label="Date of Change" v-model="data.EffectiveDate"/>
                </div>
            </FormRow>
            <ButtonGroup slot="footer">
                <FormButton type="success" @click="() => passes(callChangeAddress)">Save</FormButton>
                <FormButton @click="() => cancel('changeAddress')">Cancel</FormButton>
            </ButtonGroup>
            </ValidationObserver>
        </Popup>

        <Popup :value="popVisible" @close="showPopup2(false)" title="Person Info" :width="700">
                    
            <FormRow>
                <div class="col-sm-6">
                    <InputText label="Name" v-model="personData.Name" readonly />
                </div>
                <div class="col-sm-6">
                    <InputText label="Change Type" v-model="personData.ChangeAction" readonly />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputText label="Address" v-model="personData.ResidenceAddress" readonly />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <InputDate  label="Date of Appointment" v-model="personData.effectivedate" readonly />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6" v-if="personData.ChangeAction === 'Cessation'">
                    <InputText  label="Resignation Reason" v-model="personData.ResignationReason" readonly />
                </div>
            </FormRow>


        </Popup>


        <Popup :value="modals.success.visible" type="success" @close="() => modals.success.visible = false"
               title="Success">
            <p>Record has been saved!</p>
            <FormButton slot="footer" @click="() => modals.success.visible = false">Ok</FormButton>
        </Popup>
    </div>
</template>

<script>

    import DataTable from 'Components/DataTable'
    import InputDate from 'Components/form/InputDate';
    import DateUtil from 'Utils/dateUtil';
    import valueMixin from 'Mixins/valueMixin';
    import { getchangePeopleRequestList, changePeople, getPeople } from '../api';
    import tableColumn from './positionTable';
    import { ValidationObserver } from "vee-validate";


    export default {
        name: "CompanyPersons",
        mixins: [valueMixin],
        data() {
            return {
                tableColumns: tableColumn,
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
                },
                peopleList: [],
                changeTypes: {
                    appointment: 'APPT',
                    cessation: 'CESS',
                    changeName: 'NAME',
                    changeAddress: 'ADDR'
                },
                data: {
                    person_id: '',
                    ChangeType: null,
                    EffectiveDate: '',
                    ResignationReason: '',
                    Name:'',
                    ResidenceAddress:'',
                },
                dateOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                tableData: [],
                personData:{},
                popVisible: false,
            }
        },
        computed: {
            currentAddressId() {
                return this.data.person_id ? this.peopleList.find(item => item.person_id === this.data.person_id).Address : ''
            }
        },
        components: {
            InputDate,
            DataTable,
            ValidationObserver
        },
        props: {
            value: Object,
            readonly: Boolean,
            entityType: [String,Object]
        },
        created() {
            this.getPeopleHandler()
        },
        watch:{
            'data.person_id':function(val){
                if(val !== '' && val !== undefined){
                    if(this.data.ChangeType !== "NAME"){
                        this.data.Name = this.peopleList.find(item => item.person_id === val).Name;
                    }
                    if(this.data.ChangeType !== "ADDR"){
                        this.data.ResidenceAddress = this.peopleList.find(item => item.person_id === val).Address;
                    }
                }
            }
        },
        methods: {
            callChangeAddress(){
                this.saveData('changeAddress');
            },
            callChangeName(){
                this.saveData('changeName');
            },
            callCessation(){
                this.saveData('cessation');
            },
            callApointment(){
                this.saveData('appointment');
            },
            openPop(data){
                this.personData = this.tableData.find((item) => {
                    return item.id === data;
                });
                this.showPopup2(true);
            },
            showPopup2(val){
                this.popVisible = val;
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
                    Name: '',
                    ResidenceAddress:'',
                    person_id: '',
                };
            },
            saveData(type) {
                this.modals[type].loading = true;
                changePeople({
                    ...this.data,
                    Company_id: this.innerValue.Company_id,
                    process_id: this.innerValue.process_id,
                    reference_id: this.innerValue.reference_id
                }).then(res => {
                    this.innerValue.reference_id = res.data[0].reference_id;
                    this.modals[type].loading = false;
                    this.resetData();
                    this.modals.success.visible = true;
                    this.modals[type].visible = false;
                    this.getPeopleHandler();
                    this.$emit('onAction',true);
                }).catch(() => {
                    this.modals[type].loading = false;
                })
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
                this.modals[type].visible = true;
                this.modals[type].loading = true;
                this.data.ChangeType = this.changeTypes[type];
                getPeople({
                    Company_id: this.innerValue.Company_id
                }).then(res => {
                    this.modals[type].loading = false;
                    this.modals[type].loading = false;
                    this.peopleList = res.data;
                }).catch(() => {
                    this.modals[type].loading = false;
                })
            }
        }
    }
</script>
