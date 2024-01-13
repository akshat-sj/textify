const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../schemas/user")
const bodyparser = require("body-parser");
const React = require('react');
const ReactDOMServer = require('react-dom/server');
app.use(bodyparser.urlencoded({extended:false}));
const RegisterComponent = ({ errorMessage, firstname, lastname, username, email }) => {
    return React.createElement(
      'html',
      { lang: 'en' },
      React.createElement('head', null,
        React.createElement('meta', { charSet: 'UTF-8' }),
        React.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
        React.createElement('title', null, 'Register'),
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
            React.createElement('h1', null, 'Register'),
            React.createElement('form', {
              id: 'registerform',
              method: 'post',
              onSubmit: (event) => {
                event.preventDefault();
                validateForm();
              }
            },
              React.createElement('p', { className: 'errorMessage' }, errorMessage),
              React.createElement('input', {
                type: 'text',
                name: 'firstname',
                placeholder: 'First Name',
                value: firstname,
                required: ''
              }),
              React.createElement('input', {
                type: 'text',
                name: 'lastname',
                placeholder: 'Last Name',
                value: lastname,
                required: ''
              }),
              React.createElement('input', {
                type: 'text',
                name: 'username',
                placeholder: 'User Name',
                value: username,
                required: ''
              }),
              React.createElement('input', {
                type: 'email',
                name: 'email',
                placeholder: 'Email',
                value: email,
                required: ''
              }),
              React.createElement('input', {
                id: 'password',
                type: 'password',
                name: 'password',
                placeholder: 'Password',
                required: ''
              }),
              React.createElement('input', {
                id: 'passwordconf',
                type: 'password',
                name: 'passwordconf',
                placeholder: 'Confirm Password',
                required: ''
              }),
              React.createElement('input', { type: 'submit', value: 'Register' })
            ),
            React.createElement('a', { href: '/login' }, 'Need an account? Login here.')
          )
        ),
        React.createElement('script', null, `
          var passwordfield = document.getElementById("password");
          var passwordconffield = document.getElementById("passwordconf");
          var form = document.getElementById("registerform");
          function validateForm() {
            if (passwordfield.value !== passwordconffield.value) {
              alert("Passwords do not match");
            } else {
              form.submit();
            }
          }
        `),
        React.createElement('script', {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
          integrity: 'sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL',
          crossOrigin: 'anonymous'
        })
      )
    );
  };
router.get("/",(req,res,next)=>{
    const errorMessage = ''; // Provide appropriate initial data
  const firstname = ''; // Provide appropriate initial data
  const lastname = ''; // Provide appropriate initial data
  const username = ''; // Provide appropriate initial data
  const email = ''; // Provide appropriate initial data

  // Render the React component to a string
  const reactComponent = ReactDOMServer.renderToString(
    React.createElement(RegisterComponent, { errorMessage, firstname, lastname, username, email })
  );

  // Send the HTML with the rendered React component
  res.status(200).send(reactComponent);
})
router.post("/",async(req,res,next)=>{
    var firstname= req.body.firstname.trim();
    var lastname= req.body.lastname.trim();
    var username= req.body.username.trim();
    var email= req.body.email.trim();
    var password= req.body.password;
    var payload = req.body;

    if(firstname && lastname && username && email && password){
        var user = await User.findOne({
            $or:[{username:username},{email:email}]
        })
        .catch((error)=>{
            console.log("error")
            payload.errorMessage ="Something went wrong";
            res.status(200).render("register",payload);
        })
        if(user==null){
            var data = req.body;
            data.password = await bcrypt.hash(password,10)
            User.create(data)
            .then((user)=>{
               req.session.user=user;
               return res.redirect("/");
            })
        }else{
            if(email==user.email){
                payload.errorMessage ="Email already in use"; 
            }else{
                payload.errorMessage ="Username already in use"; 
            }
            res.status(200).render("register",payload);
        }
    }else{
        payload.errorMessage ="Make sure each field has valid value";
    res.status(200).render("register",payload);
    }
})
module.exports = router;
