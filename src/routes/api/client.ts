import { Request, Response, Router } from "express";
import IUser from "../../interfaces/IUser";
import Client from "../../models/Client";

const router = Router();

//create client based on user id
router.post("/", async (req, res) => {
  const {
    fname,
    lname,
    birth_year,
    gender,
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
      name: fname + " " + lname,
      birth_year,
      userid,
      gender,
      is_retired,
      retirement_age,
      access,

      created,
      modified,
      advisor,
    });
    newClient.save();
    res.status(200).json({ data: newClient, msg: "Client created" });
  } catch (err) {
    console.log(err);
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
