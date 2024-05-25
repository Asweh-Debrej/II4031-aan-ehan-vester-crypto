"use server";

import { example } from "./mock";

export const getData = async (codeFilter = "", page = 1) => {
  return example.filter((student) => {
    return student.courses.some((course) => course.code.includes(codeFilter));
  }).slice((page - 1) * 10, page * 10);
}
