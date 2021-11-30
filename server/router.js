const express = require("express");
const router = express.Router();
const { Todos } = require("./dbConnection"); //(võtab andmeid serverist)
const authRoutes = require("./authenticate.router");

router.use("/auth", authRoutes);

router.get("/calc", function (req, res) {
  const a = 4;
  const b = 4;
  const result = a + b;
  res.send({ result });
});

// ENDPOINdid
// request === req ja response === res
//async -asünkroonne meetod, vt https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
router.get("/get-todos", async function (request, response) {
  // const result = Todos.find(); otsib kõik kirjed mongoosi adnmebaasist
  const result = await Todos.find(); 
  console.log(result);
  response.send(result);
});

// Delete
router.get("/delete-todo/:id", async function (request, response) {
  await Todos.deleteOne({ _id: request.params.id }); //(const resulti võib ära kustutada)
  console.log("Deleting todo..");
  response.send({});
});
  

// Mark Complete -Update status ja set määra uus väärtuse parameeter
  router.post("/update-todo/:id", async function (request, response) {
     // { status: 'COMPLETE'} või { status: 'ACTIVE'}
  console.log(request.body);
  await Todos.updateOne({ _id: request.params.id },{ $set: { status: request.body.status } }
  );
  console.log("Updating todo..");
  response.send({});
});

//otsib id põhiselt andmebaasist ja tagastab
router.get("/get-todo/:id", async function (request, response) {
  const result = await Todos.findOne({ _id: request.params.id }); //findOne annab esimese vaste, mis leiab? aga id peaks selle ära defineerima?
  console.log(result);
  response.send(result);
});

router.post("/add-todo", async function (request, response) {
  if (request.body.title) { /*see määrab ära, et ei saaks lisada tühja infot (request.body), ehk if.. title (tegevus) on tõene*/
    await Todos.create(request.body); //create ainult loomisekls, olemas update one, update many... request body on title ja status
    console.log("Lisa todo");
  }
  response.send("done");
});

 module.exports = router;