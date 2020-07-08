import React, { useEffect, useState } from 'react'
import ApiNasa from "../../services/nasa-api"
import { useSelector, useDispatch } from 'react-redux'


export default function NasaPhoto(props) {
    const dispatch = useDispatch()
    const [nasaPhoto, setNasaPhoto] = useState({})
    const isLoading = useSelector(state => state.isLoading)
    const apiKey = useSelector(state => state.apiKey)




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
                dispatch({ type: 'SET_DATE', date: data.date })
            })
            .catch((error) => {
                console.warn(error)
            })

        dispatch({ type: 'SET_LOADING', isLoading: false })

    }




    if (!nasaPhoto) return <div />

    if (isLoading) return (<div className="loading-page"><h1>Loading...</h1></div>)

    else

        return (
            <>
                <div className="content">
                    <h1 className="title">{nasaPhoto.title}</h1>

                    <div className="date-panel">

                        <div className="selected-date">
                            <p>{nasaPhoto.date}</p>
                        </div>

                    </div>

                    {nasaPhoto.media_type === 'image' ? (
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

                        )}


                </div>
            </>
        );
}

