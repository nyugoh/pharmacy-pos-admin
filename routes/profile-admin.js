const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const User = require('../models/user-model');
const Message = require('../models/Messages');
const Update = require('../models/Updates');
const url = process.env.DB_MLAB;

// Middleware ~ check if user is logged in and is admin.
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    res.redirect('/users/login');
  }else {
    next();
  }
}

function isSuperAdmin(req, res, next) {
  if(req.user.isSuperAdmin)
    next();
  else
    res.status(404).json({status: "You are not allowed to perform this action."})
}

// Handle get requests with /admin/*
router.get('/',isLoggedIn,(req,res)=>{
  User.find({$or:[{isAdmin:{$exists: false}}, {isAdmin:false}]}).then(users =>{
    Message.find({}).sort({'createdAt':-1}).then(messages =>{
      res.render('admin/admin', {admin:req.user, users,messages, total:users.length});
    }).catch(error =>{
      res.send(error.message);
    });
  }).catch(error =>{
    res.send(error.message);
  });
});

router.get('/messages', isLoggedIn, (req,res)=>{
  Message.find({}).sort({'createdAt':-1}).then(messages =>{
    res.render('admin/messages', {admin:req.user, messages,total:messages.length});
  }).catch(error =>{
    res.send(error.message);
  });
});

router.get('/updates', isLoggedIn, (req,res)=>{
  Update.find({}).sort({'createdAt':-1}).then(updates =>{
    Message.find().sort({'createdAt':-1}).then(messages =>{
      res.render('admin/updates', {admin:req.user,messages, updates});
    }).catch(error =>{
      res.send(error.message);
    });
  }).catch(error =>{
    res.send(error.message);
  });
});

router.get('/users/pharmacy', isLoggedIn, (req,res)=>{
  let total = 0;
  let perPage = 10;
  let skip = 0;
  let page = 1;
  var order = -1;
  let sort = {};
  if (req.query.perPage && req.query.page && req.query.sortBy){
    perPage = req.query.perPage;
    page = req.query.page;
    sort[req.query.sortBy] = -1;
  } else {
    sort['createdAt'] = -1;
  }
  skip = (page-1)*perPage;

  User.find({$and:[{$or:[{isPharmacy: {$exists: false}},{isPharmacy: true}]},{$or:[{isAdmin:{$exists: false}}, {isAdmin:false}]}]}).then(users =>{
    total = users.length;
    User.find({$and:[{$or:[{isPharmacy: {$exists: false}},{isPharmacy: true}]},{$or:[{isAdmin:{$exists: false}}, {isAdmin:false}]}]}).sort(sort).skip(parseInt(skip)).limit(parseInt(perPage)).then(users =>{
      Message.find({}).sort({'createdAt':-1}).then(messages =>{
        res.render('admin/pharmacy/users', {admin:req.user, users,messages, total:total});
      }).catch(error =>{
        res.send(error.message);
      });
    }).catch(error =>{
      res.send(error.message);
    });
  }).catch( error =>{
    res.send(error.message);
  });
});

router.get('/users/biashara', isLoggedIn, (req,res)=>{
  let total = 0;
  let perPage = 10;
  let skip = 0;
  let page = 1;
  var order = -1;
  let sort = {};
  if (req.query.perPage && req.query.page && req.query.sortBy){
    perPage = req.query.perPage;
    page = req.query.page;
    sort[req.query.sortBy] = -1;
  } else {
    sort['createdAt'] = -1;
  }
  skip = (page-1)*perPage;

  User.find({$and:[{isBiashara: true},{$or:[{isAdmin:{$exists: false}}, {isAdmin:false}]}]}).then(users =>{
    total = users.length;
    User.find({$and:[{isBiashara: true},{$or:[{isAdmin:{$exists: false}}, {isAdmin:false}]}]}).sort(sort).skip(parseInt(skip)).limit(parseInt(perPage)).then(users =>{
      Message.find({}).sort({'createdAt':-1}).then(messages =>{
        res.render('admin/biashara/users', {admin:req.user, users,messages, total:total});
      }).catch(error =>{
        res.send(error.message);
      });
    }).catch(error =>{
      res.send(error.message);
    });
  }).catch( error =>{
    res.send(error.message);
  });
});

