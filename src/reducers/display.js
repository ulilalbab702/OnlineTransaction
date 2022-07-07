import {SET_PAGE_DISPLAY_MODE} from 'actions/actionTypes';

let initialPageDisplayMode = 'web';
if (window.innerWidth < 600) initialPageDisplayMode = 'mobile';
if (window.innerWidth < 1026) initialPageDisplayMode = 'tab';

export default (state = initialPageDisplayMode,action) => {
    if(action.type === SET_PAGE_DISPLAY_MODE){
        return action.mode;
    }

    return state;
}
