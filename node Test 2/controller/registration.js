const { User } = require("../model/makeUser");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");

const jwtKEY = "ThisIS@RandomKey9";

const registerUser = (req, res) => {
  const { name, email, phone, password } = req.body;

  bcrypt.hash(password, 8, function async(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      name,
      email,
      phone,
      password: hash,
    });
    newUser.save();

    // how to send mail to user ///////////////////////////////////////////////
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sujoypaul728@gmail.com",
        pass: "drrf bdck cwup gcmn",
      },
    });

    //jwt token
    JWT.sign({ user: req.body }, jwtKEY, { expiresIn: "2h" }, (err, token) => {
      const info = transporter.sendMail({
        from: "InspireSpace Confirmation - <sujoypaul728@gmail.com>", // sender address
        to: `${email}`, // list of receivers
        subject: `Hey ${name} ${newUser._id}`, // Subject line
        html: `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Welcome to InspireSpace</title>
                        </head>
        
                        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 30px;">
                            <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 50px; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                                <div style="background-color: #007BFF; color: #ffffff; padding: 20px; text-align: center;">
                                    <h1 style="margin: 0;">Welcome to InspireSpace, ${name}!</h1>
                                </div>
                                <div style="padding: 20px;">
                                    <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                                        Dear ${name},
                                    </p>
                                    <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                                        We're thrilled to have you on board! InspireSpace is the perfect place for you to share your innovative projects, explore new ideas, and connect with like-minded individuals. We can't wait to see what you'll create!
                                    </p>
                                    <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                                        If you have any questions or need assistance, feel free to reach out to us at any time.
                                    </p>
                                    <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                                        Happy innovating!
                                    </p>
                                    <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                                        Best regards,<br>
                                        Sujoy Paul - Node Practice
                                    </p>
                                </div>
                                <div style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #777777; font-size: 14px;">
                                    <p style="margin: 0;">&copy; 2024 InspireSpace. All rights reserved.</p>
                                </div>
                            </div>
                        </body>
        
                        </html>
        `, // html body
      });
      console.log("Message sent: %s", info);
      res.send({user: newUser, token});
    });
  });
};

module.exports = registerUser;
 