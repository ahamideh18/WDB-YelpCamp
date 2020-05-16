var mongoose = require("mongoose");
 
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   price: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
 
module.exports = mongoose.model("Campground", campgroundSchema);


// Campground.create(
//     {name: "CaruSHOW",
//     image: "https://pbs.twimg.com/media/EH75WbjX4AIZ3-j.jpg",
//     description: "2 Words. ALEX CARUSO!!!!" },
//     function(err, campground){
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log("NEW CAMPGROUND");
//             console.log(campground)
//         }
//     });