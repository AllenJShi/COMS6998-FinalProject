$(document).ready(function() {
    var apigClient = apigClientFactory.newClient({ });
    // var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var user_name = getCurrentUser().username;
    $('#edit').attr("hidden", true);
    // params, body, additionalParams
    var params = {
        user_name: user_name
    };
    var body = {
        user_name: user_name
    };
    var additionalParams = {};
    apigClient.profilePost(params,body,additionalParams)
        .then(function(result){
            // console.log(result.data.Item);
            var wishRows = result.data.Item['wish_list'];
            console.log('wish items', wishRows);
            $.each(wishRows, function(index, val) { 
                getWishItem(val);
            });
            var postRows = result.data.Item['post_list'];
            console.log('post items', postRows);
            $.each(postRows, function(index, val) { 
                getPostItem(val);
            });
        });

    function getPostItem(item_id) {
        var params = {
          item_id: item_id,
          category: null
        };
        var body = {
          item_id: item_id,
          category: null
        };
        var additionalParams = {};
        apigClient.itemsPost(params,body,additionalParams)
            .then(function(result){
                console.log('getPostItem', item_id);
                // console.log(result.data, jQuery.isEmptyObject(result.data));
                if (!jQuery.isEmptyObject(result.data)){
                    insertPostlist(result.data);
                }
            });
    }

    function getWishItem(item_id) {
        var params = {
          item_id: item_id,
          category: null
        };
        var body = {
          item_id: item_id,
          category: null
        };
        var additionalParams = {};
        apigClient.itemsPost(params,body,additionalParams)
            .then(function(result){
                //console.log(result.data);
                var item = result.data;
                var seller_id = item['user_name'];
                var params2 = {
                    user_name: seller_id 
                };
                var body2 = {
                    user_name: seller_id 
                };
                apigClient.profilePost(params2,body2,additionalParams)
                    .then(function(result){
                        console.log(result.data.Item);
                        var seller = result.data.Item;
                        insertWishlist(item, seller);
                    });
            });
    }

    function insertPostlist(item) {
        $('#postlist').append($('<tr>')
          .append($('<td>').append(item['name']))
          .append($('<td>').append('$ '+item['price']))
          .append($('<td>').append(item['number']))
          .append($('<td>').append(item['type']))
          .append($('<td>').append(item['posted_at']))
          .append($('<td>').append('<button class="btn btn-secondary" onclick="deleteItem('+ item['item_id'] + ')">Delete</button>'))
          .append($('<td>').append('<button class="btn btn-secondary" onclick="editItem('+ item['item_id'] + ')">Edit</button>'))
        )
    }


    function insertWishlist(item, seller) {
        $('#wishlist').append($('<tr>')
          .append($('<td>').append(item['name']))
          .append($('<td>').append('$ '+item['price']))
          .append($('<td>').append(seller['user_name']))
          .append($('<td>').append(seller['phone']))
          .append($('<td>').append(seller['email']))
          .append($('<td>').append('<button class="btn btn-secondary"  onclick="deleteFromWishlist('+ item['item_id'] + ')">Delete</button>'
))
        )
    }


});

var cur_item;

function editItem(item_id) {
    console.log('edit item', item_id);
    cur_item = item_id;
    var params = {
      item_id: item_id,
      category: null
    };
    var body = {
      item_id: item_id,
      category: null
    };
    var additionalParams = {};
    apigClient.itemsPost(params,body,additionalParams)
        .then(function(result){
            console.log('getPostItem', item_id);
            if (!jQuery.isEmptyObject(result.data)){
                $('#edit').attr("hidden", false);
                $('#title').val(result.data['name']);
                $('#price').val(result.data['price']);
                $('#number').val(result.data['number']);
                $('#description').val(result.data['description']);
            }
        });
}

function updateItem() {
    console.log(cur_item);
    var inputs = $('#edititem').serializeArray();
    var formData = {};
    $.each(inputs, function (i, input) {
       formData[input.name] = input.value;
    });
    console.log(formData);
    var params = {};
    var body = {
        item_id: cur_item,
        form_data: formData
    };
    var additionalParams = {};
    apigClient.itemsPut(params,body,additionalParams)
        .then(function(result){
            console.log(result.data);
            if (result.data.statusCode == 200) {
                $('#edit').attr("hidden", true);
            }
        });
}


    // var params = {
    //   user_name: user_name,
    //   item_id: item_id
    // };
    // var body = {
    //   user_name: user_name,
    //   item_id: item_id
    // };
    // var additionalParams = {};
    // apigClient.it
    // apigClient.itemsDelete(params,body,additionalParams)
    //     .then(function(result){
    //         console.log(result.data);
    //     });
    // window.location.reload();

function deleteItem(item_id){
    var user_name = getCurrentUser().username;
    console.log('delete item', user_name, item_id)
    var params = {
      user_name: user_name,
      item_id: item_id
    };
    var body = {
      user_name: user_name,
      item_id: item_id
    };
    var additionalParams = {};
    apigClient.itemsDelete(params,body,additionalParams)
        .then(function(result){
            console.log(result.data);
        });
    window.location.reload();
}


function deleteFromWishlist(item_id){
    var user_name = getCurrentUser().username;
    console.log('delete from wishlist', user_name, item_id)
    var params = {
      user_name: user_name,
      item_id: item_id
    };
    var body = {
      user_name: user_name,
      item_id: item_id
    };
    var additionalParams = {};
    apigClient.wishlistDelete(params,body,additionalParams)
        .then(function(result){
            console.log(result.data);
        });
    window.location.reload();
}