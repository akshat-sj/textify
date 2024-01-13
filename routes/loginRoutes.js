const express = require('express');
const app = express();
const User = require("../schemas/user");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const router = express.Router();
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const LoginComponent = ({ errorMessage, logusername, logpassword }) => {
    return React.createElement('html', { lang: 'en' },
      React.createElement('head', null,
        React.createElement('meta', { charSet: 'UTF-8' }),
        React.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
        React.createElement('title', null, 'Login'),
        React.createElement('link', {
          href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
          rel: 'stylesheet',
          integrity: 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN',
          crossOrigin: 'anonymous'
        }),
        React.createElement('link', { rel: 'stylesheet', href: '/css/login.css' })
      ),
      React.createElement('body', null,
        React.createElement('div', { className: 'wrappper' },
          React.createElement('div', { className: 'loginContainer' },
            React.createElement('h1', null, 'Login'),
            React.createElement('form', { method: 'post' },
              React.createElement('p', { className: 'errorMessage' }, errorMessage),
              React.createElement('input', {
                type: 'text',
                name: 'logusername',
                placeholder: 'Username or Email',
                value: logusername,
                required: ''
              }),
              React.createElement('input', {
                id: 'password',
                type: 'password',
                name: 'logpassword',
                placeholder: 'Password',
                required: ''
              }),
              React.createElement('input', { type: 'submit', value: 'Login' })
            ),
            React.createElement('a', { href: '/register' }, 'Need an account? Register here.')
          )
        ),
        React.createElement('script', {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
          integrity: 'sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL',
          crossOrigin: 'anonymous'
        })
      )
    );
  };
  
app.use(bodyParser.urlencoded({extended:false}));
router.get("/",(req,res,next)=>{
    const errorMessage = ''; // Provide appropriate initial data
  const logusername = ''; // Provide appropriate initial data
  const logpassword = ''; // Provide appropriate initial data

  // Render the React component to a string
  const reactComponent = ReactDOMServer.renderToString(
    React.createElement(LoginComponent, { errorMessage, logusername, logpassword })
  );

  // Send the HTML with the rendered React component
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
      </head>
      <body>
        ${reactComponent}
      </body>
    </html>
  `);
})
router.post("/",async(req,res,next)=>{
    var payload = req.body
    if(req.body.logusername && req.body.logpassword){
        var user = await User.findOne({
            $or:[{username:req.body.logusername},{email:req.body.logusername}]
        })
        .catch((error)=>{
            console.log(error)
            payload.errorMessage ="Something went wrong";
            res.status(200).render("login",payload);
        })
        if(user!=null){
           var result = await bcrypt.compare(req.body.logpassword,user.password);
           if(result===true){
            req.session.user=user;
            return res.redirect("/");
           }
           payload.errorMessage ="Login Credentials Incorrect";
        res.status(200).render("login",payload);
           
        }
    }
    payload.errorMessage ="Check every field once again";
    res.status(200).render("login",payload);
})
module.exports = router;
