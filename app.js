function removeFromWishList(){
    var apigClient = apigClientFactory.newClient({ });
    // var user_id = this.user_id;
    // var item_id = this.item_id;
    var user_id = "1";
    var item_id = "1";
    var params = {
        item_id: item_id,
        user_id: user_id
    };
    var body = {
        item_id: item_id,
        user_id: user_id
    };
    var additionalParams = {
        queryParams: {
            item_id: item_id,
            user_id: user_id
        }
    };

    // call api gateway to pass the added item to lambda and backend database
    apigClient.addtowishUserIdItemIdDelete(params,body,additionalParams)
        .then(function(result){
            console.log("Remove From Wish List SUCCEED!");
            console.log(result);
            // update the Wish List on the sidebar
            updateWishList();
        });
};


function addToWishList(){
    var apigClient = apigClientFactory.newClient({ });
    // var user_id = this.user_id;
    // var item_id = this.item_id;
    var user_id = "1";
    var item_id = "1";
    var params = {
        item_id: item_id,
        user_id: user_id
    };
    var body = {
        item_id: item_id,
        user_id: user_id
    };
    var additionalParams = {
        queryParams: {
            item_id: item_id,
            user_id: user_id
        }
    };

    // call api gateway to pass the added item to lambda and backend database
    apigClient.addtowishUserIdItemIdPost(params,body,additionalParams)
        .then(function(result){
            console.log("Add to Wish List SUCCEED!");
            console.log(result);
            // update the Wish List on the sidebar
            updateWishList();
        });
};


// TODO:
function updateWishList(){
    // update the Wish List on the sidebar
    var apigClient = apigClientFactory.newClient({ });
    var user_id = this.user_id;
    console.log("hello");
    return 0;
};


var wishlistBtn = document.querySelector('.wishlist_icon');

wishlistBtn && wishlistBtn.addEventListener('click', function () {
    if (this.classList.contains('active')){
        this.classList.remove('active');
        removeFromWishList();
    }else{
        this.classList.add('active');
        addToWishList();
    }
});


// window.addEventListener('load',showItems);
window.onload = function(){
    console.log("Loading items from database ...");
    var apigClient = apigClientFactory.newClient({ });
    var user_id = "1";
    // get user id from cache
    var params = {
        user_id: user_id,
    }
    var body = {};
    var additionalParams = {};
    apigClient.recommendUserIdPost(params,body,additionalParams)
        .then(function(result){
            console.log("Query from database SUCCEED!");
            console.log(result);
            // show the item table
            showItems(result);
            // showItems(result.data);
            console.log("Loaded items onto main page!")
        });
};


function showItems(res) {
    var newDiv = document.getElementById("images");
    if (typeof(newDiv) != 'undefined' && newDiv != null) {
        while (newDiv.firstChild) {
            newDiv.removeChild(newDiv.firstChild);
        }
    }

    console.log("Result in showImages",res);
    if (res.length == 0) {
        var newContent = document.createTextNode("No image to display");
        newDiv.appendChild(newContent);
    } else {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i]);
            var newDiv = document.getElementById("images");
            var newimg = document.createElement("img");
            newimg.classList.add('col-md-3');
            newimg.classList.add('img-fluid');
            newimg.src = res[i].url;
            newDiv.append(newimg);

            // TODO: create item name, item id(used to retrieve items details & build wish list), wish list icon

        }
    }
}



// TODO:
function addComments(){
    var apigClient = apigClientFactory.newClient({ });
    var user_id = this.user_id;
    var item_id = this.item_id;
    var comment = document.getElementById('.postinput')
    var params = {
        user_id: user_id,
        item_id: item_id

    }
    var body = {
        comment:comment
    };
    var additionalParams = {};
    apigClient.commentsItemIdPost(params,body,additionalParams)
        .then(function(result){
            console.log("Add comments to database SUCCEED!");
            console.log(result);
            // query all comments from the database
            // this means users can view newly posted comments only if they refresh or post a comment themselves
            showComments(result.data);
            console.log("Loaded comments onto main page!")
        });
}

function showComments(res){
    // the input should be a json containing all posts in the database
    return 0;
}