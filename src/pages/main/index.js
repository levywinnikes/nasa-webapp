import React, { useEffect, useState } from 'react'
import ApiNasa from "../../services/nasa-api"
import { useSelector, useDispatch } from 'react-redux'
import { InfoSquare } from '@styled-icons/boxicons-regular/InfoSquare'
import { PersonOutline } from '@styled-icons/evaicons-outline/PersonOutline'
import { Slideshow } from '@styled-icons/boxicons-regular/Slideshow'
import { Link } from 'react-router-dom'
import './style.css'

export default function MainNasa(props) {
    const dispatch = useDispatch()
    const apiKey = useSelector(state => state.apiKey)
    const lastPost = useSelector(state => state.lastPost)
    const firstPost = useSelector(state => state.firstPost)
    const isLoading = useSelector(state => state.isLoading)
    const [status, setStatus] = useState("Loading...")
    const [showExplanation, setShowExplanation] = useState(false)
    const [showAbout, setShowAbout] = useState(false)
    const [album, setAlbum] = useState([{}])
    const [firstDate, setFirstDate] = useState(null)
    const [lastDate, setLastDate] = useState(null)
    const [inputDate, setInputDate] = useState("")
    const [showInput, setShowInput] = useState(false)



    useEffect(() => {
        setLastDate(lastPost.slice(5))
        setFirstDate(daysAgo(lastPost, 10))

        console.log(lastPost.slice(5) +  "1")
        console.log(daysAgo(lastPost,10) + "2")

    }, [])

    useEffect(() => {
        if (props.match.params.date !== undefined) {
            setAlbum([{}])

            setLastDate(props.match.params.date)
            setFirstDate(daysAgo(props.match.params.date, 9))

        }
    }, [props.match.params.date])


    useEffect(() => {

        if (firstDate !== null && lastDate !== null) {
            var validFirstDate = new Date(firstDate)
            var validLastDate = new Date(lastDate)
            var validFirstPost = new Date(firstPost.slice(5))
            var validLastPost = new Date(lastPost.slice(5))

            if (validFirstDate < validFirstPost) {
                setFirstDate(firstPost.slice(5))
            }
            else if (validLastDate < validFirstPost) {
                setLastDate(firstPost.slice(5))
            }
            else if (validFirstDate > validLastPost) {
                setFirstDate(lastPost.slice(5))

            }
            else if (validLastDate > validLastPost) {
                setLastDate(lastPost.slice(5))
                setFirstDate(daysAgo(lastPost.slice(5), 10))

            }
            else {
                loadEntity()

            }

        }
    }, [firstDate, lastDate])







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

                if (album.length <= 1) {
                    const data = response.data.reverse()
                    setAlbum(data)
                }
                else {
                    const data = response.data.reverse()
                    setAlbum(album.concat(data))
                }
            })
            .catch((error) => {
                setStatus(error.response.statusText)
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



        hiddenInputDate()
        const lastPage = document.querySelector(".carousel").scrollWidth
        const page = document.querySelector(".carousel").scrollLeft

        const firstStoreDate = new Date(firstPost.slice(5))
        const lastStoreDate = new Date(lastPost.slice(5))
        const firstQueryDate = new Date(firstDate)
        const lastQueryDate = new Date(lastDate)



        if (((page * 1.20) > lastPage) && isLoading === false && lastQueryDate > firstStoreDate) {

            console.log("Final da pagina")


            //Se a API da nasa receber uma data abaixo a do seu primeiro post ocorrerá um erro na API
            console.log(`A data ${firstDate} é menor que ${firstPost.slice(5)}`)
            if (firstQueryDate < firstStoreDate) {
                setFirstDate(firstPost.slice(5))

                console.log(firstDate)
            }
            else {
                calculatePrevPages()

            }

        }
    }


    function calculatePrevPages() {
        const morePostNumber = 10;

        setLastDate(daysAgo(lastDate, morePostNumber))
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

    function showInputDate() {
        setShowInput(true)
    }

    function hiddenInputDate() {
        setShowInput(false)
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

    function handlerInputDate(event) {
        setInputDate(event.target.value)
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

                    <div className="footer" onMouseOver={() => hiddenInputDate()}>

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
                            <h3>{status}</h3>
                        </div>
                    ) : (<></>)}



                    {album.sort().map((photo, index) => (
                        <div key={index} className="post">
                            <div className="title">
                                <h1>{photo.title}</h1>
                            </div>

                            <div className="date" onMouseOver={() => showInputDate()} >
                                {showInput ? (
                                    <>
                                        <div className="input-date"  >
                                            <input type="date" value={inputDate} onChange={(e) => handlerInputDate(e)}></input>
                                            <Link to={`${inputDate}`}>Go</Link>
                                        </div>
                                    </>
                                ) : (
                                        <p>{photo.date}</p>
                                    )}
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
                                            onTouchMove={() => isLastPage()}
                                            onMouseMove={() => isLastPage()}
                                        />
                                    </div>
                                )}

                        </div>


                    ))}

                </div>
            </div>
        </>
    );
}
