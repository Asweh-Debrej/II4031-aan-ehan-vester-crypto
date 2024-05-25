"use client";

import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Button,
  DropdownTrigger,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

export default function TranscriptTable({
  data,
  includeHash = false,
  includeRSA = false,
  includeRC4 = false,
  isLoading = false,
  selectionMode = false,
  onSelect = (selectedData) => {},
}) {
  console.log([...Array(10)].map((_, i) => i));

  const tableColumns = [
    [
      includeHash && { name: "Hash", key: "hash" },
      includeRSA && { name: "RSA Public E", key: "rsaPublicE" },
      includeRSA && { name: "RSA Public N", key: "rsaPublicN" },
      includeRC4 && { name: "RC4 Key", key: "rc4Key" },
    ].filter(Boolean),
    {
      name: "Student ID",
      key: "nim",
      className: "w-[100px]",
    },
    { name: "Name", key: "name", className: "w-[200px]" },
    ...[...Array(10)].map((_, i) => {
      return [
        { name: `Course code ${i + 1}`, key: `courses[${i}].code` },
        { name: `Course name`, key: `courses[${i}].name` },
        { name: `Grade`, key: `courses[${i}].grade` },
        { name: `Credit`, key: `courses[${i}].credit` },
      ];
    }),
  ].flat();

  const handleSelect = ([id]) => {
    const selectedData = data.find((student) => student.nim === id);
    onSelect(selectedData);
  };

  // assume there are 10 courses at most per student
  const RenderStudent = (student) => {
    return (
      <TableRow key={student.nim}>
        {[
          includeHash && (
            <TableCell>
              <p className="w-[200px] break-all break-words">{student.hash}</p>
            </TableCell>
          ),
          includeRSA && [
            <TableCell key={`rsaPublicE`}>
              <p className="w-[200px] break-all break-words">{student.rsaPublicE}</p>
            </TableCell>,
            <TableCell key={`rsaPublicN`}>
              <p className="w-[200px] break-all break-words">{student.rsaPublicN}</p>
            </TableCell>,
          ],
          includeRC4 && (
            <TableCell>
              <p className="w-[200px] break-all break-words">{student.rc4Key}</p>
            </TableCell>
          ),
        ].filter(Boolean)}
        <TableCell>
          <p className="w-[200px] break-all break-words">{student.nim}</p>
        </TableCell>
        <TableCell>
          <p className="w-[200px]">{student.name}</p>
        </TableCell>
        {[...Array(10)].map((_, i) => {
          const course = student.courses[i];
          return [
            <TableCell key={`courses[${i}].code`}>
              {course?.code || "-"}
            </TableCell>,
            <TableCell key={`courses[${i}].name`}>
              <p className="w-[200px]">{course?.name || "-"}</p>
            </TableCell>,
            <TableCell key={`courses[${i}].grade`}>
              {course?.grade || "-"}
            </TableCell>,
            <TableCell key={`courses[${i}].credit`}>
              {course?.credit || "-"}
            </TableCell>,
          ];
        })}
      </TableRow>
    );
  };

  const rows = data.map(RenderStudent);

  return (
    <Table
      classNames={{
        base: "max-w-full",
      }}
      selectionMode={selectionMode ? "single" : "none"}
      onSelectionChange={handleSelect}>
      <TableHeader columns={tableColumns}>
        {(column) => (
          <TableColumn key={column.key} className={column.className}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={rows} isLoading={isLoading} loadingContent={<Spinner label="Loading" />}>
        {(row) => row}
      </TableBody>
    </Table>
  );
}
