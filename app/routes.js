const ObjectId = require("mongodb").ObjectId

module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      let movies =[
        { movieTitle: 'Top Gun', director: 'Tony Scott', src: 'topGun.png' },
        { movieTitle: 'Senior Year', director: 'Alex Harcastle', src: 'seniorYear.png' },
        { movieTitle: 'Jackass 4.5', director: 'Jeff Tremaine', src: 'jackass.png' },
        { movieTitle: 'A Perfect Pairing', director: 'Stuart McDonald', src: 'aPerfectPairing.png' },
        { movieTitle: 'Disappearance At Clifton Hill', director: 'Albert Shin', src: 'disappearance.png' },
        { movieTitle: ' RRR', director: 'S. S. Rajamouli', src: 'rrr.png' }

      ];
    
  
      db.collection('savedList').find().toArray((err1,savedmovies)=>{
        db.collection('users').find().toArray((err2, result) => {
          if (err2) return console.log(err2)
          res.render('profile.ejs', {
            user : req.user,
            movies: movies,
            savedmovies: savedmovies
          })
        })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/saveMovie', (req, res) => {
      db.collection('savedList').insertOne({movieTitle: req.body.movieTitle, director: req.body.director, moviePoster: req.body.moviePoster}, 
        (err, result) => {
        if (err) return console.log(err)
        res.send({})
      })
    })

    app.put('/messages', (req, res) => {
      db.collection('messages')
      .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
        $set: {
          thumbUp:req.body.thumbUp + 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.delete('/deleteSave', (req, res) => {
      db.collection('savedList').findOneAndDelete({_id: ObjectId(req.body.movieId)},
        function(err, result){
        if(err) return res.send(500, err)
        res.send(result)
      })

    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
