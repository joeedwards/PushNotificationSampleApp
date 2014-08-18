var testObj = {
    testPost: function() {
	alert('test post func');
        $.ajax({
              type: 'POST',
              url: "http://test.krashdrive.com/kiip/getDeviceIDs",
              data: "testPost",
              dataType: 'json'
        });

    },
    onGotReg: function() {
        $.ajax({
              type: 'POST',
              url: "http://test.krashdrive.com/kiip/getDeviceIDs",
              data: "onGotReg",
              dataType: 'json'
        });

    }
};
