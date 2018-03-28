import React, {Component} from 'react';
import {  Redirect } from 'react-router-dom';
import { Button, Form, Input } from 'semantic-ui-react'
import Sidebar from '../Components/Sidebar'
import Dropzone from 'react-dropzone'
import FormData from 'form-data';

import {checkSession} from '../API/GET/GetMethods';
import {uploadPictureToPlatform} from '../API/POST/PostMethods';

import '../profileStyle.css';

class Upload extends Component {
    constructor() {
        super();

        this.state = {
          files: [],
          title: "",
          content: "",
          redirectToFeed: false,
          message: "",
        }

        this.apiCheckSession = "/checkSession"
        this.api = "/image/create";

        this.checkThisSession();

        this.pageTitle = "Upload an image..."
        document.title = this.pageTitle;
    }

    async checkThisSession() {
        const response = await checkSession(this.apiCheckSession);
        if(response.message !== "User is authorized") {
            this.setState({redirectToLogin: true})
        }
    }

    //Post image to feed
    async handleSubmit(event) {
        event.preventDefault();
        console.log("clicked now on submit");

        this.state.title =  event.target[0].value;
        this.state.content =  event.target[1].value;

        const fd = new FormData();
        fd.append('theImage', this.state.files[0]);
        fd.append('title', this.state.title);
        fd.append('content', this.state.content);

        const response = await uploadPictureToPlatform(
            this.api,
            fd
        );

        console.log(response);

        //Do something with response
        this.setState({message : JSON.parse(response).message});

        if(this.state.message === "Image uploaded") {
            this.setState({ redirectToFeed: true });
        } else {
            //Error messages
            let errorField = document.getElementById("error-message");
            let messageText = "<b>"+this.state.message+"</b>";
            errorField.innerHTML = messageText;
        }

    }


    onDrop(files) {
      this.setState({
        files: files
      });
    }



    render() {
        const { redirectToFeed } = this.state;
         if (redirectToFeed) {
           return <Redirect to='/'/>;
         }

        return (
        <div>
            <div className="feed">

            <Sidebar />

            <div id="upload-content">
                <h2 >Upload new content</h2>
                <Form onSubmit={this.handleSubmit.bind(this)}>

                      <span className="input-label-upload"> Enter the title of your new post</span>
                      <Input className="input-upload" type="text"/>

                      <span className="input-label-upload"> Add description...</span>
                      <Input className="input-upload" type="text"/>

                      <span className="input-label-upload"> Select the file you want to share</span>

                      <Dropzone id="dz-repair" multiple={ false } name="theImage" acceptedFiles="image/jpeg, image/png, image/gif" disablePreview="true" className="upload-dropzone" onDrop={this.onDrop.bind(this)} >
                          <p>Try dropping a picture here, or click to select a picture to upload.</p>
                      </Dropzone>

                      <Button className="button-upload" type="submit">Post</Button>

                      <div id="error-message">
                      </div>
                </Form>

            </div>
          </div>
      </div>
        )
    }
}

export default Upload;
