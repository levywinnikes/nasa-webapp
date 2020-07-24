import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Main from './pages/main'




export default function Routes() {


    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Main} exact></Route>
                <Route path="/:date" component={Main} ></Route>

            </Switch>
        </BrowserRouter>
    )

}