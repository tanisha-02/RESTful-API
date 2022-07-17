const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");

const app=express();

app.set("view-engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleSchema={
    title:String,
    content:String
};

const Article=mongoose.model("Article",articleSchema);

app.route("/articles")
.get(function(req,res){
    Article.find({},function(err,foundList){
        if(!err)
        res.send(foundList);
        else
        res.send(err);
    })
})
.post(function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    })
    newArticle.save(function(err)
    {
        if(!err)
        res.send("Successfully added the article");
        else
        res.send(err);
    });
})
.delete(function(req,res){
    Article.deleteMany({},function(err)
    {
        if(!err)
        res.send("Successfully deleted all articles");
        else
        res.send(err);
    })
});
//for a specific route
app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if(!err)
        {
            if(foundArticle)
           res.send(foundArticle);
            else
            res.send("No article found matching with that title")
        }
    })
})
.put(function(req,res)
{
    Article.findOneAndUpdate({title:req.params.articleTitle},//conditions
        {title:req.body.title, content:req.body.content},//updates to be made
        {overwrite:true},//by default mongoose will prevent the properties being overwritten and deleted
        function(err)
        {
            if(!err)
            res.send("Successfully updated the article");
            else
            console.log(err);
        }
        );
    
})
.patch(function(req,res)
{
    Article.findOneAndUpdate({title:req.params.articleTitle},
        {$set:req.body},//it will update only those elements of the req.body which has been specified in the postman patch method
        function(err)
        {
            if(!err)
            res.send("Successfully updated the required field");
            else
            res.send(err);
        })
})
.delete(function(req,res)
{
    Article.deleteOne({title:req.params.articleTitle},function(err)
    {
        if(!err)
        res.send("Successfully deleted the selected article");
        else
        res.send(err);
    })
})
app.listen(3000,function(){
    console.log("Server started running on port 3000");
})