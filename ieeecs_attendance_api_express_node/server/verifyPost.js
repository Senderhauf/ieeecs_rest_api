'use strict';

/**
 * Check if date items were filled in when posted
 *      if not auto fill with current date
 * Year:
 *      min: 2018
 *      max: 2050
 */

let date = new Date();

const fieldTypes = {
    ePantherID: 'required', 
    name: 'optional', 
    major: 'optional', 
    dateEntered: 'required', 
    year: 'required', 
    month: 'required', 
    day: 'required', 
    presentationGrade: 'optional'
}

function validateAttendance(post){
    for(const field in fieldTypes){
        
        const type = fieldTypes[field];
        
        if(!type){
            // delete types that are not defined in fieldTypes array
            delete post[field];     
        } 
        else if(type === 'required' && !post[field]) {
            switch(field){
                case year:
                    post[field] = new Date().getFullYear();
                case month:
                    post[field] = new Date().getMonth();
                case year:
                    post[field] = new Date().getDay();
                default:
                    return `${field} is required.`;     
            }
        }
        else if(type === 'required'){
            let valid = false;
            switch(field) {
                case year:
                    valid = validateYear(post[field]);
                case month:
                    valid = validateMonth(post[field]);
                case day:
                    valid = validateDay(post[field]);
                case ePantherID:
                    valid = validateID(post[field]);
                default:
                    if(!valid){
                        return `${field}: ${post[field]} is invalid`
                    }
            }
        }
    }

    // check if the date items are present and valid

    return null;
}

function validateDay(day){
    let dayInt = int(day);
    return (dayInt < 1 || dayInt > 31) ? false : true; 
}

function validateMonth(month){
    let monthInt = int(month);
    return (monthInt < 1 || monthInt > 12) ? false : true;
}

function validateYear(year){
    let yearInt = int(year);
    let curYear = new Date().getFullYear();
    return (yearInt < curYear-1 || yearInt > curYear+1)
}

function validateID(id){
    return (id.length < 9 || id.length > 9)? false : true; 
}