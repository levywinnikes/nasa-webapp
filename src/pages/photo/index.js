import React, { useEffect, useState } from 'react'
import ApiNasa from "../../services/nasa-api"
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import './style.css'


export default function NasaPhoto(props) {
    const dispatch = useDispatch()
    const [nasaPhoto, setNasaPhoto] = useState(null)
    const storeDate = useSelector(state => state.date)
    const selectedDate = useSelector(state => state.date)
    const firstPost = useSelector(state => state.firstPost)
    const isLoading = useSelector(state => state.isLoading)
    const apiKey = useSelector(state => state.apiKey)
    const isLoadingStore = useSelector(state => state.isLoading)
    const lastPost = useSelector(state => state.lastPost)
    const [errorMessage, setErrorMessage] = useState("")


    useEffect(() => {
        if (!props.match.params.date) {
            console.log("loadEntity")
            loadEntity()
        }
        else {
            changeDate()
        }

    }, [])


    useEffect(() => {
        changeDate()
    }, [props.match.params.date])



    //  useEffect(() => !props.match.params.date ? loadEntity(): changeDate(), [])
    //  useEffect(() =>  {changeDate()}, [props.match.params.date])

    async function loadEntity() {
        dispatch({ type: 'SET_LOADING', isLoading: true })


        await ApiNasa.get(`planetary/apod?api_key=${apiKey}`)
            .then((response) => {
                const data = response.data
                dispatch({ type: 'SET_DATE', date: data.date })
                setNasaPhoto(data)

            })
        dispatch({ type: 'SET_LOADING', isLoading: false })


    }

    async function changeDate() {
        const urlParamDate = props.match.params.date

        dispatch({ type: 'SET_LOADING', isLoading: true })
        await ApiNasa.get(`planetary/apod?api_key=${apiKey}&${urlParamDate}`)
            .then((response) => {
                const data = response.data
                setNasaPhoto(data)
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    setNasaPhoto(null)
                    setErrorMessage("Page not found, try next or prev page")
                }
                else {
                    setErrorMessage("Failed to connect to server")
                }

                console.warn(error)

            })

        dispatch({ type: 'SET_DATE', date: urlParamDate })
        dispatch({ type: 'SET_LOADING', isLoading: false })

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


    const isValidDatePrev = () => storeDate === firstPost || isLoadingStore === true || selectedDate === null ? false : true
    const isValidDateNext = () => storeDate === lastPost || isLoadingStore === true || selectedDate === null ? false : true
    const isLastPost = () => storeDate === lastPost || isLoadingStore === true ? false : true
    const isFirstPost = () => storeDate === firstPost || isLoadingStore === true ? false : true


    function DatePanel() {
        return (
            <>
                {
                    isValidDatePrev() ? (
                        <Link className="arrow-photo arrow-date" to={`/date/date=${getPrevDate}`}>
                            <div className="draw-line-date rotate-prev-line-1"></div>
                            <div className="draw-line-date rotate-prev-line-2"></div>
                        </Link>
                    ) : (
                            <div className="arrow-photo-disabled arrow-date">
                                <div className="draw-line-date rotate-prev-line-1"></div>
                                <div className="draw-line-date rotate-prev-line-2"></div>
                            </div>
                        )
                }

                <div className="selected-date">
                    <p>{props.match.params.date ? (props.match.params.date.slice(5)) : (isLoading === false ? (<>Invalid date</>) : (<> Loading </>))}</p>
                </div>



                {
                    isValidDateNext() ? (
                        <Link className="arrow-photo arrow-date" to={`/date/date=${getNextDate}`}>
                            <div className="draw-line-date rotate-next-line-1"></div>
                            <div className="draw-line-date rotate-next-line-2"></div>
                        </Link>
                    ) : (

                            <div className="arrow-photo-disabled arrow-date">
                                <div className="draw-line-date rotate-next-line-1"></div>
                                <div className="draw-line-date rotate-next-line-2"></div>
                            </div>

                        )
                }
            </>)

    }


    if (!nasaPhoto && isLoading === false)
        return (
            <div className="content">
                <div className="title">{errorMessage}</div>
                <div className="date-panel">
                    <DatePanel />
                </div>

            </div>
        )

    else

        return (
            <>
                <div className="content">
                    <h1 className="title">{isLoading === false ? (nasaPhoto.title) : (<> Loading...</>)}</h1>
                    <div className="date-panel">
                        <DatePanel />
                    </div>

                    {isLoading === false ? (nasaPhoto.media_type === 'image' ? (
                        <>
                            <div className="photo-content">
                                <div className="media">

                                    {isValidDatePrev() ? (


                                        <Link className="arrow-photo arrow-photo-prev" to={`/date/date=${getPrevDate}`} >
                                            <div className="draw-line-photo rotate-prev-line-1"></div>
                                            <div className="draw-line-photo rotate-prev-line-2"></div>
                                        </Link>
                                    ) : (<></>)}

                                    <img src={nasaPhoto.url} alt={nasaPhoto.title}></img>

                                    {isValidDateNext() ? (
                                        <Link className="arrow-photo arrow-photo-next" to={`/date/date=${getNextDate}`}>
                                            <div className="draw-line-photo rotate-next-line-1"></div>
                                            <div className="draw-line-photo rotate-next-line-2"></div>
                                        </Link>
                                    ) : (<></>)}

                                </div>
                                <div className="photo-explanation">
                                    <p>{nasaPhoto.explanation}</p>

                                </div>
                            </div>
                        </>


                    ) : (
                            <>

                                <iframe
                                    src={nasaPhoto.url}
                                    title="nasa-video"
                                    gesture="media"
                                    allowFullScreen
                                    className="video"
                                />
                                <p className="video-explanation">{nasaPhoto.explanation}</p>
                            </>

                        )) : (<></>)}


                </div>
            </>
        );
}

