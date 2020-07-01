import React, { useEffect, useState } from 'react'
import ApiNasa from "../../services/nasa-api"

export default function TesteApi() {

    const apiKey = "1TwfM7IWv7Q4TkmKBCgUNmJrVEg8BHi9RKUVwQpe"
    const [nasaPhoto, setNasaPhoto] = useState({})


    useEffect(async () => {
        const response = await ApiNasa.get(`planetary/apod?api_key=${apiKey}`);
        const data = await response.data
        setNasaPhoto(data)

        console.log(data)


    }, [])



    return (
        <>
            <div className="photo">
                <h1 className="title">{nasaPhoto.title}</h1>
                <p className="date">{nasaPhoto.date}</p>

                {nasaPhoto.media_type === 'image' ? (
                    <img className = "media" src={nasaPhoto.hdurl} alt="Bright Planetary Nebula NGC 7027 from Hubble"></img>

                ) : (
                    <iframe
                        src = {nasaPhoto.url}
                        title = "nasa-video"
                        gesture = "media"
                        allowFullScreen
                        className = "media"
                    />

                )}


                <p className="explanation">{nasaPhoto.explanation}</p>
            </div>
        </>
    );
}

