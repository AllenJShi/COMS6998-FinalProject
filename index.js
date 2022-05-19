var apigClient = apigClientFactory.newClient({ });
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var user_name = getCurrentUser().username;

$(document).ready(function() {
    // params, body, additionalParams
    if (user_name){
        console.log(user_name);
        const rec = document.getElementById("recommend");
        rec.innerHTML = "<h2>Items We Recommend</h2>";
        recommend();
        displayAll();
    }
    else{
        console.log(user_name);
        displayAll();
    }
});

function displayAll() {
    $('#display').attr("hidden", false);
    $('#recommend').attr("hidden", false);
    var params = {};
    var body = {};
    var additionalParams = {};
    apigClient.itemsGet(params,body,additionalParams)
        .then(function(result){
            displayItems(result.data);
        });
}

function displayItems(rows,recommend=false) {
    var idname = "#display1";
    if (recommend){
        idname = "#display";
    }

    $(idname).empty()
    $.each(rows, function(index, val) { 
        console.log(index, val)
        var col = $('<div class="col-md-6 col-lg-4">')
        var box = $("<div class='box'></div>")
        var image_box = $("<div class='img-box'>")
        var detail_box = $("<div class='detail-box'></div>")

        if (val['image_url']) {
          console.log(val['image_url'])
          $("<img class='img-fluid' src='" + val['image_url'] +"'></img>").appendTo(image_box)
        } else {
          $("<img width='200' src='/static/veg/images/display2.png'></img>").appendTo(image_box)
        }
        image_box.appendTo(box)
        detail_box.append('<a id="detaila" class="detaila" href="javascript:display(' + val['item_id'] + ')">'+ val['name']+'</a>')

        detail_box.appendTo(box)
        var price_box = $("<div class='price-box'></div>")
        price_box.append('<span>$'+ val['price'] + '</span>')
        price_box.appendTo(box)
        box.appendTo(col)
        col.appendTo($(idname))
    });
}


function display(item_id){
    $('#display').attr("hidden", true);
    $('#recommend').attr("hidden", true);
    var apigClient = apigClientFactory.newClient({ });
    var params = {
      item_id:item_id,
      category:null
    };
    var body = {
      item_id:item_id,
      category:null
    };
    var additionalParams = {};
    apigClient.itemsPost(params,body,additionalParams)
        .then(function(result){
            console.log(result.data);
            renderDisplay(result.data);
        });
}

function renderDisplay(data){
    $('#display1').empty();
    var col2 = $('<div class="col-md-4">')
    var about_img_box = $("<div class='img-box'></div>")
    if (data['image_url']) {
        $("<img class='img-fluid' src='" + data['image_url'] +"'></img>").appendTo(about_img_box)
    } else {
        $("<img class='img-fluid' src='/static/veg/images/display2.png' alt=''></img>").appendTo(about_img_box)
    }
    about_img_box.appendTo(col2)
    col2.appendTo($('#display1'))

    var seller_id = data['user_name'];
    var params = {
        user_name: seller_id 
    };
    var body = {
        user_name: seller_id 
    };
    var additionalParams = {};
    apigClient.profilePost(params,body,additionalParams)
        .then(function(result){
            console.log(result.data.Item);
            var seller = result.data.Item;
            var col = $('<div class="col-md-5 offset-md-2">')
            var about_detail_box = $("<div class='about_detail-box'></div>");
            about_detail_box.append('<h3 class="my-4">' + data['name'] + '  ($' + data['price'] + ') </h3>');
            about_detail_box.append('<p> Owner: ' + seller['user_name'] + '</p>');
            about_detail_box.append('<p> Posted at: ' + data['posted_at'] + '</p>');   
            about_detail_box.append('<p> Description: '+ data['description'] + '</p>');
            about_detail_box.append('<p> Category: ' + data['type'] + '</p>')
            about_detail_box.append('<p> Number: ' + data['number'] + '</p>')
            about_detail_box.append('<p> Phone: ' + seller['phone'] + '</p>');
            about_detail_box.append('<p> Email: ' + seller['email'] + '</p>');
            about_detail_box.append('<button class="btn btn-secondary mx-4" onclick="displayAll()">Back</button>');
            about_detail_box.append('<button class="btn btn-info" onclick="addToWishList('+ data['item_id'] + ')">Add to Wishlist</button>');
            about_detail_box.appendTo(col);
            col.appendTo($('#display1'));
        });
}

function addToWishList(item_id){
    console.log('add to wishlist', user_name, item_id)
    var params = {
        user_name: user_name,
        item_id: item_id
    };
    var body = {
        user_name: user_name,
        item_id: item_id
    };
    var additionalParams = {};
    //apigClient.addtowishUserIdItemIdPost(params,body,additionalParams)
    apigClient.wishlistPost(params,body,additionalParams)
        .then(function(result){
            console.log(result.data);
        });
}


function getCategory(category){
    var apigClient = apigClientFactory.newClient({ });
    var params = {
        item_id:null,
        category:category
    };
    var body = {
        item_id:null,
        category:category
    };
    var additionalParams = {};
    apigClient.itemsPost(params,body,additionalParams)
        .then(function(result){
            console.log("Category " + category + " load SUCCEED!")
            // console.log(result.data);
            displayItems(result.data);
        });
}


function recommend(){
    var params = {
        user_id:user_name,
    };
    var body = {
        user_id:user_name,
    };
    var additionalParams = {};
    apigClient.recommendUserIdPost(params,body,additionalParams)
        .then(function(result){
            console.log("Recommend %s SUCCEED!", user_name)
            console.log(result.data);
            displayItems(result.data,recommend=true);
            // return result.data;
        });
}