import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'

const takeLastPost = () => {
    const last = new Date();
    var newDate = null
    last.setDate(last.getDate())
    newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(last))

    return newDate;
}


export default function NavBar() {

    const [calendarDate, setCalendarDate] = useState(null)
    const storeDate = useSelector(state => state.date)
    const isLoadingStore = useSelector(state => state.isLoading)
    const dispatch = useDispatch()
    const lastPost = takeLastPost()


    

    console.log(lastPost + "AQUI")

  


    function changeDate(event){
        const newDate = event.target.value
        setCalendarDate(newDate)
    }

    function prevDate() {
        const yesterday = new Date(storeDate);
        var newDate = null
        newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(yesterday))

        dispatch({ type: 'SET_DATE', date: newDate })
    }

    function nextDate() {
        const tomorrow = new Date(storeDate);
        var newDate = null
        tomorrow.setDate(tomorrow.getDate() + 2)
        newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(tomorrow))
        dispatch({ type: 'SET_DATE', date: newDate })

    }

    function goDate(){
        dispatch({ type: 'SET_DATE', date: calendarDate })
    }


    function last() {
        dispatch({ type: 'SET_DATE', date: lastPost })
    }


    const isLastPost = () => storeDate === lastPost || isLoadingStore === true ? true : false

    const isLoading = () => isLoadingStore === true ? true : false

    
    




    return (
        <div className="navbar">
            <ul>
                <li><input onChange = {(e) => changeDate(e)} type = "date" value = {calendarDate}></input></li>
                <li><button disabled = {isLoading()} onClick={() => goDate()}>Go</button></li>
                <li><button disabled = {isLoading()} onClick={() => prevDate()}>Prev</button></li>
                <li><button disabled = {isLastPost()} onClick={() => last()}>Last</button></li>
                <li><button disabled = {isLastPost()} onClick={() => nextDate()}>Next</button></li>

            </ul>


        </div>
    )
}