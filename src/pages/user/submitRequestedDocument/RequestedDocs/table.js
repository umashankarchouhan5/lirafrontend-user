import UploadCell from './components/UploadCell';
import DateCell from './components/DateCell';
import SaveButtonCell from './components/SaveButtonCell';
import PreviousDocCell from './components/PreviousDocCell';

export default function() {
    const instance = this;
    return [
        {
            title: 'Document Brief',
            key: 'documentBrief',
            minWidth: 150
        },
        {
            title: 'Previous Document',
            key: 'originalDocument',
            width: 80,
            render: (h, params) => {
                return h('div', [
                    h(PreviousDocCell, {
                        props: {
                            row: params.row,
                        }
                    }),
                ]);
            }
        },
        {
            title: 'Registration Date',
            key: 'DocumentDate',
            width: 150,
            align: 'center',
            render: (h, params) => {
                return h('div', [
                    h(DateCell, {
                        props: {
                            row: params.row,
                            required: params.row.isDateRequired === 1,
                            onDateChange: instance.onDateChange,
                        }
                    }),
                ]);
            }
        },
        {
            title: 'Registered Document',
            width: 300,
            render: (h, params) => {
                return h('div', [
                    h(UploadCell, {
                        props: {
                            row: params.row,
                            onChange: instance.onFileChange
                        }
                    }),
                ]);
            }
        },
        {
            width: 80,
            title: 'Action',
            align: 'center',
            render: (h, params) => {
                return h(SaveButtonCell, {
                    props: {
                        row: params.row,
                        index: params.index,
                        onSaveDocument: instance.onSaveDocument,
                        onChangeDocument: instance.onChangeDocument
                    }
                }, 'Save');
            }
        }
    ]
} 
