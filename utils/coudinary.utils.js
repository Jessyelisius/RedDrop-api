//cloudinary
const cloudinary= require('cloudinary')
cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret
})


async function uploadimg(file) {
  try {
    let files = file?file:false
    if (files!=false) {
        let upload =await cloudinary.v2.uploader.upload(files.tempFilePath,{resource_type:'image',folder:process.env.profile,use_filename:false,unique_filename:true})
        return {url:upload.secure_url, publicID:upload.public_id}
    }
    return {error:'Images are missing'}
  } catch (error) {
    console.log(error);
    return {error:error.message}
  }
}


async function editIMG(file, publicID) {
    try {
      let files = file?file:false
      let PID = publicID?publicID:false
      if (files!=false && PID!=false) {
        console.log(PID);
          await cloudinary.v2.uploader.destroy(PID,{resource_type:'image'})  
          let upload =await cloudinary.v2.uploader.upload(files.tempFilePath,{resource_type:'image',public_id:PID})
          return {url:upload.secure_url, publicID:upload.public_id}
      }
      return {error:'Images are missing'}
    } catch (error) {
      console.log(error);
      return {error:error.message}
    }
  }
  



module.exports={uploadimg, editIMG}