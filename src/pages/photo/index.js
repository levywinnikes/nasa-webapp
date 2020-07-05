import React, { useEffect, useState } from 'react'
import ApiNasa from "../../services/nasa-api"
import { useSelector, useDispatch } from 'react-redux'


export default function NasaPhoto(props) {
    const dispatch = useDispatch()
    const apiKey = "caAtJWtk07G83BJP6T5w5zwWVURksPCbs468353t"
    const [nasaPhoto, setNasaPhoto] = useState({})
    const date = useSelector(state => state.date)
    const isLoading = useSelector(state => state.isLoading)
    const lastPost = useSelector(state => state.lastPost)



    useEffect(() => {
        if (!props.match.params.date) {
            loadEntity()

        }
        else {
            urlChangeDate()
        }

    }, [])

    useEffect(() => {
        changeDate()

    }, [date])

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
        dispatch({ type: 'SET_LOADING', isLoading: true })
        await ApiNasa.get(`planetary/apod?api_key=${apiKey}&date=${date}`)
            .then((response) => {
                const data = response.data
                setNasaPhoto(data)
                dispatch({ type: 'SET_DATE', date: data.date })
            })
            .catch((error) => {
                dispatch({ type: 'SET_DATE', date: lastPost })
            })

        dispatch({ type: 'SET_LOADING', isLoading: false })

    }

    async function urlChangeDate() {
        const urlParamDate = props.match.params.date.slice(5)
        dispatch({ type: 'SET_DATE', date: urlParamDate })
    }




    if (!nasaPhoto) return <div />

    if (isLoading) return (<h1>Loading...</h1>)

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
                        <img className="media" src={nasaPhoto.hdurl} alt={nasaPhoto.title}></img>

                    ) : (
                            <iframe
                                src={nasaPhoto.url}
                                title="nasa-video"
                                gesture="media"
                                allowFullScreen
                                className="media"
                            />

                        )}


                    <p className="explanation">{nasaPhoto.explanation}</p>
                </div>
            </>
        );
}

