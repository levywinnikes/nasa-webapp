import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'



export default function NavBar() {

    const storeDate = useSelector(state => state.date)
    const isLoadingStore = useSelector(state => state.isLoading)
    const firstPost = useSelector(state => state.firstPost)
    const lastPost = useSelector(state => state.lastPost)
    const selectedDate = useSelector(state => state.date)
    const [calendarDate, setCalendarDate] = useState(lastPost)
    const [errorMessage, setErrorMessage] = useState("")
    const dispatch = useDispatch()



    function changeDate(event) {
        checkDateInput(event.target.value)
        const newDate = event.target.value
        setCalendarDate(newDate)

    }

    function checkDateInput(inputValue) {
        const inputDate = new Date(inputValue);
        const lastDate = new Date(lastPost)
        const firstDate = new Date(firstPost)

        if (inputDate < firstDate) { setErrorMessage(`The first date is less than ${firstPost}`) }
        else if (inputDate > lastDate) { setErrorMessage(`The last date is greater than ${lastPost}`) }
        else setErrorMessage("")

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

    function goDate() {
        dispatch({ type: 'SET_DATE', date: calendarDate })
    }


    function last() {
        dispatch({ type: 'SET_DATE', date: lastPost })
    }

    function first() {
        dispatch({ type: 'SET_DATE', date: firstPost })
    }


    const isLastPost = () => storeDate === lastPost || isLoadingStore === true ? true : false
    const isFirstPost = () => storeDate === firstPost || isLoadingStore === true ? true : false
    const isValidDate = () => {
        const inputDate = new Date(calendarDate);
        const lastDate = new Date(lastPost)
        const firstDate = new Date(firstPost)

        console.log(console.log(calendarDate) + "  " + console.log(selectedDate))

        if (isNaN(inputDate.getDate()) || isLoadingStore === true || inputDate < firstDate || inputDate > lastDate || calendarDate === selectedDate) {
            return true
        }
        else {
            return false
        }
    }




    return (
        <div className="navbar">
            <ul>
                <li className="menu-item"><p>Set a date to navigate: </p></li>
                <li className="menu-item">
                    <div className="input-group">
                        <div className="error-message">{`${errorMessage}`}</div>
                        <input onChange={(e) => changeDate(e)} type="date" value={calendarDate}></input>
                    </div>
                </li>
                <li className="menu-item"><button disabled={isValidDate()} onClick={() => goDate()}>Go</button></li>
                <li className="menu-item"><button disabled={isFirstPost()} onClick={() => first()}>First</button></li>
                <li className="menu-item"><button disabled={isFirstPost()} onClick={() => prevDate()}>Prev</button></li>
                <li className="menu-item"><button disabled={isLastPost()} onClick={() => nextDate()}>Next</button></li>
                <li className="menu-item"><button disabled={isLastPost()} onClick={() => last()}>Last</button></li>
                <li className= "menu-item created-by">Created by André L. Scarpim Winnikes </li>
            </ul>
        </div>
    )
}