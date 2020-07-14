import React, { useState , useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'



export default function NavBar() {
    const dispatch = useDispatch()
    const storeDate = useSelector(state => state.date)
    const isLoadingStore = useSelector(state => state.isLoading)
    const firstPost = useSelector(state => state.firstPost)
    const lastPost = useSelector(state => state.lastPost)
    const selectedDate = useSelector(state => state.date)
    const pageSelected = useSelector(state => state.pageSelected)
    const [calendarDate, setCalendarDate] = useState(lastPost)
    const [errorMessage, setErrorMessage] = useState("")


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

        if (inputDate < firstDate) { setErrorMessage(`The first date is less than ${firstPost}`) }
        else if (inputDate > lastDate) { setErrorMessage(`The last date is greater than ${lastPost}`) }
        else setErrorMessage("")

    }

    function prevDate() {
        const yesterday = new Date(storeDate);
        var newDate = null
        newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(yesterday))

        return newDate
    }
    const getPrevDate = prevDate()


    function nextDate() {
        const tomorrow = new Date(storeDate);
        var newDate = null
        tomorrow.setDate(tomorrow.getDate() + 2)
        newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(tomorrow))

        return newDate
    }
    const getNextDate = nextDate()


    const isLastPost = () => storeDate === lastPost || isLoadingStore === true ? false : true
    const isFirstPost = () => storeDate === firstPost || isLoadingStore === true ? false : true
    const isValidDatePrev = () => storeDate === firstPost || isLoadingStore === true || selectedDate === null ? false : true
    const isValidDateNext = () => storeDate === lastPost || isLoadingStore === true || selectedDate === null ? false : true
    const isDifferentPage = () => isLoadingStore === true || pageSelected === "/listPosts" ? false : true




    const isValidDate = () => {
        const inputDate = new Date(calendarDate);
        const lastDate = new Date(lastPost)
        const firstDate = new Date(firstPost)


        if (isNaN(inputDate.getDate()) || isLoadingStore === true || inputDate < firstDate || inputDate > lastDate || calendarDate === selectedDate) {
            return false
        }
        else {
            return true
        }
    }

    return (
        <div className="navbar">
            <ul>
                <li className="menu-item menu-item-text"><p>Set a date to navigate: </p></li>
                <li className="menu-item menu-input">
                    <div className="input-group">
                        <div className="error-message">{`${errorMessage}`}</div>
                        <input onChange={(e) => changeDate(e)} type="date" value={calendarDate}></input>
                    </div>
                </li>
                <li className="menu-item menu-button-go"> {isValidDate() ?
                    (<Link to={`/date/date=${calendarDate}`}>Go</Link>) :
                    (<div className="disabled-button">Go</div>)}
                </li>
                <li className="menu-item menu-button-first"> {isFirstPost() ?
                    (<Link to={`/date/date=${firstPost}`}>First</Link>) :
                    (<div className="disabled-button">First</div>)}
                </li>
                <li className="menu-item menu-button-prev"> {isValidDatePrev() ?
                    (<Link to={`/date/date=${getPrevDate}`}>Prev</Link>) :
                    (<div className="disabled-button">Prev</div>)}

                </li>
                <li className="menu-item menu-button-next"> {isValidDateNext() ?
                    (<Link to={`/date/date=${getNextDate}`}>Next</Link>) :
                    (<div className="disabled-button">Next</div>)}
                </li>
                <li className="menu-item menu-button-last"> {isLastPost() ?
                    (<Link to={`/date/date=${lastPost}`}>Last</Link>) :
                    (<div className="disabled-button">Last</div>)}
                </li>
                <li className="menu-item calendar-button"> {isDifferentPage() ?
                    (<Link to={`/listPosts`}>List posts</Link>) :
                    (<div className="disabled-button">List posts</div>)}
                </li>




            </ul>
        </div>
    )
}