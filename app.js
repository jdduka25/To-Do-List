const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

app.get("/", function(req, res){

    Item.find({}, function(err, foundItems){
        res.render("list", {listItems: foundItems});
    });
});

app.post("/", function(req, res){
   const itemAdded = req.body.item;

   const item = new Item({
    name: itemAdded
   });

   item.save();

   res.redirect("/");
})

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    
    Item.findByIdAndRemove(checkedItemId, function(err){
        if(!err){
            console.log("Successfully deleted checked item.");
            res.redirect("/");
        }
    });

});


app.listen(3000, function(){
    console.log("Server started on port 3000");
})
