// Generated by CoffeeScript 1.7.1
(function() {
  var app;

  app = {
    initialize: function() {
      this.bindEvents();
    },
    bindEvents: function() {
      document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    onDeviceReady: function() {
      app.receivedEvent("deviceready");
    },
    receivedEvent: function(id) {
      var listeningElement, parentElement, pushNotification, receivedElement;
      parentElement = document.getElementById(id);
      listeningElement = parentElement.querySelector(".listening");
      receivedElement = parentElement.querySelector(".received");
      listeningElement.setAttribute("style", "display:none;");
      receivedElement.setAttribute("style", "display:block;");
      console.log("Received Event: " + id);
      pushNotification = window.plugins.pushNotification;
      pushNotification.register(this.successHandler, this.errorHandler, {
        senderID: "636322237508",
        ecb: "app.onNotificationGCM"
      });
    },
    successHandler: function(result) {},
    errorHandler: function(error) {
      alert(error);
    },
    onNotificationGCM: function(e) {
      var pushNotification;
      pushNotification = window.plugins.pushNotification;
      try {
        app.onGotReg(window.localStorage.getItem("reg_id"));
      } catch (_error) {
        e = _error;
        alert("window.localStorage.getItem " + e);
      }
      switch (e.event) {
        case "registered":
          if (e.regid.length > 0) {
            console.log("Regid " + e.regid);
            alert("registration id = " + e.regid);
            window.localStorage.setItem("reg_id", e.regid);
            return app.onGotReg(e.regid);
          }
          break;
        case "message":
          return alert("message = " + e.message + " msgcnt = " + e.msgcnt);
        case "error":
          return alert("GCM error = " + e.msg);
        default:
          return alert("An unknown GCM event has occurred");
      }
    },
    onNotificationAPN: function(event) {
      var pushNotification, snd;
      pushNotification = window.plugins.pushNotification;
      alert("Running in JS - onNotificationAPN - Received a notification! " + event.alert);
      if (event.alert) {
        navigator.notification.alert(event.alert);
      }
      if (event.badge) {
        pushNotification.setApplicationIconBadgeNumber(this.successHandler, this.errorHandler, event.badge);
      }
      if (event.sound) {
        snd = new Media(event.sound);
        snd.play();
      }
    },
    onGotReg: function(regID) {
      var regInfo;
      regInfo = {
        device_id: regID
      };
      $.ajax({
        type: "POST",
        url: "http://test.krashdrive.com/kiip/getDeviceIDs",
        data: regInfo,
        dataType: "json"
      });
    }
  };

}).call(this);
