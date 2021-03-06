import React, {Component} from 'react';
import { Icon, Header, Button, Image } from 'semantic-ui-react'
import { getUserData, getCurrentUserData } from '../API/GET/GetMethods';
import { sendFriendshipRequest, deleteProfilePicture, deleteFriend, deleteFriendshipRequest, deleteMyFriendshipRequest } from '../API/POST/PostMethods';
import '../profileStyle.css';

class ProfileHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
          show: false,
          redirectToLogin: false,
          userId: "",
          id: "",
          username: "",
          firstname: "",
          lastname: "",
          email: "",
          picture: "",
          pictureURL: "",
          pictureExists: false,
          buttonState: "Loading"
        }
    }

    componentDidMount() {
        this.getCurrentUser(this.props.name);
    }

    async getCurrentUser(username) {

        if(username === undefined) {
            const response = await getUserData("/getUserData");
            this.setState({userId: response.userId})
            this.setState({username: response.username})
            this.setState({firstname: response.firstname})
            this.setState({lastname: response.lastname})
            this.setState({email: response.email})
            this.setState({picture: response.picture})
            this.setState({pictureURL: response.pictureURL})

            const currentUserData = await getCurrentUserData();
            this.setState({currentUserIsAdmin: currentUserData.is_admin});
            if(currentUserData.userId === this.state.userId) {
                this.setState({ show: false});
            } else {
                this.setState({ show: true});
            }
        } else {
            let api = "/getUserData?username=" + username;
            const response = await getUserData(api);
            this.setState({userId: response.userId})
            this.setState({username: response.username})
            this.setState({firstname: response.firstname})
            this.setState({lastname: response.lastname})
            this.setState({email: response.email})
            this.setState({picture: response.picture})
            this.setState({pictureURL: response.pictureURL})
            this.setState({buttonState: response.buttonState})

            const currentUserData = await getCurrentUserData();
            this.setState({currentUserIsAdmin: currentUserData.is_admin});
            if(currentUserData.userId === this.state.userId) {
                this.setState({ show: false});
            } else {
                this.setState({ show: true});
            }
        }


        if(this.state.picture) {
            this.setState({pictureExists: true})
        }
    }

    async handleDeleteProfilePicture(event) {
      const response = await deleteProfilePicture();
      if(response) {
        window.location.reload();
      }
    }

    async doSomethingWithUser() {

        // Send friendship request to user
        if(this.state.buttonState == "Add Friend") {
            const response = await sendFriendshipRequest(this.state.username);
            this.setState({buttonState: JSON.parse(response).buttonState})
        }
        // Decline other friendship request
        else if(this.state.buttonState == "Cancel request") {
            const response = await deleteMyFriendshipRequest(String(this.state.userId));
            this.setState({buttonState: JSON.parse(response).buttonState})
        }
        // Delete friendship request to user
        else if(this.state.buttonState == "Delete Friend") {
            const response = await deleteFriend(this.state.userId);
            this.setState({buttonState: JSON.parse(response).buttonState})
        }
    }

    async handleImageClick(event, bool){
      let wrapper = document.getElementsByClassName("wrapper");
      if (bool === true){
        wrapper[0].style.display = "block";
        wrapper[0].style.animation= "fadeIn 0.3s";
      }else{
        wrapper[0].style.display = "none";
      }
    }


    render() {
        return (
            <div>

                <div id="profile-header">

                  <div className="wrapper"  onClick={((e) => this.handleImageClick(e, false))}>
                    <div className="wrapper-content">
                      <div id="parent_div" >
                        <div id="background"></div>
                        <div id="textarea"></div>
                      </div>

                      <Image src={this.state.pictureURL} id="profile-image-large"/>
                    </div>
                  </div>

                    <div>
                        {(!this.state.show || this.state.currentUserIsAdmin) && this.state.pictureExists ? <Button onClick={this.handleDeleteProfilePicture} id="delete-button-profile-picture" className="button-styles" circular icon="delete" ></Button> : null}

                        {this.state.pictureURL !== "https://gruppe1.testsites.info/uploads/posts/" ? <div><Image onClick={((e) => this.handleImageClick(e, true))} id="profile-header-picture" src={this.state.pictureURL} /> </div> : <div><Image id="profile-header-picture" src="/assets/images/user.png"></Image></div> }

                    </div>
                    <Header as='h2' size="huge" icon textAlign='center'>
                    <Header.Content>
                      {this.state.username}
                      <Header.Subheader>
                          {this.state.firstname + " " + this.state.lastname}
                      </Header.Subheader>
                      <Header.Subheader>
                          {this.state.email}
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                  <div>
                      {this.state.show ? <Button id="button-add-friend" className="mobile-button-border button-styles" icon onClick={this.doSomethingWithUser.bind(this)}>{this.state.buttonState}<Icon name="user"/></Button> : null}
                  </div>
                </div>

            </div>
        );
    }


}

export default ProfileHeader;
