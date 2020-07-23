import React, { useEffect, useState } from 'react'
import ApiNasa from "../../services/nasa-api"
import { useSelector, useDispatch } from 'react-redux'
import './style.css'

export default function MainNasa() {
    const dispatch = useDispatch()
    const apiKey = useSelector(state => state.apiKey)
    const lastDate = useSelector(state => state.lastPost)
    const [showExplanation, setShowExplanation] = useState(false)
    const [showAbout, setShowAbout] = useState(false)

    const [album, setAlbum] = useState([{}])


    useEffect(async () => {
        dispatch({ type: 'SET_LOADING', isLoading: true })
        await ApiNasa.get(`planetary/apod?api_key=${apiKey}&start_date=2020-06-22&end_${lastDate}`)
            .then((response) => {
                const data = response.data
                setAlbum(data)
                console.log(data)


            })
        dispatch({ type: 'SET_LOADING', isLoading: false })
    }, [])

    function toggleExplanationOn() {
        setShowExplanation(true)
    }

    function toggleExplanationOff() {
        setShowExplanation(false)
    }

    function toggleAboutOn() {
        setShowAbout(true)
    }

    function toggleAboutOff() {
        setShowAbout(false)

    }


    return (
        <>

            <div className="content">
                <div className="carousel ">

                    {album.map(photo => (
                        <>
                            <div className="post">
                                <div className="header">
                                    <div className="title">
                                        <h1>{photo.title}</h1>
                                    </div>

                                    <div className="date">
                                        <p>{photo.date}</p>
                                    </div>
                                </div>

                                <div className="footer">

                                    {showExplanation ? (
                                        <div className="explanation" onMouseOut={() => toggleExplanationOff()} >
                                            <h3>{photo.title}</h3>
                                            <p>{photo.explanation}</p>
                                        </div>) : (<> </>)}


                                    {showAbout ? (
                                        <div className="about">
                                            <p onMouseOut={() => toggleAboutOff()}>Created by: André Levy S. Winnikes</p>
                                        </div>
                                    ) : (<> </>)}


                                    <div className="both-panel">


                                        <div className="button-show button-show-about" onMouseOver={() => toggleAboutOn()}>
                                            About
                                        </div>
                                        <div className="button-show" >
                                            Show
                                        </div>
                                        <div className="button-show button-show-explanation" onMouseOver={() => toggleExplanationOn()}>
                                            EXP
                                        </div>
                                    </div>
                                </div>

                                <img src={photo.hdurl}></img>
                            </div>


                        </>
                    ))}

                </div>
            </div>
        </>
    );
}
