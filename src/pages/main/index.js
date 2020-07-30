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
    const [firstDate, setFirstDate] = useState()
    const [lastDate, setLastDate] = useState()
    const [entityLoad, setEntityLoad] = useState("")
    const [inputDate, setInputDate] = useState("")
    const [showInput, setShowInput] = useState(false)
    const [firstRefresh, setFirstRefresh] = useState(true)





    useEffect(() => {
        console.log(props.match.params.date)

        if (props.match.params.date === undefined) {
            const dateAgo = daysAgo(lastPost.slice(5), 10)
            const today = lastPost.slice(5)
            setLastDate(today)
            setFirstDate(dateAgo)
            setEntityLoad(entityLoad + 1)
        }

        else {
            const propDate = props.match.params.date
            const dateAgo = daysAgo(propDate, 10)
            const today = propDate
            setLastDate(today)
            setFirstDate(dateAgo)

            validateQueryDate()

            console.log(firstDate)

            setEntityLoad(entityLoad + 1)
        }

    }, [lastPost])


    useEffect(() => {
        loadEntity()

    }, [entityLoad])

    useEffect(() => {
        if (props.match.params.date !== undefined) {
            setFirstRefresh(true)
            validateQueryDate()


            const propDate = props.match.params.date
            const dateAgo = daysAgo(propDate, 10)
            const today = propDate



            setLastDate(today)

            setFirstDate(dateAgo)
            setEntityLoad(entityLoad + 1)

        }
    }, [props.match.params.date])




    function daysAgo(day, days) {
        var lastDayToDate = new Date(day)
        var newDate = null
        lastDayToDate.setDate(lastDayToDate.getDate() - days)
        

        newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(lastDayToDate))



        return newDate

    }

    async function validateQueryDate() {
        const firstStoreDate = new Date(firstPost.slice(5))
        const lastStoreDate = new Date(lastPost.slice(5))
        const firstQueryDate = new Date(firstDate)
        const lastQueryDate = new Date(lastDate)

        if (firstQueryDate < firstStoreDate) {
             setFirstDate(await firstPost.slice(5))

        }
    }

    async function loadEntity() {
        dispatch({ type: 'SET_LOADING', isLoading: true })
        await ApiNasa.get(`planetary/apod?api_key=${apiKey}&start_date=${firstDate}&end_date=${lastDate}`)
            .then((response) => {
                const data = response.data.reverse()
                setAlbum(data)
                calculatePrevPages()

            })
            .catch((error) => {
                setStatus(error.response.statusText)
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
            .catch((error) => {
                console.warn(error.response.code)
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






        //lastQueryDate > firstStoreDate


        if ((page * 1.20) > lastPage && isLoading === false && lastQueryDate > firstStoreDate) {

            //Se a API da nasa receber uma data abaixo a do seu primeiro post ocorrerá um erro na API
            console.log(`A data ${firstDate} é menor que ${firstPost.slice(5)}`)
            if (firstQueryDate < firstStoreDate) {
                setFirstDate(firstPost.slice(5))

                console.log(firstDate)
            }
            else {
                calculatePrevPages()

            }


            loadPrevPages()
        }
    }

    function calculatePrevPages() {
        const morePostNumber = 10;


        if (firstRefresh === true) {
            setLastDate(daysAgo(lastDate, morePostNumber + 1))
            setFirstDate(daysAgo(firstDate, morePostNumber))
            setFirstRefresh(false)
        }
        else {
            setLastDate(daysAgo(lastDate, morePostNumber))
            setFirstDate(daysAgo(firstDate, morePostNumber))
        }
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



                    {album.sort().map(photo => (
                        <>
                            <div className="post">
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


                        </>
                    ))}

                </div>
            </div>
        </>
    );
}
