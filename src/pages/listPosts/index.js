import React, { useState, useEffect } from 'react'
import ApiNasa from "../../services/nasa-api"
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import ReactResizeDetector from 'react-resize-detector'



export default function ListPosts() {
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.isLoading)
    const apiKey = useSelector(state => state.apiKey)
    const lastDate = useSelector(state => state.lastPost)
    const [isMoreContentLoading, setIsMoreContentLoading] = useState(false)
    const [minorDateLastDate, setMinorDateLastDate] = useState()
    const [minorDateFirstDate, setMinorDateFirstDate] = useState()
    const [smallSize, setSmallSize] = useState(false)

    const [monthPost, setMonthPost] = useState([{}])


    useEffect(() => {
        loadEntity()
    }, [])


    async function loadEntity() {
        const firstDate = daysAgo(lastDate, 10);

        setMinorDateLastDate(daysAgo(lastDate, 11))
        setMinorDateFirstDate(daysAgo(lastDate, 21))


        dispatch({ type: 'SET_LOADING', isLoading: true })
        await ApiNasa.get(`planetary/apod?api_key=${apiKey}&start_date=${firstDate}&end_date=${lastDate}`)
            .then((response) => {
                const data = response.data
                setMonthPost(data)


            })
        dispatch({ type: 'SET_LOADING', isLoading: false })
    }


    function daysAgo(day, days) {
        var lastDayToDate = new Date(day)
        var newDate = null
        lastDayToDate.setDate(lastDayToDate.getDate() - days)
        newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(lastDayToDate))

        return newDate

    }

    async function morePosts() {
        const lastDate = minorDateLastDate
        const firstDate = minorDateFirstDate
        setIsMoreContentLoading(true)

        await ApiNasa.get(`planetary/apod?api_key=${apiKey}&start_date=${firstDate}&end_date=${lastDate}`)
            .then((response) => {
                const data = response.data
                setMonthPost(monthPost.concat(data))

                setMinorDateLastDate(daysAgo(minorDateLastDate, 10))
                setMinorDateFirstDate(daysAgo(minorDateFirstDate, 10))

            })
        setIsMoreContentLoading(false)
    }

    function resize() {
        if (window.innerWidth <= 1024) {
            setSmallSize(true)
        }
        else {
            setSmallSize(false)

        }

    }

    if (isLoading) return (<div className="loading-page"><h1>Loading...</h1></div>)

    else

        if (smallSize === false)
            return (
                <>
                    <div className="mini-posts">
                        {monthPost.sort((a, b) => a.date < b.date ? 1 : -1).map(post => (
                            <div key={post.date} className="mini-post">
                                <p className="mini-post-date">{post.date}</p>
                                <h3>{post.title}</h3>

                                {post.media_type === 'image' ? (
                                    <img src={post.url}></img>

                                ) : (
                                        <div className="mini-post-video">
                                            <h3>Video content</h3>

                                            <p>Click in "View" to see the video</p>
                                        </div>
                                    )}



                                <p className="mini-post-explanation">{post.explanation} </p>
                                <Link className="button mini-post-read-more" to={`/date/date=${post.date}`}>View</Link>
                            </div>
                        ))}
                        {isMoreContentLoading === false ? (
                            <button className="button" onClick={() => morePosts()}>More pelase!</button>) :
                            (<button disabled className="button">Loading...</button>)}
                        <ReactResizeDetector handleWidth handleHeight onResize={resize} />

                    </div>
                </>
            )

        else if (smallSize === true)
            return (
                <>
                    <div className="mini-posts-small">

                        {monthPost.sort((a, b) => a.date < b.date ? 1 : -1).map(post => (


                            <div key={post.date} className="mini-post-small">
                                <p className="mini-post-date-small">{post.date}</p>

                                <div className="mini-post-title-small">
                                    <h3>{post.title}</h3>
                                </div>
                                {post.media_type === 'image' ? (
                                    <div className="mini-post-image-small">
                                        <img src={post.url}></img>

                                    </div>

                                ) : (
                                        <div className="mini-post-video-small">
                                            <h3>Video content</h3>

                                            <p>Click in "View" to see the video</p>
                                        </div>
                                    )}
                                <div className = "mini-post-read-more-small">
                                    <Link to={`/date/date=${post.date}`}>View</Link>
                                </div>
                            </div>
                        ))}
                        {isMoreContentLoading === false ? (
                            <button className="button mini-post-more-please" onClick={() => morePosts()}>More pelase!</button>) :
                            (<button disabled className="button mini-post-more-please">Loading...</button>)}
                        <ReactResizeDetector handleWidth handleHeight onResize={resize} />

                    </div>


                </>
            )


}