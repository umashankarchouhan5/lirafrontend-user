import { extend, localize } from "vee-validate";
import { min, required, email, confirmed, numeric, ext , required_if, is, max, regex, mimes, length, alpha_num, digits } from "vee-validate/dist/rules";
import en from "vee-validate/dist/locale/en.json";
import messages from './validationsMessages';

// Install rules
extend("is", is);
extend("required", required);
extend("required_if", required_if);
extend("min", min);
extend("max", max);
extend("email", email);
extend("confirmed", confirmed);
extend("numeric", numeric);
extend("ext", ext);
extend('regex', regex);
extend('mimes',mimes);
extend('equal',length);
extend('alpha_num',alpha_num);
extend('digits',digits);

// Install messages
localize({
    en
});

localize({
    en: {
        messages: {
            email: 'Email should have a valid format',
            required: 'Required.'
            // required: 'This field is required'
        },
        fields: {
            'Confirm Your Email ID': {
                confirmed: 'Confirm Email Id does not match',
            },
            'nameReservationBulkExcel': {
                ext: 'Upload file with .xsl or .xlsx extension please',
                required: 'Provide file please',
            },
            'nameReservationBulkFiles': {
                ext: 'Use allowed extensions please.',
            },
            register_accept_terms: {
                required: 'Please accept the Terms and Conditions.'
            },
            'Confirm Mobile Number': {
                confirmed: 'Confirm Mobile Number does not match',
            },
            'Confirm New Password': {
                confirmed: 'Confirm password does not match new password'
            },
            ...messages
        }
    }
});

extend('nameReservation_IBC', {
    validate: (value) => {
        return (value.trim().toUpperCase().endsWith(" LIMITED") ||
            value.trim().toUpperCase().endsWith(" CORPORATION") ||
            value.trim().toUpperCase().endsWith(" INCORPORATED") ||
            value.trim().toUpperCase().endsWith(" LTD") ||
            value.trim().toUpperCase().endsWith(" CORP") ||
            value.trim().toUpperCase().endsWith(" INC") ||
            value.trim().toUpperCase().endsWith(" LTD.") ||
            value.trim().toUpperCase().endsWith(" CORP.") ||
            value.trim().toUpperCase().endsWith(" INC.") ||
            value.trim().toUpperCase().endsWith(" PCC")
        )
    },
    message: 'Proposed name should end with “Limited”, “Corporation”, “Incorporated”, “Ltd.”, “Corp.”, “Inc.”, “Ltd”, “Corp”, “Inc” or “Pcc”'
});

extend('nameReservation_LP', {
    validate: (value) => {
        return (value.trim().toUpperCase().endsWith(" LIMITED PARTNERSHIP") ||
            value.trim().toUpperCase().endsWith(" L.P.") ||
            value.trim().toUpperCase().endsWith(" LP"))
    },
    message: 'Proposed name should end with “Limited Partnership”, “L.P.”, “LP”.'
});

extend('nameReservation_Foundation', {
    validate: (value) => {
        return value.trim().toUpperCase().endsWith(" FOUNDATION")
    },
    message: 'Proposed name should end with “Foundation”.'
});

extend('nameReservation_Trust', {
    validate: (value) => {
        return value.trim().toUpperCase().endsWith(" TRUST")
    },
    message: 'Proposed name should end with “Trust”.'
});
extend('ageCheck', {
    validate: (value) => {
        var ageDifMs = Date.now() - Date.parse(value);
        var ageDate = new Date(ageDifMs);
        var age = Math.abs(ageDate.getUTCFullYear() - 1970);
        return age > 18;
    },
    message: 'Age should be greater than 18'
});
extend('docCheck', {
    validate: (fieldValue, ext) =>{
        if(fieldValue.length > 0){
            var docExtArr = fieldValue[0].name.split('.');
            var docExt = docExtArr[docExtArr.length - 1]
            var d,doTheyMatch = false;
            if(ext[0].includes(',')){
                ext= ext[0].split(',');
            }
            for(d=0; d < ext.length; d++){
                if(docExt.toUpperCase() === ext[d].toUpperCase()){
                    doTheyMatch = true;
                }
            }
            return doTheyMatch;
        }
        return true;
    },
    message:(data,args) => 'Allowed file type(s): ' +args[0]
})
extend('notExactCompany', {
    validate: (fieldValue, companyArray) =>{
        if(companyArray !== null && companyArray.length !== 0 && companyArray[0] !== null){
            var companies = companyArray.map( ele => {
                return ele.CompanyName;
            })
            var doTheyMatch = false;
            if(companies.indexOf(fieldValue) !== -1){
                doTheyMatch = true;
            }
            return !doTheyMatch;
        }
        else{
            return true;
        }
    },
    message:() => 'This name matches with an existing company'
})
extend('dynamicTableRequired',{
    ...required,
    message: 'Required'
})
extend('uploadRequired',{
    ...required,
    message: 'Please upload file'
})
extend('checkFileRegex',{
    validate: (fieldValue) =>{
        if(fieldValue.length > 0){
            var fileVar = fieldValue[0].name.split('.');
            if(fileVar.length > 2){
                return false
            }
            else{
                var matchRegex = false;
                const regexp = /^(?!.*[<>'"/;`%_+=~!@#$^&\[\]}{])/ ;
                matchRegex = fileVar[0].match(regexp);
                return matchRegex !== null ? true: false;

            }
        }
        return true;
    },
    message:() => 'Filename should not contain (<>\';\"/\`%_+=~!@#$^&\[\]}{).'
})
extend('checkMonthDateGreaterOrNot',{
    validate: (fieldVal, dates) =>{
        var dateArray = dates[0].split('|')
        var fromDate = dateArray[0];
        var toDate = dateArray[1];
        var d1  = new Date(fromDate);
        var d2 = new Date(toDate)
        if(d1 > d2){
            return false;
        }
        return true;
    },
    message:() => 'To Date should be greater than From Date'
})
extend('alphaNumCustom', {
    validate: (fieldValue) =>{
        if(fieldValue.length > 0){
            if(fieldValue.trim().match("^[a-zA-Z0-9]*$")){
                return true
            }
            return false
        }
        return true;
    },
    message:() => 'Only alphanumerical value allowed '
})



