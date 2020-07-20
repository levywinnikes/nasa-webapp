import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import "./style.css"



export default function NavBar() {
    const dispatch = useDispatch()
    const storeDate = useSelector(state => state.date)
    const isLoadingStore = useSelector(state => state.isLoading)
    const firstPost = useSelector(state => state.firstPost)
    const lastPost = useSelector(state => state.lastPost)
    const selectedDate = useSelector(state => state.date)
    const pageSelected = useSelector(state => state.pageSelected)
    const [calendarDate, setCalendarDate] = useState(lastPost.slice(5))
    const [errorMessage, setErrorMessage] = useState("")


    useEffect(() => {
        console.log(firstPost)
        console.log(storeDate)
    }, [])

    useEffect(() => {
        console.log(firstPost)
        console.log(storeDate)
    }, [storeDate])


    useEffect(() => {
        dispatch({ type: 'SET_PAGE_SELECTED', pageSelected: window.location.pathname })

    }, [window.location.pathname])



    function changeDate(event) {
        checkDateInput(event.target.value)
        const newDate = event.target.value
        setCalendarDate(newDate)

    }

    function checkDateInput(inputValue) {
        const inputDate = new Date(inputValue);
        const lastDate = new Date(lastPost)
        const firstDate = new Date(firstPost)

        if (inputDate < firstDate) { setErrorMessage(`The first date is less than ${firstPost.slice(5)}`) }
        else if (inputDate > lastDate) { setErrorMessage(`The last date is greater than ${lastPost.slice(5)}`) }
        else setErrorMessage("")

    }


    function prevDate() {
        if (storeDate) {
            const yesterday = new Date(storeDate);
            var newDate = null
            yesterday.setDate(yesterday.getDate() - 1)
            newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(yesterday))

            return newDate
        }
    }
    const getPrevDate = prevDate()




    function nextDate() {
        if (storeDate) {
            const tomorrow = new Date(storeDate);
            var newDate = null
            tomorrow.setDate(tomorrow.getDate() + 1)
            newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(tomorrow))

            return newDate
        }
    }
    const getNextDate = nextDate()


    const isLastPost = () => storeDate === lastPost || isLoadingStore === true ? false : true
    const isFirstPost = () => storeDate === firstPost || isLoadingStore === true ? false : true
    const isValidDatePrev = () => storeDate === firstPost || isLoadingStore === true || selectedDate === null ? false : true
    const isValidDateNext = () => storeDate === lastPost || isLoadingStore === true || selectedDate === null ? false : true
    const isListPosts = () => isLoadingStore === true || pageSelected === "/listPosts" ? false : true
    const isAlbum = () => isLoadingStore === true || pageSelected === "/listAlbum" ? false : true





    const isValidDate = () => {
        if (selectedDate) {
            const inputDate = new Date(calendarDate);
            const lastDate = new Date(lastPost.slice(5))
            const firstDate = new Date(firstPost.slice(5))


            if (isNaN(inputDate.getDate()) || isLoadingStore === true || inputDate < firstDate || inputDate > lastDate || calendarDate === selectedDate.slice(5)) {
                return false
            }
            else {
                return true
            }
        }
    }

    return (
        <header>
            <div className="container">
                <div className="menu-date-select">
                    <div className="input-group">
                        <p>Set a date to navigate: </p>
                        <input onChange={(e) => changeDate(e)} type="date" value={calendarDate}></input>
                        <div className="error-message">{`${errorMessage}`}</div>
                        <div className="menu-button-go">
                            {isValidDate() ?
                                (<Link className="button" to={`/date/date=${calendarDate}`}>Go</Link>) :
                                (<a className="disabled-button">Go</a>)}
                        </div>
                    </div>

                </div>
                <nav>
                    <ul>
                        <li className="menu-item menu-button-first"> {isFirstPost() ?
                            (<Link className="button" to={`/date/${firstPost}`}>First</Link>) :
                            (<a className="disabled-button">First</a>)}
                        </li>
                        <li className="menu-item menu-button-last"> {isLastPost() ?
                            (<Link className="button" to={`/date/${lastPost}`}>Last</Link>) :
                            (<a className="disabled-button">Last</a>)}
                        </li>
                        <li className="menu-item calendar-button"> {isListPosts() ?
                            (<Link className="button" to={`/listPosts`}>List</Link>) :
                            (<a className="disabled-button">List</a>)}
                        </li>
                        <li className="menu-item calendar-button"> {isAlbum() ?
                            (<Link className="button" to={`/album`}>Album</Link>) :
                            (<a className="disabled-button">Album</a>)}
                        </li>
                    </ul>
                </nav>
            </div>

        </header >
    )
}