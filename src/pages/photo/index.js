import React, { useEffect, useState } from 'react'
import ApiNasa from "../../services/nasa-api"
import { useSelector, useDispatch } from 'react-redux'


export default function NasaPhoto(props) {
    const dispatch = useDispatch()
    const [nasaPhoto, setNasaPhoto] = useState(null)
    const isLoading = useSelector(state => state.isLoading)
    const apiKey = useSelector(state => state.apiKey)
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




    if (!nasaPhoto && isLoading === false)
        return (
            <div className="content">
                <div className="error-message">
                    <h1>
                        {errorMessage}
                    </h1>
                </div>
            </div>
        )

    else

        return (
            <>
                <div className="content">
                    <h1 className="title">{isLoading === false ? (nasaPhoto.title) : (<> Loading...</>)}</h1>

                    <div className="date-panel">

                        <div className="selected-date">
                            <p>{props.match.params.date  ? (props.match.params.date.slice(5))  : (isLoading === false ? (nasaPhoto.date) : (<> Loading </>) )}</p>

                        </div>

                    </div>

                    {isLoading === false ? (nasaPhoto.media_type === 'image' ? (
                        <>
                            <img className="media" src={nasaPhoto.url} alt={nasaPhoto.title}></img>
                            <p className="photo-explanation">{nasaPhoto.explanation}</p>
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

