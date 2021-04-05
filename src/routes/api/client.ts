import { Request, Response, Router } from "express";
import IUser from "../../interfaces/IUser";
import Client from "../../models/Client";

const router = Router();

//create client based on user id
router.post("/", async (req, res) => {
  const {
    fname,
    lname,
    email,
    phone,
    mobile,
    address,
    birth_year,
    gender,
    notes,
    userid,
    is_retired,
    retirement_age,
    access,
    created,
    modified,
    advisor,
  } = req.body;

  try {
    const newClient = new Client({
      fname,
      lname,
      email,
      phone,
      mobile,
      address,
      name: fname + " " + lname,
      birth_year,
      userid,
      gender,
      notes,
      is_retired,
      retirement_age,
      access,
      created,
      modified,
      advisor,
    });
    await newClient.save();

    res.status(200).json({ data: newClient, msg: "Client created" });
  } catch (err) {
    console.log(err);
  }
});

router.patch("/", async (req, res) => {
  try {
    const response = await Client.findByIdAndUpdate(req.body._id, { $set: { notes: req.body.notes } });
    console.log(req.body.notes);
    res.status(200).json(response);
  } catch (err) {
    res.send(err);
  }
});

//get all clients by user id
router.get("/:userid", async (req, res) => {
  try {
    const foundClients = await Client.find({ userid: req.params.userid });
    res.status(200).send(foundClients);
  } catch (err) {
    console.log(err);
  }
});

//get client by id
router.get("/:id", async (req, res) => {
  const clientId = req.params.id;

  const foundClient = await Client.findOne({ _id: clientId });

  res.send(foundClient);
});

//delete client by id
router.delete("/:clientid", async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.clientid);
    res.status(200).send("Successfully Deleted");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
