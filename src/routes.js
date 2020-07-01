import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import NasaPhoto from './pages/photo'
import NavBar from './components/navbar'


export default function Routes() {


    return (
        <BrowserRouter>
            <NavBar/>
            <Switch>
                <Route path="/" component={NasaPhoto} exact></Route>
            </Switch>
        </BrowserRouter>
    )

}