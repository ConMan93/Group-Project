import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {setFriends, displayUsers, viewProfile} from '../../Redux/reducer';
import {Link} from 'react-router-dom';
import Friends from './Friends';


class Dashboard extends Component{
    constructor(){
        super()
        this.state= {
            filterFriends: "",
            adventures: []
        }
    }
    componentDidMount(){  
            axios.get('/friends/get').then(results => {
                this.props.setFriends(results.data)
            })
            axios.get(`/friends/users`).then(results => {
                this.props.displayUsers(results.data)
            }) 
        
    }

    handleAddFriend(friend_id){
        axios.post('/friends/add', {friend_id} ).then(results => {
            this.props.setFriends(results.data)
            
        })
        axios.get(`/friends/users`).then(results => {
            this.props.displayUsers(results.data)
        }) 
    }
    handleSearchFriends(filter){
        this.setState({filterFriends:filter})
    }


    render(){
        let {allUsers} = this.props
        let eachUser = allUsers.filter(user => {
           return user.username.toLowerCase().includes(this.state.filterFriends)
        }).map((user, i) => {
            return <div key={i}>
                <Link to={`/profile/${user.id}`}><img src={user.profile_img}        alt="profile_pic"/>{user.username}</Link>
                <button onClick={()=>this.handleAddFriend(user.id)}>Add Friend</button>
            </div>
        })
        let {username, venmo, profile_img} = this.props.user
        return(
            <div>
                <Link to="/login">Login</Link>
                <br/>
               {username}
               {venmo}
               {profile_img}
                <span>
                    <input onChange={(e) => this.handleSearchFriends(e.target.value)} type="text" placeholder="search for friends"></input>
                    {eachUser}
                </span>
                <div>
                    My friends
                    <Friends/>
                </div>
                <div>
                    trips
                </div>
            </div>
        )
    }
}
function MapStateToProps(state){
    let {user, allUsers, friends, viewedProfile} = state
    return {user, allUsers, friends, viewedProfile}
}
export default connect(MapStateToProps, {setFriends, displayUsers, viewProfile})(Dashboard)
