



$.get("/api/user_data").then(cloudData =>{
   


var myWidget = cloudinary.createUploadWidget({
    cloudName: cloudData.cloudUploadName,
      uploadPreset: cloudData.cloudUploadPreset}, (error, result) => {   // my_preset
      if (!error && result && result.event === "success") { 
        console.log('Done! Here is the image info: ', result.info); 
        var imageUrl= result.info.secure_url;
        $.ajax({
url:"/api/user_data",
method:"PUT",
data:{profilePicture:imageUrl}
        }).then(()=> {
            console.log("done!!!");
            $('.member_icon').attr("src",imageUrl);
        })
      }
    }
  )
  
  document.getElementById("upload_widget").addEventListener("click", function(){
      myWidget.open();
    }, false);
});