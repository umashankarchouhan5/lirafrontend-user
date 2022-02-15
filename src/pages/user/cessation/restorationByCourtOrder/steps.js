import GeneralInfo from  './components/GeneralInfo';
import { Documents } from  'Organisms/documents';

import Payments from 'Components/layout/user/payment/Payments'

export default [
    {
        id: 1,
        title: 'General Info',
        component: GeneralInfo,
        isActive: true,
    },
    {
        id: 2,
        title: 'Documents',
        component: Documents,
        isActive: false,
        isDisabled: true
    },
    // {
    //     id: 3,
    //     title: 'Payments',
    //     component: Payments,
    //     isActive: false,
    //     isDisabled: true
    // }
]

