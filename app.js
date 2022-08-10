//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const request=require("request");
const https=require("https");

const homeStartingContent =
  "The posts will be shown here on this Home page.";
const aboutContent =
  "This is a blog website created by Kumar Satwik and Tauqueer Jafri as mini project for 4th sem.";

  let posts=[];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-satwik:Kishorlaxmisatwik@cluster0.vzaehmm.mongodb.net/Blogdb", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/signup", function(req, res){
  res.render("signup");
});


app.post("/",function(req,res)
{

    const firstName=req.body.fName;
    const lastName=req.body.lName;
    const email=req.body.email;

    var data={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data);

    const url="https://us14.api.mailchimp.com/3.0/lists/ff607f01b7";

    const options= {
        method: "POST",
        auth: "satwik1:b69ead0aad6b10d30d0c3387067d6889-us14"
    }

   const request= https.request(url,options,function(response){
       if (response.statusCode===200)
       {
           res.render("success");
       }
       else
       res.render("failure")
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });

    })
    request.write(jsonData);
    request.end();
})

app.post("/failure",function(req,res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000,function()
{
    console.log("Server started successfully");
})
