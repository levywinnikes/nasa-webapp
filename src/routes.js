import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import NasaPhoto from './pages/photo'
import ListPosts from './pages/listPosts'
import Album from './pages/album'
import NavBar from './components/navbar'
import Footer from './components/footer'


export default function Routes() {


    return (
        <BrowserRouter>
            <NavBar/>
            <Switch>
                <Route path="/" component={NasaPhoto} exact></Route>
                <Route path="/date/:date" component={NasaPhoto} ></Route>
                <Route path = "/listPosts" component={ListPosts} ></Route>
                <Route path = "/album" component={Album}></Route>
            </Switch>
            <Footer/>
        </BrowserRouter>
    )

}