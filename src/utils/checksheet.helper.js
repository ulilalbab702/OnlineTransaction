import { 
    ConditionGood,
    ConditionBad,
    ConditionUncheck,
    ConditionLow,
    ConditionMedium,
    ConditionHigh,
    ConditionACEmpty,
    ConditionACLow,
    ConditionACHigh,
    ConditionGrace25,
    ConditionGrace50,
    ConditionGrace75,
    ConditionGrace100,
    ConditionThickClean,
    ConditionThickMedium,
    ConditionThickHigh,
    ConditionViolanceSoft,
    ConditionViolanceHard,
    ConditionWarning,
    IconLow,
    IconMedium,
    IconHigh,
    IconViolanceSoft,
    IconViolanceHard,
    IconThickClean,
    IconThickMedium,
    IconThickHigh,
    ConditionGoodWhite,
    ConditionBadWhite,
    ConditionUncheckWhite
} from 'assets/icons';
import {CONDITIONCODE} from 'constants/conditionCode'

export const renderIcon = (ConditionCode,Measurement) => {
    switch (true) {
        case (Measurement === '0' && ConditionCode === CONDITIONCODE.GOOD):
            return ConditionGood
        case (Measurement === '0' && ConditionCode === CONDITIONCODE.BAD):
            return ConditionBad
        case (Measurement === '0' && ConditionCode === CONDITIONCODE.UNCHECK):
            return ConditionUncheck
        case (Measurement === '1' && ConditionCode === CONDITIONCODE.FLUID_LOW):
            return ConditionLow
        case (Measurement === '1' && ConditionCode === CONDITIONCODE.FLUID_MEDIUM):
            return ConditionMedium
        case (Measurement === '1' && ConditionCode === CONDITIONCODE.FLUID_HIGH):
            return ConditionHigh
        case (Measurement === '2' && ConditionCode === CONDITIONCODE.VIOLANCE_SOFT):
            return ConditionViolanceSoft
        case (Measurement === '2' && ConditionCode === CONDITIONCODE.VIOLANCE_HARD):
            return ConditionViolanceHard
        case (Measurement === '3' && ConditionCode === CONDITIONCODE.SOIL_THICK_CLEAN):
            return ConditionThickClean
        case (Measurement === '3' && ConditionCode === CONDITIONCODE.SOIL_THICK_MEDIUM):
            return ConditionThickMedium
        case (Measurement === '3' && ConditionCode === CONDITIONCODE.SOIL_THICK_HIGH):
            return ConditionThickHigh
        case (Measurement === '4' && ConditionCode === CONDITIONCODE.REFRIGRERANT_EMPTY):
            return ConditionACEmpty
        case (Measurement === '4' && ConditionCode === CONDITIONCODE.REFRIGRERANT_LOW):
            return ConditionACLow
        case (Measurement === '4' && ConditionCode === CONDITIONCODE.REFRIGRERANT_HIGH):
            return ConditionACHigh
        case (Measurement === '5' && ConditionCode === CONDITIONCODE.GRACE25):
             return ConditionGrace25
        case (Measurement === '5' && ConditionCode === CONDITIONCODE.GRADE50):
             return ConditionGrace50
        case (Measurement === '5' && ConditionCode === CONDITIONCODE.GRACE75):
             return ConditionGrace75
        case (Measurement === '5' && ConditionCode === CONDITIONCODE.GRACE100) :
             return ConditionGrace100
        default: 
            return ConditionWarning;
    }
}

