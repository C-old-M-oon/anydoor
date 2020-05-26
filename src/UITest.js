// 使用jest，使用手册查看官方文档

import React, { Component } from 'react'

class Demo extends Component {
    static defaultProps = {
        title: 'this is a demo',
        value: 0
    }
    constructor(props) {
        super(props)
        this.state = {
            title,
            value
        }
    }
    add = () => {
        this.setState({
            value: this.state.value ++
        })
    }
    change = (ev) => {
        this.setState({
            value: ev.target.value
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            title: nextProps.title
        })
    }

    render() {
        return (
            <div className="container">
                <h1>{this.state.title}</h1>
                <div className="counter">{this.state.value}</div>
                <input type="text" value={this.state.value} onChange={this.change}/>
                <button onClick={this.add}>value+</button>
            </div>
        )
    }
}