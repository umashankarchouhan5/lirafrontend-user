import DateUtil from 'Utils/dateUtil';

const tableConfig = [
    // {
    //     type: 'selection',
    //     width: 60,
    //     align: 'center'
    // },
    {
        title: 'Reference',
        key: 'reference_id',
        sortable: true
    },
    {
        title: 'PQ ID',
        key: 'EntityType',
        sortable: true
    },
    {
        title: 'Name',
        key: 'CompanyName',
        sortable: true
    },
    // {
    //     title: 'Position',
    //     key: 'position'
    // },
    {
        title: 'Status',
        key: 'status',
        sortable: true
    },
    {
        title: 'Status Date',
        key: 'statusdate',
        sortable: true,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.statusdate));
        },
    },
];

export default tableConfig