router.get('/subscriptions/pharmacy', isLoggedIn, (req, res) =>{
  let total = 0;
  let perPage = 10;
  let skip = 0;
  let page = 1;
  if (req.query.perPage && req.query.page){
    perPage = req.query.perPage;
    page = req.query.page;
  }
  skip = (page-1)*perPage;

  User.find({$and:[{$or:[{isPharmacy: {$exists: false}},{isPharmacy: true}]},{$or:[{isAdmin:{$exists: false}}, {isAdmin:false}]}]}).sort({'createdAt':-1}).then(users =>{
    total = users.length;
    User.find({$and:[{$or:[{isPharmacy: {$exists: false}},{isPharmacy: true}]},{$or:[{isAdmin:{$exists: false}}, {isAdmin:false}]}]}).sort({'createdAt':-1}).skip(parseInt(skip)).limit(parseInt(perPage)).then(users =>{
      Message.find({}).sort({'createdAt':-1}).then(messages =>{
        res.render('admin/pharmacy/subscription', {admin:req.user, users,messages,total:total});
      }).catch(error =>{
        res.send(error.message);
      });
    }).catch(error =>{
      res.send(error.message);
    });
  }).catch(error =>{
    res.send(error.message);
  });
});

router.get('/subscriptions/biashara', isLoggedIn, (req, res) =>{
  let total = 0;
  let perPage = 10;
  let skip = 0;
  let page = 1;
  if (req.query.perPage && req.query.page){
    perPage = req.query.perPage;
    page = req.query.page;
  }
  skip = (page-1)*perPage;

  User.find({$and:[{isBiashara: true},{$or:[{isAdmin:{$exists: false}}, {isAdmin:false}]}]}).sort({'createdAt':-1}).then(users =>{
    total = users.length;
    User.find({$and:[{isBiashara: true},{$or:[{isAdmin:{$exists: false}}, {isAdmin:false}]}]}).sort({'createdAt':-1}).skip(parseInt(skip)).limit(parseInt(perPage)).then(users =>{
      Message.find({}).sort({'createdAt':-1}).then(messages =>{
        res.render('admin/biashara/subscriptions', {admin:req.user, users,messages,total:total});
      }).catch(error =>{
        res.send(error.message);
      });
    }).catch(error =>{
      res.send(error.message);
    });
  }).catch(error =>{
    res.send(error.message);
  });
});

router.get('/admins', isLoggedIn, (req, res) =>{
  User.find({isAdmin: true}).sort({'createdAt':-1}).then(users =>{
    Message.find({}).sort({'createdAt':-1}).then(messages =>{
      res.render('admin/super-admin', {admin:req.user,messages, admins:users});
    }).catch(error =>{
      res.send(error.message);
    });
  }).catch(error =>{
    res.send(error.message);
  });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/users/login');
});

router.get('/*', isLoggedIn, (req,res)=>{ // Wildcard route for insane people :)
  res.render('admin', {admin:req.user});
});


// Handle POST and UPDATE request to /admin/*
router.post('/:userId/activate', isLoggedIn, (req, res) =>{
  if(req.body) {
    MongoClient.connect(url).then(client =>{
      let db = client.db('pharmacy-pos');
      db.collection('users').update(
        {_id:ObjectId(req.params.userId)},
        {$push:{subscriptions: req.body}}).then( ()=>{
        res.json({status:'ok'});
      }).catch(error => {
        res.status(404).json({message:error.message});
      });
      client.close();
    }).catch( error => {
     res.status(404).json({message:error.message});
    });
  } else {
    res.status(404).json({message:"Send a valid body"});
  }
});


