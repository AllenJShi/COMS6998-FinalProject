var apigClient = apigClientFactory.newClient();
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var username = getCurrentUser().username;


// $(document).ready(function() {
//     var apigClient = apigClientFactory.newClient({ });
//     // params, body, additionalParams
//     $("#postitem").submit(function (e) { 
//         console.log('submit form')
//         e.preventDefault();
//         var formData = {};
//         var inputs = $('#postitem').serializeArray();
//         var file = document.getElementById('realfile');
//         // var file = document.querySelector("input[name='image']");
//         var image = file.files[0];
//         $.each(inputs, function (i, input) {
//            formData[input.name] = input.value;
//         });
//         console.log(username,formData,file.target);
//         var params = { };
//         var body = {
//             username: username,
//             image: image,
//             form_data: formData
//         };
//         var additionalParams = {
//             queryParams: {
//             }
//         };
//         apigClient.createitemPost(params,body,additionalParams)
//             .then(function(result){
//                 console.log(result.data);
//                 if (result.data.statusCode == 200) {
//                     $('#postitem').trigger("reset")
//                     $('#msg').text('Successfully posted!')
//                 }
//             });

//       });
// });




function uploadPhoto() {
    var file = document.getElementById('realfile').files[0];
    event.preventDefault();
    if (file == null) {
        alert("Please select file you would like to upload.")
    }

    var additionalParams = {
        headers: {
            'Content-Type': file.type,
            // 'x-amz-meta-customLabels': "1",
        }
    }
    console.log(file.type)
    console.log(additionalParams)

    url="https://ltncav72vj.execute-api.us-east-1.amazonaws.com/v1/uploadphoto/final-item-photos/"+file.name;
    axios.put(url, file, additionalParams).then(response => {
        // alert("Image uploaded: " + file.name);
        // console.log(response);

        var formData = {};
        var image_url = "https://final-item-photos.s3.amazonaws.com/" + file.name;
        var inputs = $('#postitem').serializeArray();
        $.each(inputs, function (i, input) {
           formData[input.name] = input.value;
        });
        var params = { };
        var body = {
            username: username,
            image_url: image_url,
            form_data: formData
        };
        var additionalParams = { };
        apigClient.createitemPost(params,body,additionalParams)
            .then(function(result){
                console.log(result.data);
                if (result.data.statusCode == 200) {
                    $('#postitem').trigger("reset")
                    $('#msg').text('Successfully posted!')
                }
            });
    }).catch(function (error) {
        console.log(error);
    });


    console.log("All Done!")

}
