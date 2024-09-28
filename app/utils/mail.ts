// const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer'


// const transporter = nodemailer.createTransport({
//   host: "localhost",
//   port: 3000,
//   secure: false, // Use `true` for port 465, `false` for all other ports
//   auth: {
//     user: "hamzahusain02@gmail.com",
//     pass: "zndv gurv lcpl aevb",
//   },
//   tls: {
//     rejectUnauthorized: false
//   },
// });

// async..await is not allowed in global scope, must use a wrapper
export async function mail({message,code,id,email}:{message:string,code?:number,id?:string,email?:string}) {

  // let transporter = nodemailer.createTransport({
  //   host: "smtp.forwardemail.net",
  //   // host:"smtp.ethereal.email",
  //   port: 465,
  //   secure: true, // Use `true` for port 465, `false` for all other ports
  //   auth: {
  //     user: "hamzahusain02@gmail.com",
  //     pass: "zndv gurv lcpl aevb",
  //   }
  // });
  let transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "875514245af04c",
      pass: "6aac07882c0aad"
    }
  });
  // let transporter=nodemailer.createTransport({
  //   service:"gmail",
  //   auth:{
  //     user:"hamzahusain02@gmail.com",
  //     pass:"zndvgurvlcplaevb"
  //   }
  // })
  // send mail with defined transport object
 await transporter.sendMail({
    from: 'hamzahusain02@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Verification", // Subject line
    // text: "Hello world?", // plain text body
    html: `<h1 style="text-align:center;">Verification Code</h1> 
    <p>${message}</p>
    <h2 style="margin:0px;">Your Verification Code is </h2><br>
    <h3 style="margin:0px;">${code}</h3><br>
    <a href="http://localhost:3000/verification/${id}"><button style="padding:4px 5px;background-color:orange;text-align:center;">Verify</button> </a>`, // html body
  });

  // console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
// main()
// transporter.sendMail(message, (error, info) => {
//   if (error) {
//       console.error('Error occurred:', error);
//   } else {
//       console.log('Message sent:', info.messageId);
//   }
// });

// mail().catch(console.error);
