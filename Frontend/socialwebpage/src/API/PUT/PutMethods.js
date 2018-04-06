import $ from 'jquery';
import { read_cookie } from 'sfcookies';

var getUrl = window.location;
var url = getUrl.protocol + "//" + getUrl.hostname + "/rest";

export const updateUserData=(api, jsonUserData)=>{
  return new Promise((resolve, reject) => {
      var token = read_cookie('token')
      $.ajax({
        url: url + api,
        contentType: "application/json",
        type: "PUT",
        data: jsonUserData,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function(data) {
          resolve(data);
        },
        error: function(xhr, status, err){
          reject(err);
        }
    });
  });
}
