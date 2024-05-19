"use client";

import { usePathname } from "next/navigation";

import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Button,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

import { Link } from "@nextui-org/react";

export default function TranscriptTable({ data }) {
  // list all courses
  const courses = Array.from(
    new Set(
      data.map((d) =>
        d.courses
          .map((c) => {
            return { name: c.name, code: c.code };
          })
          .flat()
      )
    )
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableColumn>Student ID</TableColumn>
          <TableColumn>Name</TableColumn>
          {courses.map((c, i) => (
            <TableColumn key={i}>{c.code}</TableColumn>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((d, i) => (
          <TableRow key={i}>
            <TableCell>{d.nim}</TableCell>
            <TableCell>{d.name}</TableCell>
            {courses.map((c, j) => {
              const course = d.courses.find((c) => c.code === c.code);
              return (
                <TableCell key={j}>{course ? course.grade : "-"}</TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
