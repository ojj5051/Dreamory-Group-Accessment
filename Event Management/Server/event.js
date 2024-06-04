const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const schema = require("./eventSchema");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://ojj5051:998693@cluster0.9ind0zv.mongodb.net/eventplatform?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    app.listen(4001, () => {
      console.log(`Server running at http://localhost:${4001}`)
      })
  })
  .catch( error => {
    console.log(error)
  });

// Get All Events Data
app.get('/events', async (req, res) => {
    await schema.find({})
    .then(event => res.json(event))
    .catch(err => res.json(err))
})

// Get Data by Completion
app.post('/events/findCompletion', async (req, res) => {
  const findCompletion = req.body.completion;

  await schema.find( { completion: new RegExp(findCompletion) } )
  .then(event => res.json(event))
  .catch(err => res.json(err))
})

app.post('/events/findEvent', async (req, res) => {
  const findEventName = req.body.eventName;

  await schema.find( { eventName: { $regex: findEventName, $options: "i" } } )
  .then(event => res.json(event))
  .catch(err => res.json(err))
})

// Get Data by ID
app.post('/events/findID', async (req, res) => {
  const findEventID = req.body._id;

  await schema.find( { _id: findEventID } )
  .then(event => res.json(event))
  .catch(err => res.json(err))
})

// Create New Events Data
app.post('/events/newEvents', async (req, res) => {
  const newEvent = new schema(req.body);

  //Check duplicate
  const isNewEvent = await schema.isThisEmailInUse(req.body.eventName)
  if(!isNewEvent) return res.json("Duplicate")

  await newEvent.save()
  .then(res.status(201).json("Success"))
  .catch((err) => {
    console.log(err)
  })
})

// Update Existing Data
app.put('/events/:id', async (req, res) => {
  const eventId = req.params.id;

  const result = await schema.updateOne( {_id: eventId}, req.body )
  .then(res.send(req.body))
  .catch((err) => {
      console.log(err)
  })

  console.log(result)
});

// Delete Single Event Data
app.delete('/events/delete/:id', async (req, res) => {
  const eventId = req.params.id;

  const result = await schema.deleteOne( {_id: eventId} )
  .then(res.send(req.body))
  .catch((err) => {
      console.log(err)
  })

  console.log(result)
});

// Delete Multiple Event Data
app.delete('/events/deleteMany/:id', async (req, res) => {
  const eventId = req.params.id;
  console.log(eventId)

  const result = await schema.deleteMany( {_id: { $in: [ eventId ] }} )
  .then(res.send(req.body))
  .catch((err) => {
      console.log(err)
  })

  console.log(result)
});