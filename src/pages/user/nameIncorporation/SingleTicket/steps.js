import GeneralInfo from  './components/GeneralInfo';
import ProposedName from  './components/ProposedName';

export default [
    {
        id: 1,
        title: 'Proposed Name',
        component: ProposedName,
        isActive: true,
        editable: [205]
    },
    {
        id: 2,
        title: 'General Info',
        component: GeneralInfo,
        isActive: false,
        isDisabled: true,
        editable: [205]
    },
];
