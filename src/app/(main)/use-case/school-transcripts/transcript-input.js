"use client";

import { useState } from "react";

import {
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";

const grades = ["A", "B", "C", "D", "E", "F"];

const defaultCourseData = {
  code: "",
  name: "",
  grade: "",
  credit: 0,
};

export default function TranscriptInput({ onSubmit }) {
  const [data, setData] = useState({
    nim: "",
    name: "",
    courses: [...Array(10)].map((_) => ({ ...defaultCourseData })),
  });

  const onSubmitHandler = () => {
    if (!data.nim || !data.name) {
      alert("Student ID and Student Name are required");
      return;
    }

    let courses = [];
    let coursesCount = 0;
    for (let i = 0; i < data.courses.length; i++) {
      const course = data.courses[i];
      if (course.code && course.name && course.grade && course.credit) {
        courses.push(course);
        coursesCount++;
      }
    }

    if (coursesCount === 0) {
      alert("At least one course is required");
      return;
    }

    onSubmit({ ...data, courses });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-row w-full gap-4 mb-8">
        <Input
          label="Student ID"
          type="text"
          className="w-[200px]"
          onValueChange={(val) => setData({ ...data, nim: val })}
        />
        <Input
          label="Student Name"
          type="text"
          className="w-[200px]"
          onValueChange={(val) => setData({ ...data, name: val })}
        />
      </div>
      <p className="text-warning font-bold">
        any incomplete or invalid row will be replaced with a dash (-) for each
        field
      </p>
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex flex-row mx-auto gap-4 items-center">
          <p className="mr-8 w-[120px]">Course {i + 1}:</p>
          <Input
            label="Code"
            type="text"
            className="w-[200px]"
            size="sm"
            onValueChange={(val) => {
              const courses = [...data.courses];
              courses[i].code = val;
              setData({ ...data, courses });
            }}
          />
          <Input
            label="Name"
            type="text"
            className="w-[200px]"
            size="sm"
            onValueChange={(val) => {
              const courses = [...data.courses];
              courses[i].name = val;
              setData({ ...data, courses });
            }}
          />
          {/* <Input
            label="Grade"
            type="text"
            className="w-[200px]"
            size="sm"
            onValueChange={(val) => {
              const courses = [...data.courses];
              courses[i].grade = val;
              setData({ ...data, courses });
            }}
          /> */}
          <Autocomplete
            label="Grade"
            className="w-[200px]"
            size="sm"
            onSelectionChange={(val) => {
              const courses = [...data.courses];
              courses[i].grade = val;
              setData({ ...data, courses });
            }}
            onKeyDown={(e) => e.continuePropagation()}
            items={grades}>
            {grades.map((grade) => (
              <AutocompleteItem key={grade} value={grade}>
                {grade}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Input
            label="Credit"
            type="number"
            className="w-[200px]"
            size="sm"
            defaultValue="0"
            onValueChange={(val) => {
              const courses = [...data.courses];
              courses[i].credit = parseInt(val);
              setData({ ...data, courses });
            }}
          />
        </div>
      ))}
      <div className="flex flex-row gap-4 ml-auto items-center">
        <p className="text-success font-bold">
          the data will not be submitted to the server yet
        </p>
        <Button
          auto
          type="submit"
          color="primary"
          onClick={onSubmitHandler}
          className="w-[100px]">
          Create
        </Button>
      </div>
    </div>
  );
}
