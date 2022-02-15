
import DateUtil from 'Utils/dateUtil'

export default [
    // Approved
    
    {
        type: 'selection',
        width: 38,
        align: 'center'
    },
    // {
    //     title: 'Company ID',
    //     key: 'company_id',
    //     sortable: true,
    // },
    {
        title: 'Entity Type',
        key: 'EntityType',
        sortable: true,
        width: 150,
    },
    {
        title: 'Reg. No.',
        key: 'CompanyRegNo',
        sortable: true,
        width: 150,
    },
    {
        title: 'Name',
        key: 'Name',
        sortable: true,
        minWidth: 120
    },
    
    {
        title: 'Status',
        key: 'Status',
        width: 140
    },
    {
        title: 'Renewal Date',
        key: 'RenewalDate',
        render: (h, params) => {
            return h('span', params.row.RenewalDate && params.row.RenewalDate !== null ? DateUtil.formatDate(params.row.RenewalDate) : '');
        },
        sortable: true,
        width: 130,
    }
];
