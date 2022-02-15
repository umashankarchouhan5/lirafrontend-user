
import DateUtil from 'Utils/dateUtil';

export default [
    {
        type: 'selection',
        width: 38,
        align: 'center',
    },
    {
        title: 'Name',
        key: 'Name',
        sortable: true,
        width: 150
    },
    {
        title: 'Email',
        key: 'username',
        // width: 210,
        sortable: true,
    },
    // {
    //     title: 'Company',
    //     key: 'company',
    //     width: 250,
    //     sortable: true,
    // },
    // {
    //     title: 'Brief',
    //     key: 'BriefProfile',
    //     sortable: true,
    // },
    // {
    //     title: 'Created',
    //     width: 150,
    //     render: (h, params) => {
    //         return h('span', params.row.created_at ? DateUtil.formatDate(params.row.created_at) : '');
    //     },
    //     sortable: true,
    // },
]
