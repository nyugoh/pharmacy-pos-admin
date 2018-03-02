const router = require('express').Router();

//  isLoggedIn function
function isLoggedIn(req, res, next) {
  req.admin = req.app.locals.admin;
  
  if (!req.admin) {
    res.redirect('/');
  }else {
    next();
  }
}

// Admin home route
  router.get('/',isLoggedIn,(req,res)=>{
    res.render('admin',{admin:req.admin});
  });


  //Admin messages
  router.get('/admin-messages',isLoggedIn,(req,res)=>{
    res.render('admin-messages',{admin:req.admin});
  });

  //Admin Updates
  router.get('/admin-updates',isLoggedIn,(req,res)=>{
    res.render('admin-updates',{admin:req.admin});
  });

  //Admin Users control-panel
  router.get('/admin-users',isLoggedIn,(req,res)=>{
    res.render('admin-users',{admin:req.admin});
  });


module.exports= router;