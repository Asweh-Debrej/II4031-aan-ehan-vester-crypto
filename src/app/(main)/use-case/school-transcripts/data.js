"use server";

import { example } from "./mock";

import db, { connect } from "@lib/db";

import Student from "@/models/model";
import _ from "lodash";

const onError = (e) => {
  console.error(e);
  return { ok: false, message: e.message };
};

export const getData = async (options) => {
  let message = "Data fetched successfully";
  let data;

  const { codeFilter = "", page = 1, itemsPerPage = 10 } = options || {};

  try {
    if (!db.connection.readyState) {
      await connect();
    }

    // stop if the connection is not open
    if (db.connection.readyState !== 1) {
      throw new Error("Database connection is not open");
    }

    const students = await Student.find({ nim: { $regex: codeFilter } })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort({ _id: -1 });

    if (!students) {
      throw new Error("Data not found");
    }

    const total = await Student.countDocuments({ nim: { $regex: codeFilter } });

    data = { students: JSON.parse(JSON.stringify(students)), total };

    // return { data: students, ok: !error, message: error || message, total };
    return { data, ok: true, message };
  } catch (e) {
    return onError(e);
  }
};

export const addData = async (data) => {
  let message = "data added successfully";
  let body;

  try {
    if (!db.connection.readyState) {
      await connect();
    }

    // stop if the connection is not open
    if (db.connection.readyState !== 1) {
      throw new Error("Database connection is not open");
    }

    const student = new Student(data);
    await student.save();

    body = JSON.parse(JSON.stringify(student.toObject()));

    return { data: body, ok: true, message };
  } catch (e) {
    return onError(e);
  }
};
