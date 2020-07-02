import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar() {


    return (
        <div className="navbar">

            <Link to="/">Prev </Link>
            <Link to="/">Today</Link>
            <Link to="/">Next </Link>

        </div>
    )
}