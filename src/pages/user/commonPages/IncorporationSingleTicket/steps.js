import GeneralInfo from  './components/GeneralInfo';
import { Documents } from  'Organisms/documents';
// import Payments from  './components/Payments';
import Payments from 'Components/layout/user/payment/Payments'

export default {
    initial: [
        {
            id: 1,
            title: 'General Info',
            component: GeneralInfo,
            isActive: true,
            editable: [205]
        },
    ],
    all: [
        {
            id: 1,
            title: 'General Info',
            component: GeneralInfo,
            isActive: true,
            editable: [205],
        },
        {
            id: 2,
            title: 'Documents',
            component: Documents,
            isActive: false,
            editable: [205, 202],
            isDisabled: true,
        },
        {
            id: 3,
            title: 'Payments',
            component: Payments,
            isActive: false,
            editable: [205, 202],
            isDisabled: true,
        }
    ]
}
