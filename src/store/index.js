import {createStore} from 'redux'




const INITIAL_STATE = {
    date: null,
    isLoading: false,
    lastPost: null,
};

function nasaStore(state = INITIAL_STATE, action){
    switch(action.type){
        case 'SET_DATE':
            return {...state, date:  action.date }
        case 'SET_LOADING':
            return {...state, isLoading:  action.isLoading }


        default:
            return state;
    }
}

const store = createStore(nasaStore);

export default store;