export const renderProperties = (Measurement,ConditionCode,ConditionDesc) => {
    switch (true) {
        case (Measurement === '0' && ConditionCode === CONDITIONCODE.GOOD):
            return {
                icon:ConditionGoodWhite,
                desc:ConditionDesc,
                name:'condition-choosen-good'
            }
        case (Measurement === '0' && ConditionCode === CONDITIONCODE.BAD):
            return {
                icon:ConditionBadWhite,
                desc:ConditionDesc,
                name:'condition-choosen-bad'
            }   
        case (Measurement === '0' && ConditionCode === CONDITIONCODE.UNCHECK):
            return {
                icon:ConditionUncheckWhite,
                desc:ConditionDesc,
                name:'condition-choosen-uncheck'
            }   
        case (Measurement === '1' && ConditionCode === CONDITIONCODE.FLUID_LOW):
            return {
                icon:IconLow,
                desc:ConditionDesc,
                name:'condition-choosen'
            }   
        case (Measurement === '1' && ConditionCode === CONDITIONCODE.FLUID_MEDIUM):
            return {
                icon:IconMedium,
                desc:ConditionDesc,
                name:'condition-choosen'
            }   
        case (Measurement === '1' && ConditionCode === CONDITIONCODE.FLUID_HIGH):
            return {
                icon:IconHigh,
                desc:ConditionDesc,
                name:'condition-choosen'
            }   
        case (Measurement === '2' && ConditionCode === CONDITIONCODE.VIOLANCE_SOFT):
            return {
                icon:IconViolanceSoft,
                desc:ConditionDesc,
                name:'condition-choosen'
            }   
        case (Measurement === '2' && ConditionCode === CONDITIONCODE.VIOLANCE_HARD):
            return {
                icon:IconViolanceHard,
                desc:ConditionDesc,
                name:'condition-choosen'
            }   
        case (Measurement === '3' && ConditionCode === CONDITIONCODE.SOIL_THICK_CLEAN):
            return {
                icon:IconThickClean,
                desc:ConditionDesc,
                name:'condition-choosen'
            }   
        case (Measurement === '3' && ConditionCode === CONDITIONCODE.SOIL_THICK_MEDIUM):
            return {
                icon:IconThickMedium,
                desc:ConditionDesc,
                name:'condition-choosen'
            }   
        case (Measurement === '3' && ConditionCode === CONDITIONCODE.SOIL_THICK_HIGH):
            return {
                icon:IconThickHigh,
                desc:ConditionDesc,
                name:'condition-choosen'
            }   
        case (Measurement === '4' && ConditionCode === CONDITIONCODE.REFRIGRERANT_EMPTY):
            return {
                icon:ConditionACEmpty,
                desc:ConditionDesc,
                name:'condition-choosen'
            }   
        case (Measurement === '4' && ConditionCode === CONDITIONCODE.REFRIGRERANT_LOW):
            return {
                icon:ConditionACLow,
                desc:ConditionDesc,
                name:'condition-choosen'
            }   
        case (Measurement === '4' && ConditionCode === CONDITIONCODE.REFRIGRERANT_HIGH):
            return {
                icon:ConditionACHigh,
                desc:ConditionDesc,
                name:'condition-choosen'
            }   
        case (Measurement === '5' && ConditionCode === CONDITIONCODE.GRACE25):
            return {
                icon:ConditionGrace25,
                desc:ConditionDesc,
                name:'condition-choosen'
            }      
        case (Measurement === '5' && ConditionCode === CONDITIONCODE.GRADE50):
            return {
                icon:ConditionGrace50,
                desc:ConditionDesc,
                name:'condition-choosen'
            }      
        case (Measurement === '5' && ConditionCode === CONDITIONCODE.GRACE75):
            return {
                icon:ConditionGrace75,
                desc:ConditionDesc,
                name:'condition-choosen'
            }      
        case (Measurement === '5' && ConditionCode === CONDITIONCODE.GRACE100) :
            return {
                icon:ConditionGrace100,
                desc:ConditionDesc,
                name:'condition-choosen'
            }      
        default:
            return {
                icon:ConditionWarning,
                desc:ConditionDesc,
                name:'condition-choosen'
            }   
    }
}

export const selectConditionIcon = (Measurement,ConditionCode,ConditionDesc) => {
    switch (true) {
        case (Measurement === '0' && ConditionCode === CONDITIONCODE.GOOD):
            return ConditionGood
        case (Measurement === '0' && ConditionCode === CONDITIONCODE.BAD):
            return ConditionBad
        case (Measurement === '0' && ConditionCode === CONDITIONCODE.UNCHECK):
            return ConditionUncheck
        default:
            return renderProperties(Measurement,ConditionCode,ConditionDesc).icon;
    }
}