const express = require('express');
const app = express();
const passport = require('passport');
const { isLoggedIn } = require("./middleware.js");
require('./passport-auth.js');

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }
    ));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/google/failure'
    })
);

app.get('/profile', isLoggedIn, (req, res) => {
    res.render("profile.ejs",
        {
            title: "Profile",
            id: req.user.id,
            firstName: req.user.name.givenName,
            lastName: req.user.name.familyName,
            name: req.user.displayName,
            profilePicture: req.user.picture,
            email: req.user.emails[0].value
        });
});

app.get('/logout', function (req, res) {
    req.logout(function (err) {
        if (err) {
            console.log('Logout error:', err);
            res.status(500).send('Logout failed');
        } else {
            req.session.destroy();
            res.redirect('/');
        }
    });
});

app.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
});

app.listen(8080, () => console.log('listening on port: 8080'));