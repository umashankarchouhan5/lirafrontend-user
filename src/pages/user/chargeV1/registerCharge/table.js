import DateUtil from 'Utils/dateUtil';
import ActionCell from './actionCell';

export default function() { 
    const instance = this;
    return [
        {
            title: 'Charge Reference Number',
            key: 'ChargeReferenceNumber',
            sortable: false,
            maxWidth: 160,
        },
        {
            title: 'Chargee Name',
            key: 'ChargeeName',
            sortable: false,
        },
        {
            title: 'Instrument Name',
            key: 'InstrumentName',
            sortable: false,
        },
        {
            title: 'Liability Secured',
            key: 'LiabilitySecured',
            sortable: false,
            width: 120,
        },
        {
            title: 'Charge Date',
            key: 'ChargeDate',
            sortable: false,
            width: 90,
            render: (h, params) => {
                return h('span', params.row.ChargeDate !== null ? DateUtil.formatDate(params.row.ChargeDate) : '');
            },
        },
        {
            title: 'Discharge Date',
            key: 'DischargeDate',
            sortable: false,
            width: 110,
            render: (h, params) => {
                return h('span',params.row.DischargeDate !== null ? DateUtil.formatDate(params.row.DischargeDate): '');
            },
        },
        {
            title: 'Action',
            render: (h,params) =>{
                return h(ActionCell,{
                    props: {
                        row: params.row,
                        openCharge: instance.openCharge,
                    }
                })
            },
            width: 100
        }
    ]
}
