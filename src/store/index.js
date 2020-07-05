import {createStore} from 'redux'


const takeLastPost = () => {
    const last = new Date();
    var newDate = null
    last.setDate(last.getDate())
    newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(last))
    return newDate;
}


const INITIAL_STATE = {
    date: null,
    isLoading: false,
    firstPost: "1995-06-16",  
    lastPost: takeLastPost()  
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