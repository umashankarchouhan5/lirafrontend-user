import {
    GeneralInfo,
} from './components';

import Payments from 'Components/layout/user/payment/Payments'

import { Documents } from 'Organisms/documents'

const steps = [
    {
        id: 1,
        title: 'General Information',
        isActive: true,
        component: GeneralInfo,
    },
    {
        id: 2,
        title: 'Licensable Activities',
        isActive: false,
        component: GeneralInfo,
        isDisabled: true
    },
    {
        id: 3,
        title: 'Compliance Function',
        isActive: false,
        component: GeneralInfo,
        isDisabled: true
    },
    {
        id: 4,
        title: 'Notices to Authority',
        isActive: false,
        component: GeneralInfo,
        isDisabled: true
    },
    {
        id: 5,
        title: 'Business Contingency & Resumption',
        isActive: false,
        component: GeneralInfo,
        isDisabled: true
    },
    {
        id: 6,
        title: 'Statistical Information',
        isActive: false,
        component: GeneralInfo,
        isDisabled: true
    },
    {
        id: 7,
        title: 'Employee and Ownership Information',
        isActive: false,
        component: GeneralInfo,
        isDisabled: true
    },
    
    {
        id: 8,
        title: 'Supporting Documents',
        isActive: false,
        component: Documents,
        isDisabled: true
    },
    
    {
        id: 9,
        title: 'Payments',
        component: Payments,
        isActive: false,
        isDisabled: true
    },
    
];

export default steps;