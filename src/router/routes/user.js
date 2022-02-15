export default [
    {
        path: "/dashboard1",
        name: "dashboard1",
        meta: {
            title: "Dashboard_Old",
            auth: true,
        },
        component: () => import("../../pages/user/dashboard/Dashboard.vue"),
    },
    {
        path: "/dashboard",
        name: "dashboard",
        meta: {
            title: "Dashboard",
            auth: true,
        },
        component: () => import("../../pages/user/dashboard1"),
    },
    {
        path: "/tasks",
        name: "tasks",
        meta: {
            title: "Tasks",
            auth: true,
        },
        component: () => import("../../pages/user/tasks"),
    },
    {
        path: "/tasks/:ticketReference",
        name: "tasksWithReference",
        meta: {
            title: "Tasks",
            auth: true,
        },
        component: () => import("../../pages/user/tasks"),
    },
    {
        path: "/submissions",
        name: "submissions",
        meta: {
            title: "Name Reservation",
            auth: true,
        },
        component: () => import("../../pages/user/NameReservationV1/List"),
    },
    {
        path: "/submissions/:TicketReference/respond",
        name: "submissionsRespond",
        meta: {
            title: "Name Reservation",
            auth: true,
        },
        component: () => import("../../pages/user/NameReservationV1/List"),
    },
    {
        path: "/submissions/:id",
        name: "Name Reservation Ticket",
        meta: {
            title: "Name Reservation",
            auth: true,
        },
        component: () => import("../../pages/user/commonPages/IncorporationSingleTicket"),
    },
    {
        path: "/submissions/:id/respond",
        name: "Respond Ticket",
        meta: {
            title: "Respond",
            auth: true,
        },
        component: () => import("../../pages/user/RFI"),
    },
    {
        path: "/nameReservationIncorporation",
        name: "NameReservationIncorporation",
        meta: {
            title: "Name Reservation Incorporation",
            auth: true,
        },
        component: () => import("../../pages/user/nameIncorporation/List"),
    },
    {
        path: "/nameReservationIncorporationForm",
        name: "NameReservationIncorporationForm",
        meta: {
            title: "Name Reservation Incorporation Form",
            auth: true,
        },
        component: () => import("../../pages/user/nameIncorporation/SingleTicket"),
    },
    {
        path: "/nameReservationIncorporation/:id",
        name: "NameReservationIncorporationFormId",
        meta: {
            title: "Name Reservation Incorporation Form",
            auth: true,
        },
        component: () => import("../../pages/user/nameIncorporation/SingleTicket"),
    },
    {
        path: "/incorporation",
        name: "Incorporation",
        meta: {
            title: "Incorporation",
            auth: true,
        },
        component: () => import("../../pages/user/Incorporation/List"),
    },
    {
        path: "/incorporation/:id",
        name: "Incorporation Ticket",
        meta: {
            title: "Incorporation",
            auth: true,
        },
        component: () => import("../../pages/user/commonPages/IncorporationSingleTicket"),
    },
    {
        path: "/nameReservationExtension",
        name: "Name Reservation Extension",
        meta: {
            title: "Name Reservation Extension",
            auth: true,
        },
        component: () => import("../../pages/user/NameReservationExtension/List"),
    },
    {
        path: "/nameReservationExtension/:id/payment",
        name: "Name Reservation Extension Payment",
        meta: {
            title: "Name Reservation Extension Payment",
            auth: true,
        },
        component: () => import("../../pages/user/NameReservationExtension/Payment"),
    },
    {
        path: "/nameReservationExtension/:id",
        name: "Name Reservation Extension Ticket",
        meta: {
            title: "Name Reservation Extension",
            auth: true,
        },
        component: () => import("../../pages/user/NameReservationExtension/SingleTicket"),
    },
    {
        path: "/continuation",
        name: "Continuation",
        meta: {
            title: "Continuation",
            auth: true,
        },
        component: () => import("../../pages/user/Continuation/List"),
    },
    {
        path: "/continuation/:id",
        name: "Continuation Ticket",
        meta: {
            title: "Continuation",
            auth: true,
        },
        component: () => import("../../pages/user/commonPages/IncorporationSingleTicket"),
    },
    {
        path: "/pq-forms",
        name: "pq_forms",
        meta: {
            title: "PQ",
            auth: true
        },
        component: () => import("../../pages/user/PQ/list")
    },
    {
        path: "/pq-forms-assessment",
        name: "pq_forms_assessment",
        meta: {
            title: "Fit and Proper",
            auth: true
        },
        component: () => import("../../pages/user/PQ/fitAndAssessmentList")
    },
    {
        path: "/pq-forms-assessment/:id/respond",
        name: "pq_forms_assessment_respond",
        meta: {
            title: "Fit and Proper Respond",
            auth: true
        },
        component: () => import("../../pages/user/RFI")
    },
    {
        path: "/pq-forms/:id",
        name: "pq",
        meta: {
            title: "PQ",
            auth: true
        },
        component: () => import("../../pages/user/PQ/single")
    },
    // {
    //     path: "/icsp_old",
    //     name: "icsp",
    //     meta: {
    //         title: "ICSP",
    //         auth: true
    //     },
    //     component: () => import("Pages/user/ICSP")
    // },
    {
        path: "/ui",
        name: "ui",
        meta: {
            title: "UI Kit",
            auth: true
        },
        component: () => import("Pages/user/ui/UIKit.vue")
    },
    {
        path: "/changes",
        name: "changes",
        meta: {
            title: "Changes",
            auth: true
        },
        component: () => import("Pages/user/changeV1/List")
    },
    {
        path: "/changes/:id",
        name: "changes Ticket",
        meta: {
            title: "Changes",
            auth: true
        },
        component: () => import("Pages/user/changeV1/SingleTicket")
    },
    {
        path: "/changes/add/:addRef",
        name: "changes_add",
        meta: {
            title: "Add Change",
            auth: true
        },
        component: () => import("Pages/user/changeV1/SingleTicket")
    },
    {
        path: "/changes/:id/respond/:process_id",
        name: "changes_respond",
        meta: {
            title: "Respond",
            auth: true, 
        },
        component: () => import("../../pages/user/RFI"),
    },
    {
        path: "/changes/edit",
        name: "changes_edit",
        meta: {
            title: "Edit Change",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/changeV1/SingleTicket")
    },

    
    {
        path: "/changesCSP",
        name: "changesCSP",
        meta: {
            title: "Changes CSP",
            auth: true
        },
        component: () => import("Pages/user/changeCsp/List")
    },
    {
        path: "/changesCSP/:id",
        name: "changesCSPTicket",
        meta: {
            title: "Changes CSP",
            auth: true
        },
        component: () => import("Pages/user/changeCsp/SingleTicket")
    },
    {
        path: "/changesCSP/add/:addRef",
        name: "changesCSP_add",
        meta: {
            title: "Add Change CSP",
            auth: true
        },
        component: () => import("Pages/user/changeCsp/SingleTicket")
    },
    {
        path: "/changesCSP/:id/respond/:process_id",
        name: "changesCSP_respond",
        meta: {
            title: "Respond",
            auth: true, 
        },
        component: () => import("../../pages/user/RFI"),
    },
    {
        path: "/changesCSP/edit",
        name: "changesCSP_edit",
        meta: {
            title: "Edit Change",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/changeCsp/SingleTicket")
    },

    {
        path: "/changesCSL_PCC",
        name: "ChangesCSLPCC",
        meta: {
            title: "Changes CSL/PCC",
            auth: true
        },
        component: () => import("Pages/user/changeCSL/List")
    },
    {
        path: "/changesCSL_PCC/:id",
        name: "ChangesCSLPCCTicket",
        meta: {
            title: "Changes CSL/PCC",
            auth: true
        },
        component: () => import("Pages/user/changeCSL/SingleTicket")
    },
    {
        path: "/changesCSL_PCC/add/:addRef",
        name: "ChangesCSl_PCC_add",
        meta: {
            title: "Add Change CSL/PCC",
            auth: true
        },
        component: () => import("Pages/user/changeCSL/SingleTicket")
    },
    {
        path: "/changesCSL_PCC/:id/respond/:process_id",
        name: "ChangesCSLPCC_respond",
        meta: {
            title: "Respond",
            auth: true, 
        },
        component: () => import("../../pages/user/RFI"),
    },
    {
        path: "/changesCSL_PCC/edit",
        name: "ChangesCSLPCC_edit",
        meta: {
            title: "Edit Change",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/changeCSL/SingleTicket")
    },

    {
        path: "/change-password",
        name: "change-password",
        meta: {
            title: "Change Password",
            auth: true
        },
        component: () => import("Pages/user/changePassword")
    },
    {
        path: "/company",
        name: "Company",
        meta: {
            title: "Company List",
            auth: true
        },
        component: () => import("Pages/user/company/List")
    },
    {
        path: "/correspondence",
        name: "Correspondence",
        meta: {
            title: "Correspondence List",
            auth: true
        },
        component: () => import("Pages/user/correspondence/List")
    },
    {
        path: "/charge",
        name: "NewCharge",
        meta: {
            title: "Charge",
            auth: true
        },
        props: true,
        component: () => import("Pages/user/chargeV1/charge")
    }, 
    {
        path: "/amendmentOfCharge",
        name: "AmendmentOfCharge",
        meta: {
            title: "Amendment Of Charge",
            auth: true
        },
        props: true,
        component: () => import("Pages/user/chargeV1/charge")
    },
    {
        path: "/releaseOfCharge",
        name: "ReleaseOfCharge",
        meta: {
            title: "Release Of Charge",
            auth: true
        },
        props: true,
        component: () => import("Pages/user/chargeV1/charge")
    },
    {
        path: "/charge/:id",
        name: "NewChargeRequest",
        meta: {
            title: "Charge Request",
            auth: true
        },
        props: true,
        component: () => import("Pages/user/chargeV1/ChargeForm")
    }, 
    {
        path: "/amendmentOfCharge/:id/:chargeRef",
        name: "AmendmentOfChargeRequest",
        meta: {
            title: "Amendment Of Charge Request",
            auth: true
        },
        props: true,
        component: () => import("Pages/user/chargeV1/ChargeForm")
    },
    {
        path: "/releaseOfCharge/:id/:chargeRef",
        name: "ReleaseOfChargeRequest",
        meta: {
            title: "Release Of Charge Request",
            auth: true
        },
        props: true,
        component: () => import("Pages/user/chargeV1/ChargeForm")
    },
    {
        path: "/chargeRegister",
        name: "RegisterOfCharge",
        meta: {
            title: "Register Of Charges",
            auth: true
        },
        props: true,
        component: () => import("Pages/user/chargeV1/registerCharge/RegisterCharge")
    },
    {
        path: "/chargeRegisterTicket/:id/:chargeRef",
        name: "RegisterOfChargeRequest",
        meta: {
            title: "Register Of Charges Request",
            auth: true
        },
        props: true,
        component: () => import("Pages/user/chargeV1/registerCharge/RegisterForm")
    },
    {
        path: "/invoice",
        name: "Invoice",
        meta: {
            title: "Invoice List",
            auth: true
        },
        component: () => import("Pages/user/invoice/List")
    },
    {
        path: "/invoice/:invoiceId",
        name: "InvoicePayment",
        meta: {
            title: "Invoice Payment",
            auth: true,
        },
        component: () => import("Components/layout/user/payment"),
    },
    {
        path: "/invoice/:invoiceId/multiplePayment",
        name: "MultiplePayment",
        meta: {
            title: "Invoice Payment",
            auth: true,
        },
        component: () => import("Components/layout/user/payment"),
    },
    {
        path: "/paymentRecieved",
        name: "Payment Recieved",
        meta: {
            title: "Payment Recieved",
            auth: true,
        },
        component: () => import("Pages/user/paymentRecieved/PaymentRecieved")  
    },
    {
        path: '/certificateOfGoodStanding',
        name: 'CertificateOfGoodStanding',
        meta: {
            title: 'Certificate Of Good Standing',
            auth: true,
        },
        component: () => import("Pages/user/requests/certificateOfGoodStanding/List")
    },
    {
        path: '/certificateOfGoodStanding/:action',
        name: 'CertificateOfGoodStandingTicket',
        meta: {
            title: 'Certificate Of Good Standing Request',
            auth: true,
        },
        component: () => import("Pages/user/requests/certificateOfGoodStanding/SingleTicket")
    },
    {
        path: '/certificateOfOfficialSearch',
        name: 'CertificateOfOfficialSearch',
        meta: {
            title: 'Certificate Of Official Search',
            auth: true,
        },
        component: () => import("Pages/user/requests/certificateOfOfficialSearch/List")
    },
    {
        path: '/certificateOfOfficialSearch/:action',
        name: 'CertificateOfOfficialSearchTicket',
        meta: {
            title: 'Certificate Of Official Search Request',
            auth: true,
        },
        component: () => import("Pages/user/requests/certificateOfOfficialSearch/SingleTicket")
    },
    {
        path: "/icsp",
        name: "icsp",
        meta: {
            title: "ICSP",
            auth: true
        },
        component: () => import("Pages/user/ICSP_v1/components/formSteps/Instruction")
    },
    {
        path: "/icspForm",
        name: "icspForm",
        meta: {
            title: "ICSP",
            auth: true
        },
        component: () => import("Pages/user/ICSP_v1")
    },
    {
        path: "/icsp/:id",
        name: "icspFormRef",
        meta: {
            title: "ICSP",
            auth: true
        },
        component: () => import("Pages/user/ICSP_v1")
    },
    {
        path: "/itsp",
        name: "itsp",
        meta: {
            title: "ITSP",
            auth: true
        },
        component: () => import("Pages/user/ITSP/components/formSteps/Instruction")
    },
    {
        path: "/itspForm",
        name: "itspForm",
        meta: {
            title: "ITSP",
            auth: true
        },
        component: () => import("Pages/user/ITSP")
    },
    {
        path: "/itsp/:id",
        name: "itspFormRef",
        meta: {
            title: "ITSP",
            auth: true
        },
        component: () => import("Pages/user/ITSP")
    },
    {
        path: "/fsp",
        name: "fsp",
        meta: {
            title: "FSP",
            auth: true
        },
        component: () => import("Pages/user/FSP/components/formSteps/Instruction")
    },
    {
        path: "/fspForm",
        name: "fspForm",
        meta: {
            title: "FSP",
            auth: true
        },
        component: () => import("Pages/user/FSP")
    },
    {
        path: "/fsp/:id",
        name: "fspFormRef",
        meta: {
            title: "FSP",
            auth: true
        },
        component: () => import("Pages/user/FSP")
    },

    {
        path: "/csl",
        name: "CSL",
        meta: {
            title: "CSL",
            auth: true
        },
        component: () => import("Pages/user/csl/List")
    },
    {
        path: "/cslForm",
        name: "CSLForm",
        meta: {
            title: "CSL Form",
            auth: true
        },
        component: () => import("Pages/user/csl")
    },
    {
        path: "/pcc",
        name: "PCC",
        meta: {
            title: "PCC",
            auth: true
        },
        component: () => import("Pages/user/pcc/List")
    },
    {
        path: "/pccForm",
        name: "PCCForm",
        meta: {
            title: "PCC Form",
            auth: true
        },
        component: () => import("Pages/user/pcc")
    },
    {
        path: "/registerOfDirector",
        name: "ROD",
        meta: {
            title: "Register Of Director",
            auth: true
        },
        component: () => import("Pages/user/miscFiling/rod/List")
    },
    {
        path: "/registerOfDirector/RODFee/:reference_id",
        name: "RODFee",
        meta: {
            title: "Register Of Director Fee",
            auth: true
        },
        component: () => import("Pages/user/miscFiling/rod/rodFee")
    },
    {
        path: "/RODupdate",
        name: "RODUpdates",
        meta: {
            title: "Register Of Director Updates",
            auth: true
        },
        component: () => import("Pages/user/miscFiling/rodUpdate")
    },
    {
        path: '/letterOfConfirmation',
        name: 'LetterOfConfirmationOfStatus',
        meta: {
            title: 'Letter Of Confirmation Of Status',
            auth: true,
        },
        component: () => import("Pages/user/requests/letterOfConfirmation/List")
    },
    {
        path: '/letterOfConfirmation/:action',
        name: 'LetterOfConfirmationOfStatusTicket',
        meta: {
            title: 'Letter Of Confirmation Of Status Request',
            auth: true,
        },
        component: () => import("Pages/user/requests/letterOfConfirmation/SingleTicket")
    },
    {
        path: "/profile",
        name: "profile",
        meta: {
            title: "Edit Profile",
            auth: true
        },
        component: () => import("Pages/user/editProfile")
    },
    {
        path: "/respond/:id/respond",
        name: 'RespondPage',
        meta: {
            title: 'Respond To RFI',
            auth: true      
        },
        component: () => import("../../pages/user/RFI"),
    },
    
    {
        path: "/respond/:id/respond/:process_id",
        name: 'Right For Information Page',
        meta: {
            title: 'Respond To RFI',
            auth: true      
        },
        component: () => import("../../pages/user/RFI"),
    },
    {
        path: "/notifications",
        name: 'Notifications',
        meta: {
            title: 'Notifications',
            auth: true      
        },
        component: () => import("../../pages/user/notification"),
    },
    
    {
        path: "/annualRenewal",
        name: 'AnnualRenewal',
        meta: {
            title: 'Annual Renewal',
            auth: true      
        },
        component: () => import("../../pages/user/renewal/annualRenewal"),
    },
    {
        path: "/annualRenewal/list",
        name: 'AnnualRenewalList',
        meta: {
            title: 'Annual Renewal',
            auth: true      
        },
        component: () => import("../../pages/user/renewal/annualRenewal"),
    },
    {
        path: "/annualComplianceView",
        name: 'AnnualRenewalWithComplianceView',
        meta: {
            title: 'Annual Renewal With Compliance View',
            auth: true      
        },
        component: () => import("../../pages/user/renewal/annualCompliance/components/annualComplianceGrid"),
    },
    
    {
        path: "/annualCompliance",
        name: 'AnnualRenewalWithCompliance',
        meta: {
            title: 'Annual Renewal With Compliance',
            auth: true      
        },
        component: () => import("../../pages/user/renewal/annualCompliance/components/Instruction"),
    },
    {
        path: "/annualCompliance/:id",
        name: 'AnnualRenewalWithComplianceForm',
        meta: {
            title: 'Annual Renewal With Compliance',
            auth: true      
        },
        component: () => import("../../pages/user/renewal/annualCompliance"),
    },
    {
        path: "/annualRenewalData",
        name: 'AnnualRenewalData',
        meta: {
            title: 'Annual Renewal Data',
            auth: true      
        },
        component: () => import("../../pages/user/renewal/annualRenewal/AnnualRenewalData"),
    },
    {
        path: "/annualReturn",
        name: 'AnnualReturn',
        meta: {
            title: 'Annual Return',
            auth: true      
        },
        component: () => import("../../pages/user/renewal/annualReturn"),
    },
    {
        path: "/annualReturn/:id",
        name: 'AnnualReturnForm',
        meta: {
            title: 'Annual Return Form',
            auth: true      
        },
        component: () => import("../../pages/user/renewal/annualReturn/SingleTicket"),
    },
    {
        path: "/complaint",
        name: 'Complaint',
        meta: {
            title: 'Complaint',
            auth: true      
        },
        component: () => import("../../pages/user/complaint"),
    },
    
    {
        path: "/fundLicense",
        name: 'FundLicenseInstruction',
        meta: {
            title: 'Fund License',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/fundLicense/Instruction"),
    },
    {
        path: "/fundLicenseForm",
        name: 'FundLicense',
        meta: {
            title: 'Fund License',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/fundLicense"),
    },
    {
        path: "/fundLicense/:id",
        name: 'FundLicenseById',
        meta: {
            title: 'Fund License',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/fundLicense"),
    },
    
    {
        path: "/exemptForeignFund",
        name: 'ExemptForeignFundInstruction',
        meta: {
            title: 'Exempt Foreign Fund',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Funds/ExemptForeign/Instruction"),
    },
    {
        path: "/exemptForeignFundForm",
        name: 'ExemptForeignFund',
        meta: {
            title: 'Exempt Foreign Fund',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Funds/ExemptForeign"),
    },
    {
        path: "/exemptForeignFund/:id",
        name: 'ExemptForeignFundById',
        meta: {
            title: 'Exempt Foreign Fund',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Funds/ExemptForeign"),
    },
    {
        path: "/foreignAdmin",
        name: 'ForeignAdministratorFundInstruction',
        meta: {
            title: 'Foreign Administrator',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Funds/ApprovedForeignAdministrator/Instruction"),
    },
    {
        path: "/foreignAdminForm",
        name: 'ForeignAdministratorFund',
        meta: {
            title: 'Foreign Administrator',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Funds/ApprovedForeignAdministrator"),
    },
    {
        path: "/foreignAdmin/:id",
        name: 'ForeignAdminById',
        meta: {
            title: 'Foreign Administrator',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Funds/ApprovedForeignAdministrator"),
    },
    {
        path: "/fundAdmin",
        name: 'FundsAdministratorFundInstruction',
        meta: {
            title: 'Funds Administrator',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Funds/FundsAdministrator/Instruction"),
    },
    {
        path: "/fundAdminForm",
        name: 'FundsAdministratorFund',
        meta: {
            title: 'Funds Administrator',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Funds/FundsAdministrator"),
    },
    {
        path: "/fundAdmin/:id",
        name: 'FundsAdministratorById',
        meta: {
            title: 'Funds Administrator',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Funds/FundsAdministrator"),
    },
    {
        path: "/securityLicense",
        name: 'SecurityLicenseInstruction',
        meta: {
            title: 'Security License',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/SecurityLicense/Instruction"),
    },
    
    {
        path: "/securityLicenseForm",
        name: 'SecurityLicense',
        meta: {
            title: 'Security License',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/SecurityLicense"),
    },
    {
        path: "/securityLicenseForm/:id",
        name: 'SecurityLicenseById',
        meta: {
            title: 'Security License',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/SecurityLicense"),
    },
    
    {
        path: "/representativelicense",
        name: 'RepresentativeLicenseInstruction',
        meta: {
            title: 'Representative License',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/RepresentativeLicense/Instruction"),
    },
    {
        path: "/representativelicenseForm",
        name: 'RepresentativeLicense',
        meta: {
            title: 'Representative License',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/RepresentativeLicense"),
    },
    {
        path: "/representativelicense/:id",
        name: 'RepresentativeLicenseById',
        meta: {
            title: 'Representative License',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/RepresentativeLicense"),
    },
    {
        path: "/secIACompany",
        name: 'SecIACompanyInstruction',
        meta: {
            title: 'Security IA Company',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secIACompany/Instruction"),
    },
    {
        path: "/secIACompanyForm",
        name: 'SecIACompany',
        meta: {
            title: 'Security IA Company',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secIACompany"),
    },
    {
        path: "/secIACompany/:id",
        name: 'SecIACompanyById',
        meta: {
            title: 'Security IA Company',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secIACompany"),
    },
    {
        path: "/secIAIndividual",
        name: 'SecIAIndividualInstruction',
        meta: {
            title: 'Security IA Indiviadual',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secIAIndividual/Instruction"),
    },
    {
        path: "/secIAIndividualForm",
        name: 'SecIAIndividual',
        meta: {
            title: 'Security IA Indiviadual',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secIAIndividual"),
    },
    {
        path: "/secIAIndividual/:id",
        name: 'SecIAIndividualById',
        meta: {
            title: 'Security IA Indiviadual',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secIAIndividual"),
    },
    {
        path: "/secExchange",
        name: 'SecExchangeInstruction',
        meta: {
            title: 'Security Exchange',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secExchange/Instruction"),
    },
    {
        path: "/secExchangeForm",
        name: 'SecExchange',
        meta: {
            title: 'Security Exchange',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secExchange"),
    },
    {
        path: "/secExchange/:id",
        name: 'SecExchangeById',
        meta: {
            title: 'Security Exchange',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secExchange"),
    },
    {
        path: "/secFacility",
        name: 'SecFacilityInstruction',
        meta: {
            title: 'Security Facility',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secFacility/Instruction"),
    },
    {
        path: "/secFacilityForm",
        name: 'SecFacility',
        meta: {
            title: 'Security Facility',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secFacility"),
    },
    {
        path: "/secFacility/:id",
        name: 'SecFacilityById',
        meta: {
            title: 'Security Facility',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secFacility"),
    },
    {
        path: "/secClearing",
        name: 'SecClearingInstruction',
        meta: {
            title: 'Security Clearing',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secClearing/Instruction"),
    },
    {
        path: "/secClearingForm",
        name: 'SecClearing',
        meta: {
            title: 'Security Clearing',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secClearing"),
    },
    {
        path: "/secClearing/:id",
        name: 'SecClearingById',
        meta: {
            title: 'Security Clearing',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secClearing"),
    },
    {
        path: "/secExempt",
        name: 'SecExemptInstruction',
        meta: {
            title: 'Security Exempt',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secExempt/Instruction"),
    },
    {
        path: "/secExemptForm",
        name: 'SecExempt',
        meta: {
            title: 'Security Exempt',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secExempt"),
    },
    {
        path: "/secExempt/:id",
        name: 'SecExemptById',
        meta: {
            title: 'Security Exempt',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Security/secExempt"),
    },
    {
        path: "/domesticInsurer",
        name: 'DomesticInsurerInstruction',
        meta: {
            title: 'Domestic Insurer',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Insurance/DomesticInsurer/Instruction"),
    },
    {
        path: "/domesticInsurerForm",
        name: 'DomesticInsurer',
        meta: {
            title: 'Domestic Insurer',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Insurance/DomesticInsurer"),
    },
    {
        path: "/domesticInsurer/:id",
        name: 'DomesticInsurerById',
        meta: {
            title: 'Domestic Insurer',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Insurance/DomesticInsurer"),
    },
    {
        path: "/slotMachineLicense",
        name: 'SlotMachineLicenseInstruction',
        meta: {
            title: 'Slot Machine License',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Gambling/SlotMachine/Instruction"),
    },
    {
        path: "/slotMachineLicenseForm",
        name: 'SlotMachineLicense',
        meta: {
            title: 'Slot Machine License',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Gambling/SlotMachine"),
    },
    {
        path: "/slotMachineLicense/:id",
        name: 'SlotMachineLicenseById',
        meta: {
            title: 'Slot Machine License',
            auth: true      
        },
        component: () => import("../../pages/user/dynamicForms/Gambling/SlotMachine"),
    },
    
    {
        path: "/users",
        name: 'UsersList',
        meta: {
            title: 'Users List',
            auth: true      
        },
        component: () => import("../../pages/user/icspUser/List"),
    },
    
    {
        path: "/userCreation",
        name: 'UserCreation',
        meta: {
            title: 'User Creation',
            auth: true      
        },
        component: () => import("../../pages/user/icspUser/Single"),
    },
    {
        path: "/userUpdate/:id",
        name: 'UserUpdate',
        meta: {
            title: 'User Update',
            auth: true      
        },
        component: () => import("../../pages/user/icspUser/Single"),
    },

    {
        path: "/legalEntities",
        name: 'LegalEntities',
        meta: {
            title: 'Legal Entities',
            auth: true      
        },
        component: () => import("../../pages/user/legalEntities/List"),
    },

    {
        path: "/entityUpdate/:id",
        name: 'EntityUpdate',
        meta: {
            title: 'Entity Update',
            auth: true      
        },
        component: () => import("../../pages/user/legalEntities/Single"),
    },

    {
        path: "/entityCreation",
        name: 'EntityCreation',
        meta: {
            title: 'Entity Add',
            auth: true      
        },
        component: () => import("../../pages/user/legalEntities/Single"),
    },
    
    {
        path: "/requestForInformation",
        name: 'RequesttForInformation',
        meta: {
            title: 'Request for Information',
            auth: true      
        },
        component: () => import("../../pages/user/govRFI/Single"),
    },
    {
        path: "/myWallet",
        name: 'MyWallet',
        meta: {
            title: 'My Wallet',
            auth: true      
        },
        component: () => import("../../pages/user/myWallet/List"),
    },
    {
        path: "/addMoney/:id",
        name: 'AddMoney',
        meta: {
            title: 'Add Money',
            auth: true      
        },
        component: () => import("../../pages/user/myWallet/AddMoney"),
    },
    {
        path: "/transactionHistory/:id",
        name: 'AddMoneyTransaction',
        meta: {
            title: 'Transaction History',
            auth: true      
        },
        component: () => import("../../pages/user/myWallet/History"),
    },
    {
        path: "/quarterlyReturn",
        name: 'QuarterlyReturn',
        meta: {
            title: 'Quarterly Return',
            auth: true      
        },
        component: () => import("../../pages/user/quaterly"),
    },
    {
        path: "/quarterlyreturnIns",
        name: 'QuarterlyReturnInsurance',
        meta: {
            title: 'Quarterly Return',
            auth: true      
        },
        component: () => import("../../pages/user/quaterly"),
    },
    {
        path: "/quarterlyReturnGam",
        name: 'QuarterlyReturnGambling',
        meta: {
            title: 'Quarterly Return',
            auth: true      
        },
        component: () => import("../../pages/user/quaterly"),
    },
    {
        path: "/monthlyReturn",
        name: 'MonthlyReturn',
        meta: {
            title: 'Monthly Return',
            auth: true      
        },
        component: () => import("../../pages/user/monthlyReturn"),
    },
    {
        path: "/monthlyrRturnIns",
        name: 'MonthlyReturnInsurance',
        meta: {
            title: 'Monthly Return',
            auth: true      
        },
        component: () => import("../../pages/user/monthlyReturn"),
    },
    {
        path: "/monthlyReturnGam",
        name: 'MonthlyReturnGambling',
        meta: {
            title: 'Monthly Return',
            auth: true      
        },
        component: () => import("../../pages/user/monthlyReturn"),
    },
    {
        path: "/annualReturnSec",
        name: 'AnnualReturnSecurity',
        meta: {
            title: 'Annual Return',
            auth: true      
        },
        component: () => import("../../pages/user/renewal/annualFinancialStatement"),
    },
    {
        path: "/annualReturnIns",
        name: 'AnnualReturnInsurance',
        meta: {
            title: 'Annual Return',
            auth: true      
        },
        component: () => import("../../pages/user/renewal/annualFinancialStatement"),
    },
    {
        path: "/annualReturnGam",
        name: 'AnnualReturnGambling',
        meta: {
            title: 'Annual Return',
            auth: true      
        },
        component: () => import("../../pages/user/renewal/annualFinancialStatement"),
    },
    // {
    //     path: "/cessation",
    //     name: 'CessationList',
    //     meta: {
    //         title: 'Cessation List',
    //         auth: true      
    //     },
    //     component: () => import("../../pages/user/cessation/List"),
    // },
    {
        path: "/cessation",
        name: 'CessationRequest',
        meta: {
            title: 'Cessation Request',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/CessationOfBusiness"),
    },
    {
        path: "/cessation/:id",
        name: 'CessationRequestByID',
        meta: {
            title: 'Cessation Request',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/CessationOfBusiness"),
    },
    {
        path: "/cessationOutsideSeychelles",
        name: 'CessationOutsideSeychelles',
        meta: {
            title: 'Continuation Outside Seychelles',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/CessationOutsideSeychelles"),
    },
    {
        path: "/cessationOutsideSeychelles/:id",
        name: 'CessationOutsideSeychellesById',
        meta: {
            title: 'Continuation Outside Seychelles',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/CessationOutsideSeychelles"),
    },
    {
        path: "/dissolutionRegistration",
        name: 'DissolutionRegistration',
        meta: {
            title: 'Registration For DissolutionList',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/RegistrationForDissolution/List"),
    },
    
    {
        path: "/dissolutionRegistrationForm",
        name: 'DissolutionRegistrationForm',
        meta: {
            title: 'Registration For Dissolution',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/RegistrationForDissolution"),
    },
    {
        path: "/dissolutionRegistration/:id",
        name: 'DissolutionRegistrationByID',
        meta: {
            title: 'Registration For Dissolution',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/RegistrationForDissolution"),
    },
    {
        path: "/dissolution",
        name: 'Dissolution',
        meta: {
            title: 'Dissolution',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/Dissolution"),
    },
    {
        path: "/dissolution/:id",
        name: 'DissolutionByID',
        meta: {
            title: 'Dissolution',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/Dissolution"),
    },
    
    {
        path: "/rescissionOfDissolution",
        name: 'RescissionOfDissolution',
        meta: {
            title: 'Rescission Of Dissolution',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/RescissionOfDissolution"),
    },
    {
        path: "/rescissionOfDissolution/:id",
        name: 'RescissionOfDissolutionByID',
        meta: {
            title: 'Rescission Of Dissolution',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/RescissionOfDissolution"),
    },
    {
        path: "/deregistrationOfTrust",
        name: 'DeregistrationOfTrust',
        meta: {
            title: 'Deregistration of Trust',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/DeregistrationOfTrust"),
    },
    {
        path: "/deregistrationOfTrust/:id",
        name: 'DeregistrationOfTrustByID',
        meta: {
            title: 'Deregistration of Trust',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/DeregistrationOfTrust"),
    },
    {
        path: "/restorationByCourtOrder",
        name: 'RestorationByCourtOrder',
        meta: {
            title: 'Restoration By Court Order',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/restorationByCourtOrder"),
    },
    {
        path: "/restorationByCourtOrder/:id",
        name: 'RestorationByCourtOrderByID',
        meta: {
            title: 'Restoration By Court Order',
            auth: true      
        },
        component: () => import("../../pages/user/cessation/restorationByCourtOrder"),
    },
    {
        path: "/surrenderLicense",
        name: 'SurrenderLicense',
        meta: {
            title: 'Surrender of License',
            auth: true      
        },
        component: () => import("../../pages/user/surrender"),
    },
    {
        path: "/surrenderLicenseForm",
        name: 'SurrenderLicenseForm',
        meta: {
            title: 'Surrender of License',
            auth: true      
        },
        component: () => import("../../pages/user/surrender/SingleTicket"),
    },
    {
        path: "/surrenderLicense/:id",
        name: 'SurrenderLicenseByID',
        meta: {
            title: 'Surrender of License',
            auth: true      
        },
        component: () => import("../../pages/user/surrender/SingleTicket"),
    },
    {
        path: "/surrenderLicenseSec",
        name: 'SurrenderLicenseSecurity',
        meta: {
            title: 'Surrender of License',
            auth: true      
        },
        component: () => import("../../pages/user/surrender"),
    },
    {
        path: "/surrenderLicenseSecForm",
        name: 'SurrenderLicenseSecurityForm',
        meta: {
            title: 'Surrender of License',
            auth: true      
        },
        component: () => import("../../pages/user/surrender/SingleTicket"),
    },
    {
        path: "/surrenderLicenseSec/:id",
        name: 'SurrenderLicenseByIDSecurity',
        meta: {
            title: 'Surrender of License',
            auth: true      
        },
        component: () => import("../../pages/user/surrender/SingleTicket"),
    },
    {
        path: "/surrenderLicenseIns",
        name: 'SurrenderLicenseInsurance',
        meta: {
            title: 'Surrender of License',
            auth: true      
        },
        component: () => import("../../pages/user/surrender"),
    },
    {
        path: "/surrenderLicenseInsForm",
        name: 'SurrenderLicenseInsuranceForm',
        meta: {
            title: 'Surrender of License',
            auth: true      
        },
        component: () => import("../../pages/user/surrender/SingleTicket"),
    },
    {
        path: "/surrenderLicenseIns/:id",
        name: 'SurrenderLicenseByIDInsurance',
        meta: {
            title: 'Surrender of License',
            auth: true      
        },
        component: () => import("../../pages/user/surrender/SingleTicket"),
    },
    {
        path: "/surrenderLicenseGam",
        name: 'SurrenderLicenseGambling',
        meta: {
            title: 'Surrender of License',
            auth: true      
        },
        component: () => import("../../pages/user/surrender"),
    },
    {
        path: "/surrenderLicenseGamForm",
        name: 'SurrenderLicenseGamblingForm',
        meta: {
            title: 'Surrender of License',
            auth: true      
        },
        component: () => import("../../pages/user/surrender/SingleTicket"),
    },
    {
        path: "/surrenderLicenseGam/:id",
        name: 'SurrenderLicenseByIDGambling',
        meta: {
            title: 'Surrender of License',
            auth: true      
        },
        component: () => import("../../pages/user/surrender/SingleTicket"),
    },
    {
        path: "/annualRenewalSec",
        name: 'LicenseeAnnualRenewalSecurity',
        meta: {
            title: 'Licensee Annual Renewal',
            auth: true      
        },
        component: () => import("../../pages/user/renewal/licenseeAnnualRenewal"),
    },
    {
        path: "/annualRenewalIns",
        name: 'LicenseeAnnualRenewalInsurance',
        meta: {
            title: 'Licensee Annual Renewal',
            auth: true      
        },
        component: () => import("../../pages/user/renewal/licenseeAnnualRenewal"),
    },
    {
        path: "/annualRenewalGam",
        name: 'LicenseeAnnualRenewalGambling',
        meta: {
            title: 'Licensee Annual Renewal',
            auth: true      
        },
        component: () => import("../../pages/user/renewal/licenseeAnnualRenewal"),
    },
    {
        path: "/changesSec",
        name: "ChangesSecurity",
        meta: {
            title: "Changes Security",
            auth: true
        },
        component: () => import("Pages/user/changeSec/List")
    },
    {
        path: "/changesSec/:id",
        name: "ChangesSecurityTicket",
        meta: {
            title: "Changes Security",
            auth: true
        },
        component: () => import("Pages/user/changeSec/SingleTicket")
    },
    {
        path: "/changesSec/add/:addRef",
        name: "ChangesAddSecurity",
        meta: {
            title: "Add Change Security",
            auth: true
        },
        component: () => import("Pages/user/changeSec/SingleTicket")
    },
    {
        path: "/changesSec/:id/respond/:process_id",
        name: "ChangesSecRespond",
        meta: {
            title: "Respond",
            auth: true, 
        },
        component: () => import("../../pages/user/RFI"),
    },
    {
        path: "/changesSec/edit",
        name: "ChangesSecurityEdit",
        meta: {
            title: "Edit Change Security",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/changeSec/SingleTicket")
    },
    {
        path: "/changesGam",
        name: "ChangesGambling",
        meta: {
            title: "Changes Gambling",
            auth: true
        },
        component: () => import("Pages/user/changeGambling/List")
    },
    {
        path: "/changesGam/:id",
        name: "ChangesGamblingTicket",
        meta: {
            title: "Changes Gambling",
            auth: true
        },
        component: () => import("Pages/user/changeGambling/SingleTicket")
    },
    {
        path: "/changesGam/add/:addRef",
        name: "ChangesAddGambling",
        meta: {
            title: "Add Change Gambling",
            auth: true
        },
        component: () => import("Pages/user/changeGambling/SingleTicket")
    },
    {
        path: "/changesGam/:id/respond/:process_id",
        name: "ChangesGamRespond",
        meta: {
            title: "Respond",
            auth: true, 
        },
        component: () => import("../../pages/user/RFI"),
    },
    {
        path: "/changesGam/edit",
        name: "ChangesGamblingEdit",
        meta: {
            title: "Edit Change Gambling",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/changeGambling/SingleTicket")
    },
    
    {
        path: "/generateRepCode",
        name: "GenerateRepCode",
        meta: {
            title: "Generate Code",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/generateRepCode")
    },
    
    
    {
        path: "/RODreceipt",
        name: "RODReceipt",
        meta: {
            title: "ROD Receipt",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/rodReceipt")
    },
    
    {
        path: "/certifiedCopy",
        name: "CertifiedCopy",
        meta: {
            title: "Certified Copy",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/requests/certifiedCopy")
    },
    {
        path: "/filingOfRegister",
        name: "FilingOfRegister",
        meta: {
            title: "Filing Of Register",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/requests/fillingOfRegister")
    },
    {
        path: "/filingOfRegister/:id",
        name: "FilingOfRegisterByID",
        meta: {
            title: "Filing Of Register",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/requests/fillingOfRegister")
    },
    {
        path: "/filingOfDocument",
        name: "FilingOfDocument",
        meta: {
            title: "Filing Of Document",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/requests/filingOfDocument")
    },
    {
        path: "/applyNewLicense",
        name: "ApplyNewLicense",
        meta: {
            title: "Apply For New License",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/applyNewLicense")
    },
    {
        path: "/mypq",
        name: "MyPQ",
        meta: {
            title: "My PQ",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/my_pq")
    },
    {
        path: "/mypq/:id",
        name: "MyPQByID",
        meta: {
            title: "My PQ",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/my_pq")
    },
    
    {
        path: "/my_pq/emailUpdate",
        name: "MyPQEmailUpdate",
        meta: {
            title: "My PQ Email Update",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/my_pq/emailUpdate")
    },
    {
        path: "/my_pq/passportUpdate",
        name: "MyPQPassportUpdate",
        meta: {
            title: "My PQ Passport Update",
            auth: true 
        },
        props: true,
        component: () => import("Pages/user/my_pq/updatePassport")
    },
    {
        path: "/lowBalance/:id",
        name: 'LowBalanceAlert',
        meta: {
            title: 'Low Balance Alert',
            auth: true      
        },
        component: () => import("../../pages/user/myWallet/LowBalance"),
    },
    {
        path: "/requestedDocList",
        name: 'ReequestedDocList',
        meta: {
            title: 'Requested Document List',
            auth: true      
        },
        component: () => import("../../pages/user/submitRequestedDocument/List"),
    },
    {
        path: "/requestedDoc/:ticketReference",
        name: 'ReequestedDocsByTicket',
        meta: {
            title: 'Requested Documents',
            auth: true      
        },
        component: () => import("../../pages/user/submitRequestedDocument/RequestedDocs"),
    },
    // {
    //     path: "/testPages",
    //     name: 'TestPage',
    //     meta: {
    //         title: 'TestPage',
    //         auth: true      
    //     },
    //     component: () => import("../../pages/user/TestingPages/TestingPage"),
    // },
];
        