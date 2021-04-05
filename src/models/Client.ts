import { Schema, model } from "mongoose";

const clientSchema = new Schema({
  userid: {
    type: String,
    required: true,
  },

  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  birth_year: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  is_retired: {
    type: String,
    required: true,
  },
  retirement_age: {
    type: Number,
    required: true,
  },
  access: {
    type: [String],
  },
  created: {
    type: String,
    required: true,
  },
  modified: {
    type: String,
    required: true,
  },
  advisor: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = model("client", clientSchema);

export default User;
