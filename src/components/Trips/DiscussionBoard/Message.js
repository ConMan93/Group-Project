import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateDiscussionBoard } from '../../../Redux/reducer';
import Moment from 'react-moment';

class Message extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: this.props.message,
            editing: false,
            author: {}
        }
    }

    componentDidMount() {
        axios.get(`/trip/discussionauthor/${this.props.user_id}`).then( response => {
            this.setState({
                author: response.data
            })
        })
    }

    handleEditClick = () => {
        this.setState({
            editing: !this.state.editing
        })
    }

    handleChange = e => {
        let { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    udpateMessage = () => {
        axios.put(`/trip/discussion/${this.props.id}`, this.state).then( response => {
            this.setState({
                editing: false
            })
        })
    }

    deleteMessage = () => {
        axios.delete(`/trip/discussion/${this.props.id}/${this.props.trip_id}`).then( response => {
            this.props.updateDiscussionBoard(response.data)
        })
    }

  render() {
      const dateToFormat = this.props.date
    return (
      <div className='trip-discussion-message'>
        <div className='message-content'>
            {this.state.editing ?
            <textarea value={this.state.message} name='message' onChange={this.handleChange} />
            :
            <p>{this.state.message}</p>}

            <div className='message-info'>
                <h2>{this.state.author.username}</h2>
                <div><Moment date={dateToFormat} format='ddd MMM DD, hh:mm A' /></div>
            </div>
        </div>

        <div className='message-buttons'>
            {this.state.author.id === this.props.user.id ?  
            this.state.editing ?
            <button onClick={this.udpateMessage}><i className='fas fa-2x fa-check'></i></button>
            :
            <button onClick={this.handleEditClick}><i className='fas fa-2x fa-edit'></i></button>
            :
            null}
            {this.state.author.id === this.props.user.id ?
                <button onClick={this.deleteMessage}><i className='fas fa-2x fa-trash-alt'></i></button>
                :
                null
            }
        </div>  
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, { updateDiscussionBoard })(Message)