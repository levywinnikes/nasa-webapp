import React, { useEffect, useState, useLayoutEffect } from 'react'
import ApiNasa from "../../services/nasa-api"
import { useSelector, useDispatch } from 'react-redux'
import { InfoSquare } from '@styled-icons/boxicons-regular/InfoSquare'
import { PersonOutline } from '@styled-icons/evaicons-outline/PersonOutline'
import { Slideshow } from '@styled-icons/boxicons-regular/Slideshow'
import './style.css'

export default function MainNasa(props) {
    const dispatch = useDispatch()
    const apiKey = useSelector(state => state.apiKey)
    const lastPost = useSelector(state => state.lastPost)
    const isLoading = useSelector(state => state.isLoading)
    const [showExplanation, setShowExplanation] = useState(false)
    const [showAbout, setShowAbout] = useState(false)
    const [album, setAlbum] = useState([{}])
    const [firstDate, setFirstDate] = useState()
    const [lastDate, setLastDate] = useState()
    const [entityLoad, setEntityLoad] = useState(false)





    useEffect(() => {

        const today = lastPost.slice(5)
        const dateAgo = daysAgo(lastPost.slice(5), 10)
        setLastDate(today)
        setFirstDate(dateAgo)
        setEntityLoad(true)

    }, [lastPost])


    useEffect(() => {
        loadEntity()

    }, [entityLoad])




    function daysAgo(day, days) {
        var lastDayToDate = new Date(day)
        var newDate = null
        lastDayToDate.setDate(lastDayToDate.getDate() - days)
        newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(lastDayToDate))

        return newDate

    }

    async function loadEntity() {
        dispatch({ type: 'SET_LOADING', isLoading: true })
        await ApiNasa.get(`planetary/apod?api_key=${apiKey}&start_date=${firstDate}&end_date=${lastDate}`)
            .then((response) => {
                const data = response.data.reverse()
                setAlbum(data)
                calculatePrevPages()

            })
        dispatch({ type: 'SET_LOADING', isLoading: false })

    }

    async function loadPrevPages() {
        dispatch({ type: 'SET_LOADING', isLoading: true })
        await ApiNasa.get(`planetary/apod?api_key=${apiKey}&start_date=${firstDate}&end_date=${lastDate}`)
            .then((response) => {
                const data = response.data.reverse()
                setAlbum(album.concat(data))



            })
        dispatch({ type: 'SET_LOADING', isLoading: false })

    }



    async function changeDate() {

        dispatch({ type: 'SET_LOADING', isLoading: true })
        await ApiNasa.get(`planetary/apod?api_key=${apiKey}&start_date=2020-06-22&end_${lastPost}`)
            .then((response) => {
                const data = response.data
                setAlbum(data)
                console.log(data)


            })
        dispatch({ type: 'SET_LOADING', isLoading: false })
    }


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

    function isLastPage() {
        const lastPage = document.querySelector(".carousel").scrollWidth
        const page = document.querySelector(".carousel").scrollLeft

        if ((page * 1.20) > lastPage && isLoading === false) {

            calculatePrevPages()
            loadPrevPages()
        }
    }

    function calculatePrevPages() {
        const morePostNumber = 10;

        setLastDate(daysAgo(lastDate, morePostNumber + 1))
        setFirstDate(daysAgo(firstDate, morePostNumber))


    }

    function nextSlide() {
        const nextSlide = document.querySelector(".carousel")
        nextSlide.scrollBy(300, 0)



        transition()
        isLastPage()
    }

    function prevSlide() {
        const prevSlide = document.querySelector(".carousel")
        prevSlide.scrollBy(-300, 0)

        transition()
        isLastPage()

    }

    function transition() {

        var title = document.querySelectorAll(".title")
        var date = document.querySelectorAll(".date")


        for (var i = 0; i < title.length; i++) {
            title[i].classList.toggle("hide")
            date[i].classList.toggle("hide")

        }

        setTimeout(() => {
            for (var i = 0; i < title.length; i++) {
                title[i].classList.toggle("hide")
                date[i].classList.toggle("hide")

            }

        }, 500)

    }


    return (
        <>

            <div className="content">
                <div id="caro" className="carousel" >
                    <div className="header"></div>

                    <div className="arrow-photo arrow-photo-next" onClick={() => nextSlide()}>
                        <div className="draw-line-photo rotate-next-line-1"></div>
                        <div className="draw-line-photo rotate-next-line-2"></div>
                    </div>

                    <div className="arrow-photo arrow-photo-prev" onClick={() => prevSlide()}>
                        <div className="draw-line-photo rotate-prev-line-1"></div>
                        <div className="draw-line-photo rotate-prev-line-2"></div>
                    </div>

                    <div className="footer">

                        <div className="both-panel">

                            <div className="button-show button-show-about" onMouseOver={() => toggleAboutOn()}>
                                <PersonOutline />

                            </div>
                            <div className="button-show" >
                                <Slideshow />
                            </div>
                            <div className="button-show button-show-explanation" onMouseOver={() => toggleExplanationOn()}>
                                <InfoSquare />
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="loading">
                            <h3>Loading...</h3>
                        </div>
                    ) : (<></>)}



                    {album.sort().map(photo => (
                        <>
                            <div className="post">
                                <div className="title">
                                    <h1>{photo.title}</h1>
                                </div>

                                <div className="date">
                                    <p>{photo.date}</p>
                                </div>

                                {showExplanation ? (
                                    <div className="explanation" onMouseOut={() => toggleExplanationOff()} >
                                        <h3>{photo.title}</h3>
                                        <p>{photo.explanation}</p>
                                    </div>) : (<> </>)}


                                {showAbout ? (
                                    <div className="about" onMouseOut={() => toggleAboutOff()} >
                                        <p>Created by: André Levy S. Winnikes</p>
                                    </div>
                                ) : (<> </>)}


                                {photo.media_type === "image" ? (
                                    <img
                                        src={photo.url}
                                        onMouseMove={() => isLastPage()}
                                        onTouchMove={() => isLastPage()}
                                    ></img>
                                ) : (
                                        <div className="video">
                                            <iframe
                                                src={photo.url}
                                                title="nasa-video"
                                                gesture="media"
                                                allowFullScreen
                                                className="video"
                                            />
                                        </div>
                                    )}

                            </div>


                        </>
                    ))}

                </div>
            </div>
        </>
    );
}