router.post('/:userId/deactivate', isLoggedIn, (req, res) =>{
  if(req.body) {
    MongoClient.connect(url).then(client =>{
      let db = client.db('pharmacy-pos');
      db.collection('users').update(
        {_id:ObjectId(req.params.userId)},
        {$set:{subscriptions: req.body}}).then( ()=>{
        res.json({status:'ok'});
      }).catch(error => {
        res.status(404).json({message:error.message});
      });
      client.close();
    }).catch( error => {
      res.status(404).json({message:error.message});
    });
  } else {
    res.status(404).json({message:"Send a valid body"});
  }
});
router.post('/:id/messages', isLoggedIn, (req, res) =>{
  if(req.body) {
    MongoClient.connect(url).then(client =>{
      let db = client.db('pharmacy-pos');
      db.collection('messages').update(
        {_id:ObjectId(req.params.messageId)},
        {$set:{isRead: req.body.status}}).then( ()=>{
        res.json({status:'ok'});
      }).catch(error => {
        res.status(404).json({message:error.message});
      });
      client.close();
    }).catch( error => {
      res.status(404).json({message:error.message});
    });
  } else {
    res.status(404).json({message:"Send a valid body"});
  }
});

router.post('/register', isLoggedIn, isSuperAdmin, (req, res) =>{
  let data = req.body;
  if(data) {
    if (!data.username || !data.password || !data.email || !data.passwordAgain)
      res.status(404).json({status: 'All the field are required.'});
    else {
     if (data.password !== data.passwordAgain)
       res.status(404).json({status: "Passwords don't match"});
     else if (!data.admin && !data.superAdmin){
       res.status(404).json({status: 'Please set at least one role.'})
     } else {
       var user = new User({
         username: data.username,
         email: data.email,
         password: data.password,
         isAdmin: data.superAdmin ? data.superAdmin: data.admin,
         isSuperAdmin: data.superAdmin,
         active: true
       });
       User.createUser(user, function (error, user) {
         if (error)
           res.status(404).json({status: error.message});
         else
           res.json({status: 'Added successfully.'});

       });
     }
    }
  } else {
    res.status(404).json({message:"Send a valid body"});
  }
});

router.post('/updates', isLoggedIn, (req, res)=>{
  if(req.body){
    let {date, body, title, isPharmacy, isBiashara} = req.body;
    if(!date || !body || !title ) {
      res.status(404).json({status: 'All fields are required'});
      if (!isBiashara && !isPharmacy)
        res.status(404).json({status: 'Set category field'});
    } else {
      let update = new Update({date, body, title, isBiashara, isPharmacy});
      update.save().then(update =>{
        res.json({status: 'ok'});
      }).catch(error =>{
        res.status(404).json({status: error.message});
      })
    }
  } else {
    res.status(404).json({status: "Provide a body"});
  }
});

router.delete('/:userId/delete', isLoggedIn, isSuperAdmin, (req, res) =>{
  MongoClient.connect(url).then(client =>{
    let db = client.db('pharmacy-pos');
    db.collection('users').deleteOne({_id:ObjectId(req.params.userId)}).then( ()=>{
      res.json({status:'ok'});
    }).catch(error => {
      res.status(404).json({message:error.message});
    });
    client.close();
  }).catch( error => {
    res.status(404).json({message:error.message});
  });
});

router.delete('/:userId/:collection', isLoggedIn, (req, res) =>{
  MongoClient.connect(url).then(client =>{
    let db = client.db('pharmacy-pos');
    db.collection(req.params.collection).deleteOne({_id:ObjectId(req.params.userId)}).then( ()=>{
      res.json({status:'ok'});
    }).catch(error => {
      res.status(404).json({message:error.message});
    });
    client.close();
  }).catch( error => {
    res.status(404).json({message:error.message});
  });
});

router.put('/:userId/updates', isLoggedIn, (req, res) =>{
  MongoClient.connect(url).then(client =>{
    let db = client.db('pharmacy-pos');
    db.collection('updates').deleteOne({_id:ObjectId(req.params.userId)}).then( ()=>{
      res.json({status:'ok'});
    }).catch(error => {
      res.status(404).json({message:error.message});
    });
    client.close();
  }).catch( error => {
    res.status(404).json({message:error.message});
  });
});

module.exports= router;
