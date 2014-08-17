/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//pushNotification.unregister(successHandler, errorHandler, options);

//document.addEventListener("offline", onOffline, false);
//document.addEventListener("backbutton", onBackKeyDown, false);

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
			$.ajax({
			      type: 'POST',
			      url: "http://test.krashdrive.com/kiip/getDeviceIDs",
			      data: 'deviceready',
			      dataType: 'json'
			});
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        var pushNotification = window.plugins.pushNotification;

			$.ajax({
			      type: 'POST',
			      url: "http://test.krashdrive.com/kiip/getDeviceIDs",
			      data: 'event id: ' + id,
			      dataType: 'json'
			});
/*
	console.log(device.cordova);
        if (device.platform == 'android' || device.platform == 'Android') {
            alert("Register called");
        }
        else {
            alert("Register called");
            pushNotification.register(this.successHandler,this.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
        }
*/
            pushNotification.register(
		this.successHandler,
		this.errorHandler,
		{
			"senderID":"636322237508",
			"ecb":"app.onNotificationGCM"
		});
    },
    // result contains any message sent from the plugin call
    successHandler: function(result) {
        alert('Callback Success! Result = '+result);
			$.ajax({
			      type: 'POST',
			      url: "http://test.krashdrive.com/kiip/getDeviceIDs",
			      data: result,
			      dataType: 'json'
			});

    },
    errorHandler:function(error) {
        alert(error);
    },
    onNotificationGCM: function(e) {
        var pushNotification = window.plugins.pushNotification;

/*
	var objDevice = { 
		device_id: 0
	};
*/
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    alert('registration id = '+e.regid);

			window.localStorage.setItem("reg_id", e.regid);	
			alert (window.localStorage.getItem("reg_id"));

			$.ajax({
			      type: 'POST',
			      url: "http://test.krashdrive.com/kiip/getDeviceIDs",
			      data: e.regid,
			      dataType: 'json'
			});
/*

//pushNotification.unregister(successHandler, errorHandler, options);

			objDevice.device_id = e.regid;
			$.ajax({
			      type: 'POST',
			      url: "http://test.krashdrive.com/kiip/getDeviceIDs",
			      data: objDevice,
			      dataType: 'json'
			}).done(function(response) {
			      if (response.error) {
			        alert(response.error_message);
			      } else {
			        alert('Got dev id');
			      }
		    	});
*/

			pushNotification.unregister(this.successHandler, this.errorHandler);
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
    },
    onNotificationAPN: function(event) {
        var pushNotification = window.plugins.pushNotification;
        alert("Running in JS - onNotificationAPN - Received a notification! " + event.alert);
        
        if (event.alert) {
            navigator.notification.alert(event.alert);
        }
        if (event.badge) {
            pushNotification.setApplicationIconBadgeNumber(this.successHandler, this.errorHandler, event.badge);
        }
        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }
    }
};

