const VerificationsModel = require("./model/Verifications.model");

let y= {l:1,c:3}

delete(y.l)
console.log(y);

const z= {}
if (z) {
    console.log('normal');
}

let v=async ()=>console.log(await VerificationsModel.findOne({Link:1111}));
v()