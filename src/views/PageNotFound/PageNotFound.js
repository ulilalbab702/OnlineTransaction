import { MENU } from 'constants/menu'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './PageNotFound.scss'

export default class PageNotFound extends Component {
    render() {
        return (
            <div className='page-not-found-container'>
            <p className="wrong-url">404 PAGE NOT FOUND</p>
            <Link to={MENU.HOME}>Go Home</Link>
            </div>
        )
    }
}
