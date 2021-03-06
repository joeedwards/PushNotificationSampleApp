#document.addEventListener("offline", onOffline, false);
#document.addEventListener("backbutton", onBackKeyDown, false);
###
namespace = (target, name, block) ->
	[target, name, block] = [(if typeof exports isnt 'undefined' then exports else window), arguments...] if arguments.length < 3
	top    = target
	target = target[item] or= {} for item in name.split '.'
	block target, top

namespace 'App.Load', (exports, top) ->
	exports.kdapp = kdapp
###

kiipApp = exports ? window

kiipApp.kdapp =
	
	tester: ->
		alert 'test'
		return
	
	# Application Constructor
	initialize: ->
		@bindEvents()
		return

	
	# Bind Event Listeners
	#
	# Bind any events that are required on startup. Common events are:
	# 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: ->
		document.addEventListener "deviceready", @onDeviceReady, false
		return

	
	# deviceready Event Handler
	#
	# The scope of 'this' is the event. In order to call the 'receivedEvent'
	# function, we must explicity call 'app.receivedEvent(...);'
	onDeviceReady: ->
		kiipApp.kdapp.receivedEvent "deviceready"
		return

	
	# Update DOM on a Received Event
	receivedEvent: (id) ->
		
		#visual/CSS stuff here
		parentElement = document.getElementById(id)
		listeningElement = parentElement.querySelector(".listening")
		receivedElement = parentElement.querySelector(".received")
		listeningElement.setAttribute "style", "display:none;"
		receivedElement.setAttribute "style", "display:block;"
		console.log "Received Event: " + id
		pushNotification = window.plugins.pushNotification
		
		#
		#//need to get device plugin working
		try
			console.log device.cordova
			if device.platform in ['android', 'Android']
				alert "Register called Android"
				pushNotification.register @successHandler, @errorHandler,
					senderID: "636322237508"
					ecb: "kiipApp.kdapp.onNotificationGCM"
		        
			else
				alert "Register called APN"
				pushNotification.register @successHandler, @errorHandler,
					badge:"true"
					sound:"true"
					alert:"true"
					ecb:"kiipApp.kdapp.onNotificationAPN"
		catch e
			alert 'device plugin error: ' + e

		return

	
	# result contains any message sent from the plugin call
	successHandler: (result) ->

	
	#alert('Callback Success! Result = '+result);
	errorHandler: (error) ->
		alert error
		return

	onNotificationGCM: (e) ->
		pushNotification = window.plugins.pushNotification
		try
			kiipApp.kdapp.onGotReg window.localStorage.getItem("reg_id")
		
		catch e
			alert "window.localStorage.getItem " + e
		switch e.event
			when "registered"
				if e.regid.length > 0
					console.log "Regid " + e.regid
					alert "registration id = " + e.regid
					window.localStorage.setItem "reg_id", e.regid
					kiipApp.kdapp.onGotReg e.regid
			when "message"
			  
				# this is the actual push notification. its format depends on the data model from the push server
				alert "message = " + e.message + " msgcnt = " + e.msgcnt
			when "error"
				alert "GCM error = " + e.msg
			else
				alert "An unknown GCM event has occurred"

	onNotificationAPN: (event) ->
		pushNotification = window.plugins.pushNotification
		alert "Running in JS - onNotificationAPN - Received a notification! " + event.alert
		navigator.notification.alert event.alert if event.alert
		pushNotification.setApplicationIconBadgeNumber @successHandler, @errorHandler, event.badge if event.badge
		if event.sound
			snd = new Media(event.sound)
			snd.play()
		return

	onGotReg: (regID) ->
		regInfo = device_id: regID
		$.ajax
			type: "POST"
			url: "http://test.krashdrive.com/kiip/getDeviceIDs"
			data: regInfo
			dataType: "json"

		return

