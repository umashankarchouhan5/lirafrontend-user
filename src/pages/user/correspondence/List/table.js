import DateUtil from 'Utils/dateUtil'
export default [
    {
        type: 'selection',
        width: 40,
        align: 'center'
    },
    {
        title: 'To',
        key: 'ToUser',
        width: 180,
        sortable: true
    },
    {
        title: 'From',
        key: 'FromUser',
        width: 180,
        sortable: true
    },
    {
        title: 'Subject',
        key: 'Subject',
        sortable: true
    },
    {
        title: 'Mode',
        key: 'CorrespondenceMode',
        width: 100,
        sortable: true
    },
    {
        title: 'Date Sent',
        key: 'correspondencedate',
        width: 110,
        sortable: true,
        render: (h, params) => {
            return h('span', DateUtil.formatDate(params.row.correspondencedate));
        },
    },
]
