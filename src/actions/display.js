import {SET_PAGE_DISPLAY_MODE} from './actionTypes';

export const setPageDisplayModeAction = mode => {
    return {
        type:SET_PAGE_DISPLAY_MODE,
        mode
    }
}
