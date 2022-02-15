export const statuses = {
    pending: {
        value: 'pending',
        text: 'Pending'
    },
    submitted: {
        value: 'submitted',
        text: 'Submitted',
    },
    approved: {
        value: 'approved',
        text: 'Approved'
    },
    rejected: {
        value: 'rejected',
        text: 'Rejected'
    },
    request_for_info: {
        value: 'request_for_info',
        text: 'Request for info'
    }
};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export const tableData = [...Array(10).keys()].map((item) => {
    return {
        unique_ref: item + 1, // Any string or null
        reference: getRandomInt(1000000), // Any string or null
        name: 'Test Name ' + getRandomInt(100), // Any string or null
        submitted_on: '2019-11-12', // Any string or null
        status: 'rejected', // String, one of 'pending', 'submitted', 'approved', 'rejected', 'request_for_info',
        approved_on: '2019-11-12', // Any string or null
        reason_for_rejection: 'Some reason' // Any string or null
    }
});

export const tableConfig = [
    {
        type: 'selection',
        width: 60,
        align: 'center'
    },
    {
        title: 'Reference',
        key: 'reference'
    },
    {
        title: 'Unique Ref',
        key: 'unique_ref'
    },
    {
        title: 'Name',
        key: 'name',
        sortable: true
    },
    {
        title: 'Submitted on',
        key: 'submitted_on'
    },
    {
        title: 'Status',
        key: 'status'
    }
];

