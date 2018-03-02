const router = require('express').Router();
//const express = require('express');
const assert = require ('assert');
const User = require('../models/user-model');
const Admin = require('../models/admin-model');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var url = 'https://api.mlab.com/api/1/databases/pharmacy-pos/collections/users?apiKey=dI9gXrgAznHkTgvdNOqCp_WKAwZD2KON';




//Admin Get LocalStrategy-signup
router.get('/admin-register', function(req, res){
  res.render('admin-register');
});

//Admin logout
router.get('/admin/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//Admin Post LocalStrategy-signup
router.post('/admin-register', passport.authenticate('local-admin', {
  successRedirect: '',
  failureRedirect: '/',
  failureFlash: true
}));

//Admin Get LocalStrategy
router.get('/profile/login-admin', function(req, res){
  res.render('login-admin', { message: req.flash('loginMessage') });
});

//Admin Post LocalStrategy
router.post('/profile/login-admin', passport.authenticate('admin-login', {
  successRedirect: '/admin',
  failureRedirect: '/',
 failureFlash: true
}));




//messages
router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  mongoose.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('User').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('admin', {items: resultArray});
    });
  });
});

module.exports = router;