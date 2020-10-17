var express = require ('express');
var app = express();
var mongoose = require ('mongoose');
var bodyParser = require('body-parser');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.listen(3004, function(){
    console.log("Swag shop API running on port 3004");
});

app.post('/product', function(request, response){
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save(function(err, savedProduct){\
        
        if(err){
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.status(500).send({error:"Could not save product"})
        } else {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.status(200).send(savedProduct);
        }
    })
});


app.get('/product', function(request, response){
    
    Product.find({}, function(err, products){
        if (err){
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.status(500).send({error:"Could not fetch products"});
        } else {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.send(products);
        }
    });

});


app.post('/wishlist', function(request, response){
    var wishlist = new WishList();
    wishlist.title = request.body.title;

    wishlist.save(function(err, savedProduct){
        if (err){
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.status(500).send({error:"Could not save wish list"});
            
        } else {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.send(savedProduct);
            
        }
    })
});

app.put('/wishlist/product/add', function(request, response){
    Product.findOne({_id: request.body.productId}, function(err, product){
        if(err){
            response.status(500).send({error:"Could not add product"})
        } else {
            WishList.update({_id:request.body.wishListId}, {$addToSet:{products:product._id}}, function(err, wishList){
                if(err){
                    response.setHeader('Access-Control-Allow-Origin', '*');
                    response.status(500).send({error:"Could not save wish list"});
                    
                } else {
                    response.setHeader('Access-Control-Allow-Origin', '*');
                    response.send(wishList);
                    
                }
            });
        }
    });
});

app.get('/wishlist', function(request, response){
    WishList.find({}).populate({path:'products', model:'Product'}).exec(function(err, wishLists)
    {
        if(err){
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.status(500).send({error:"Could not fetch wishlists"});
            
        } else {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.send(wishLists);
            
        }
    })
});