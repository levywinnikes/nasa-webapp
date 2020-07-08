import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import NasaPhoto from './pages/photo'
import ListPosts from './pages/listPosts'
import NavBar from './components/navbar'
import Footer from './components/footer'


export default function Routes() {


    return (
        <BrowserRouter>
            <NavBar/>
            <Switch>
                <Route path="/" component={NasaPhoto} exact></Route>
                <Route path="/date/:date" component={NasaPhoto}></Route>
                <Route parh = "/listPosts" component={ListPosts}></Route>
            </Switch>
            <Footer/>
        </BrowserRouter>
    )

}