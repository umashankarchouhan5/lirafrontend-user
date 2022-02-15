
import DateUtil from 'Utils/dateUtil';

export default [
    {
        type: 'selection',
        width: 38,
        align: 'center'
    },
    {
        title: 'Entity Type',
        key: 'EntityType',
        width: 120,
        sort: false
    },
    {
        title: "Status",
        key: 'StatusName',
        sort: false
    },
    {
        title: 'Status Date',
        width: 150,
        render: (h, params) => {
            return h('span', params.row.StatusDate ? DateUtil.formatDate(params.row.StatusDate) : '');
        },
        sort: false
    },
]
