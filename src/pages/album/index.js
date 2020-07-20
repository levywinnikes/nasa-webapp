import React, { useEffect, useState } from 'react'
import ApiNasa from "../../services/nasa-api"
import { useSelector, useDispatch } from 'react-redux'
import './style.css'

export default function Main() {
    const dispatch = useDispatch()
    const apiKey = useSelector(state => state.apiKey)
    const lastDate = useSelector(state => state.lastPost)
    const [album, setAlbum] = useState([{}])


    useEffect(() => {
        loadEntity()
    }, [])



    async function loadEntity() {
        console.log("cheguei aqui")
        dispatch({ type: 'SET_LOADING', isLoading: true })
        await ApiNasa.get(`planetary/apod?api_key=${apiKey}&start_date=2020-06-22&end_${lastDate}`)
            .then((response) => {
                const data = response.data
                setAlbum(data)

                console.log(data)

            })
        dispatch({ type: 'SET_LOADING', isLoading: false })
    }

    function nextSlide() {
        const nextSlide = document.querySelector(".photos-nasa")
        nextSlide.scrollBy(600, 0)


    }

    function prevSlide() {
        const prevSlide = document.querySelector(".photos-nasa")
        prevSlide.scrollBy(-300, 0)
    }

    function fullScreen() {
        const fullScreen = document.querySelector(".photos-nasa")
        fullScreen.requestFullscreen();

    }

    return (
        <>
            <div className="album">
                <div className="photos-nasa">

                    {album?.map((photo) => (
                        <>
                            <div className="photo-album">
                                <img src={photo.url}></img>
                                <div className="album-content">
                                    <div className="album-content-title">
                                        <h1>{photo.title}</h1>
                                    </div>
                                    <div className="album-content-explanation">
                                        <p>{photo.explanation}</p>
                                    </div>

                                </div>
                            </div>

                        </>
                    ))}

                    <div className="album-control">
                        <div className="album-button-next">
                            <a href="#" onClick={() => nextSlide()}>{">"}</a>
                        </div>
                        <div className="album-button-prev">
                            <a href="#" onClick={() => prevSlide()}>{"<"}</a>
                        </div>



                    </div>


                </div>
            </div>
        </>
    )

}