// async function Verification (req,res) {
//     try {
//         let sess= req.session.SchoolID
//         let sesscheck = sess?(sess.toString().length==24)?sess:false:false
//         if (sesscheck!=false) {
//             let getpay = await VerificationModel.findOne({SchoolID:sesscheck})
//             let checkVerif = getpay?(getpay.EmailVerif==true && getpay.DueDate>Date.now())?true:false:false
//             if (getpay) {
//                 (getpay.DueDate<Date.now() && getpay.PaymentVerif==true)?await VerificationModel.updateOne({_id:sesscheck},{PaymentVerif:false}):false

//                 if (checkVerif!=false) {
//                     return {all:true, email:getpay.EmailVerif, Payment:getpay.DueDate>Date.now()}
//                 }
//                 return {all:false,email:getpay.EmailVerif, Payment:getpay.DueDate>Date.now()}
//             }
//             return{error:'user not found'}
//         }
//         return {error:'not found'}

//     } catch (error) {
//         // console.log(error.message);
//         return{error:Errordisplay(error)}
//     }

// }

function Errordisplay(error) {
  console.log(error.message);
  if (error.message) {
    const msg = error.message.split(":")[2];
    return {
      msg: msg
        ? msg.split(",")[0]
          ? msg
              .split(",")[0]
              .split(" ")
              .find((i) => i == "dup")
            ? "Account details already exist"
            : msg.split(",")[0]
          : "Error occured"
        : "Error occured with file upload",
    };
  } else {
    console.log(error);
    return { msg: "Severe error occured" };
  }
}

module.exports = { Errordisplay };
