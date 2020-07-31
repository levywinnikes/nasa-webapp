import React, { useEffect, useState } from 'react'
import ApiNasa from "../../services/nasa-api"
import { useSelector, useDispatch } from 'react-redux'
import { InfoSquare } from '@styled-icons/boxicons-regular/InfoSquare'
import { PersonOutline } from '@styled-icons/evaicons-outline/PersonOutline'
import { Link } from 'react-router-dom'
import './style.css'
import NasaLogo from '../../assets/img/NASA_logo.svg'

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
        splashScreen(false)
        setLastDate(lastPost.slice(5))
        setFirstDate(daysAgo(lastPost.slice(5), 10))

    }, [])

    useEffect(() => {
        if (props.match.params.date !== undefined) {
            setAlbum([{}])
            var getProps = props.match.params.date;

            setLastDate(getProps)
            setFirstDate(daysAgo(getProps, 9))

        }
    }, [props.match.params.date])


    useEffect(() => {

        console.log(lastDate + "Last Date")

        console.log(firstDate + "First Date")



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

        console.log(day + " Data de entrada do days ago")

        var lastDayToDate = new Date(day)



        var newDate = null
        lastDayToDate.setDate(lastDayToDate.getDate() - days)


        newDate = dateToString(lastDayToDate)

        console.log(newDate + " Data de saida do days ago")


        return newDate

    }

    function dateToString(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
                
            if (day.length < 2)
                day = '0' + day;


            return [year, month, day].join('-');
        }


        function daysAfter(day, days) {
            var lastDayToDate = new Date(day)
            var newDate = null
            lastDayToDate.setDate(lastDayToDate.getDate() + days)


            newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(lastDayToDate))



            return newDate

        }




        async function loadEntity() {
            dispatch({ type: 'SET_LOADING', isLoading: true })
            await ApiNasa.get(`planetary/apod?api_key=${apiKey}&start_date=${firstDate}&end_date=${lastDate}`)
                .then((response) => {

                    if (album.length <= 1) {
                        const data = response.data
                        setAlbum(data)
                    }
                    else {
                        const data = response.data
                        setAlbum(album.concat(data))
                    }


                })
                .catch((error) => {
                    setStatus(error.response.statusText)
                })

            dispatch({ type: 'SET_LOADING', isLoading: false })

        }

        function closeAll() {
            toggleAboutOff()
            toggleExplanationOff()
            setShowInput(false)

        }

        function toggleExplanationOn() {
            toggleAboutOff()
            var explanation = document.querySelectorAll(".explanation")

            for (var i = 0; i < explanation.length; i++) {
                explanation[i].classList.remove("hide")
            }
        }

        function toggleExplanationOff() {
            var explanation = document.querySelectorAll(".explanation")

            for (var i = 0; i < explanation.length; i++) {
                explanation[i].classList.add("hide")
            }

        }

        function toggleAboutOn() {
            toggleExplanationOff()

            var about = document.querySelectorAll(".about")

            for (var i = 0; i < about.length; i++) {

                about[i].classList.remove("hide")
            }

        }

        function toggleAboutOff() {
            var about = document.querySelectorAll(".about")


            for (var i = 0; i < about.length; i++) {

                about[i].classList.add("hide")

            }
        }


        function isLastPage() {


            const lastPage = document.querySelector(".carousel").scrollWidth
            const page = document.querySelector(".carousel").scrollLeft
            //const pageScroll = document.querySelector(".carousel")



            const firstStoreDate = new Date(firstPost.slice(5))
            const lastStoreDate = new Date(lastPost.slice(5))
            const firstQueryDate = new Date(firstDate)
            const lastQueryDate = new Date(lastDate)


            if (((page * 1.20) > lastPage) && isLoading === false && lastQueryDate > firstStoreDate) {

                //  calculateNextPages()
                calculatePrevPages()
            }


            if (page === 0 && isLoading === false && firstQueryDate < lastStoreDate) {
                //calculateNextPages()

                //pageScroll.scrollBy(lastPage, 0)

            }

        }




        function calculatePrevPages() {
            const morePostNumber = 10;

            setLastDate(daysAgo(lastDate, morePostNumber))
            setFirstDate(daysAgo(firstDate, morePostNumber))


        }

        function nextSlide() {
            const nextSlide = document.querySelector(".carousel")


            nextSlide.scrollBy(nextSlide.clientWidth, 0)


            transition()
            isLastPage()
        }

        function prevSlide() {
            const prevSlide = document.querySelector(".carousel")
            prevSlide.scrollBy(-prevSlide.clientWidth, 0)


            transition()
            isLastPage()

        }

        function showInputDate() {
            setShowInput(true)
        }


        function splashScreen(active = true) {
            var nasaLogo = document.querySelector(".nasa-logo")

            if (active === true) {

                setTimeout(() => {
                    nasaLogo.classList.toggle("hide")

                    setTimeout(() => {
                        nasaLogo.classList.toggle("hide")
                        nasaLogo.classList.toggle("done")

                    }, 3000)
                }, 3000)
            }
            else {
                nasaLogo.classList.toggle("done")

            }

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


                    <div className="nasa-logo">
                        <div className="nasa-logo-image">
                            <img src={NasaLogo}></img>
                        </div>
                        <div className="nasa-logo-title">
                            <h1>Nasa interactive gallery</h1>
                        </div>
                        <div className="nasa-logo-createdby">
                            <p>by Andre Levy</p>
                        </div>
                    </div>
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

                        <div className="footer" >

                            <div className="both-panel">

                                <div className="button-show button-show-about" onMouseOver={() => toggleAboutOn()}>
                                    <PersonOutline />

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



                        {album.sort((a, b) => (a.date < b.date) ? 1 : -1).map((photo, index) => (
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



                                <div className="explanation hide" >
                                    <h3>{photo.title}</h3>
                                    <p>{photo.explanation}</p>
                                </div>



                                <div className="about hide" >
                                    <p>Created by: André Levy S. Winnikes</p>
                                    <p>Aplication demo using nasa API, react, hooks and redux</p>
                                </div>



                                {photo.media_type === "image" ? (
                                    <img
                                        src={photo.url}
                                        onMouseMove={() => isLastPage()}
                                        onTouchMove={() => isLastPage()}
                                        onMouseOver={() => closeAll()}
                                    ></img>
                                ) : (
                                        <div className="video">
                                            <iframe
                                                src={photo.url}
                                                title="nasa-video"
                                                gesture="autoplay"
                                                allowFullScreen
                                                className="video"
                                                onTouchMove={() => isLastPage()}
                                                onMouseMove={() => isLastPage()}
                                                onMouseOver={() => closeAll()}

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
