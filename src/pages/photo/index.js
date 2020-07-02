import React, { useEffect, useState } from 'react'
import ApiNasa from "../../services/nasa-api"

export default function TesteApi() {

    const apiKey = "1TwfM7IWv7Q4TkmKBCgUNmJrVEg8BHi9RKUVwQpe"
    const [nasaPhoto, setNasaPhoto] = useState({})


    useEffect(async () => {
        const response = await ApiNasa.get(`planetary/apod?api_key=${apiKey}`);
        //const response = await ApiNasa.get(`planetary/apod?api_key=${apiKey}&start_date=2017-07-05&end_date=2017-07-10`);
        //https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=2017-07-05&end_date=2017-07-10

        const data = await response.data
        setNasaPhoto(data)



    }, [])

    async function changeDate(newDate) {
        const response = await ApiNasa.get(`planetary/apod?api_key=${apiKey}&date=${newDate}`);
        const data = await response.data

        setNasaPhoto(data)
    }


    async function nextDate() {
        //yyyy-MM-dd
        const tomorrow = new Date(nasaPhoto.date);
        var newDate = null
        tomorrow.setDate(tomorrow.getDate() + 2)
        newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(tomorrow))
        console.log(newDate)
        const response = await ApiNasa.get(`planetary/apod?api_key=${apiKey}&date=${newDate}`);
        const data = await response.data
        setNasaPhoto(data)

    }


    async function prevDate() {
        //yyyy-MM-dd
        const yesterday = new Date(nasaPhoto.date);
        var newDate = null
        newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(yesterday))
        const response = await ApiNasa.get(`planetary/apod?api_key=${apiKey}&date=${newDate}`);
        const data = await response.data
        setNasaPhoto(data)
    }

    async function setDate(date) {
        //yyyy-MM-dd
        const tomorrow = new Date(nasaPhoto.date);
        var newDate = null
        tomorrow.setDate(tomorrow.getDate() - 1)
        newDate = new Intl.DateTimeFormat('fr-CA').format(Date.parse(tomorrow))
        const response = await ApiNasa.get(`planetary/apod?api_key=${apiKey}&date=${newDate}`);
        const data = await response.data
        setNasaPhoto(data)
    }




    return (
        <>
            <div className="content">
                <h1 className="title">{nasaPhoto.title}</h1>

                <div className="date-panel">
                    <div className="prev-date">
                        <a href="#" onClick={() => prevDate()}>
                            Previous
                        </a>
                    </div>


                    <div className="selected-date">
                        <p>{nasaPhoto.date}</p>
                    </div>

                    <div className="next-date">
                        <a href="#" onClick={() => nextDate()}>
                            Next
                        </a>
                    </div>
                </div>

                {nasaPhoto.media_type === 'image' ? (
                    <img className="media" src={nasaPhoto.hdurl} alt="Bright Planetary Nebula NGC 7027 from Hubble"></img>

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

