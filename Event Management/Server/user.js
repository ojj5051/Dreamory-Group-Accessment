const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const schema = require("./userSchema");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://ojj5051:998693@cluster0.9ind0zv.mongodb.net/eventplatform?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    app.listen(3001, () => {
      console.log(`Server running at http://localhost:${3001}`)
      })
  })
  .catch( error => {
    console.log(error)
  });

// Get All User Data
app.get('/users', async (req, res) => {
    await schema.find({})
    .then(event => res.json(event))
    .catch(err => res.json(err))
})

// Get specific User Data
app.post('/users/findSpecific', async (req, res) => {
  const findUserEmail = req.body.email;

  await schema.findOne( { email: findUserEmail } )
  .then(event => res.json(event))
  .catch(err => res.json(err))
})

// Create New User Data
app.post('/users/signup', async (req, res) => {
  const newEvent = new schema(req.body);

  // Check duplicate
  const isNewUser = await schema.isThisEmailInUse(req.body.email)
  if(!isNewUser) return res.json("Duplicate")

  await newEvent.save()
  .then(res.status(201).json("Success"))
  .catch((err) => {
    console.log(err)
  })
})

// Login User
app.post('/users/signin', async (req, res) => {
  const {email, password} = req.body;

  await schema.findOne({email: email})
  .then(user => {
    if(user) {
      if(user.password === password) {
        res.json("0")
      } else {
        res.json("1")
      }
    }
    else {
      res.json("2")
    }
  })
  .catch((err) => {
    res.json(err)
  })
})

// Update Existing User Data
app.put('/users/:email', async (req, res) => {
  const userEmail = req.params.email;

  const result = await schema.updateOne( {email: userEmail}, req.body )
  .then(res.send(req.body))
  .catch((err) => {
      console.log(err)
  })

  console.log(result)
});

// Delete User Data
app.delete('/users/:id', async (req, res) => {
  const eventId = req.params.id;

  const result = await schema.deleteOne( {_id: eventId} )
  .then(res.send(req.body))
  .catch((err) => {
      console.log(err)
  })

  console.log(result)
});