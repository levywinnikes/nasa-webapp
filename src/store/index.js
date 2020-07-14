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
    lastPost: takeLastPost(),
    apiKey:  "caAtJWtk07G83BJP6T5w5zwWVURksPCbs468353t",
    pageSelected: null,

};

function nasaStore(state = INITIAL_STATE, action){
    switch(action.type){
        case 'SET_DATE':
            return {...state, date:  action.date }
        case 'SET_LOADING':
            return {...state, isLoading:  action.isLoading }
        case 'SET_PAGE_SELECTED':
            return {...state, pageSelected: action.pageSelected }


        default:
            return state;
    }
}

const store = createStore(nasaStore);

export default store;