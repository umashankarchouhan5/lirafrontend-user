// import CommentCell from './components/commentCell'
// import DocumentCell from './components/documentCell'
// import TicketReferenceLinkCell from './components/TicketReferenceLinkCell'
import DateUtil from 'Utils/dateUtil'

const companyName = {
    title: 'Company Name',
    key: 'CompanyName',
    sortable: true,
    // width: 140
};

const entityType = {
    title: 'Entity Type',
    key: 'EntityType',
    sortable: true,
    width: 110
};


// const ticketReferenceLink = {
//     title: 'Reference',
//     key: 'TicketReference',
//     render: (h, params) => {
//         return h(TicketReferenceLinkCell, {
//             props: {
//                 row: params.row
//             }
//         });
//     },
//     width: 140
// };

const status = {
    title: 'Status',
    key: 'status',
    // width: 130
};


const submittedOn = {
    title: 'Submitted On',
    key: 'StatusDate',
    sortable: true,
    render: (h, params) => {
        return h('span', DateUtil.formatDate(params.row.StatusDate));
    },
};


export default {
    // Approved
    [501]: {
        columns: [
            // ticketReferenceLink,
            companyName,
            entityType,
            submittedOn,
            status,
        ]
    },
    
};
