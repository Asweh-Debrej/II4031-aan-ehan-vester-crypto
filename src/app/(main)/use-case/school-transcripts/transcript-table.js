"use client";

import { useState } from "react";

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
  Pagination,
} from "@nextui-org/react";

export default function TranscriptTable({
  data,
  includeHash = false,
  includeRSA = false,
  includeRC4 = false,
  isLoading = false,
  selectionMode = false,
  showPagination = false,
  totalPages = 1,
  topContent = null,
  onPageChange = (page) => {},
  onSelect = (selectedData) => {},
}) {
  const [page, setPage] = useState(1);

  const pageChangeHandler = (page) => {
    setPage(page);
    onPageChange(page);
  };

  const tableColumns = [
    [
      includeHash && { name: "Hash", key: "hash", className: "w-[200px]" },
      includeRSA && {
        name: "RSA Public E",
        key: "rsaPublicE",
        className: "w-[100px]",
      },
      includeRSA && {
        name: "RSA Public N",
        key: "rsaPublicN",
        className: "w-[100px]",
      },
      includeRC4 && { name: "RC4 Key", key: "rc4Key", className: "w-[200px]" },
    ].filter(Boolean),
    {
      name: "Student NIM",
      key: "nim",
      className: "w-[200px]",
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
            <TableCell key={`hash`}>
              <p className="w-[200px] break-all break-words">{student.hash}</p>
            </TableCell>
          ),
          includeRSA && [
            <TableCell key={`rsaPublicE`}>
              <p className="w-[100px] break-all break-words">
                {student.rsaPublicE}
              </p>
            </TableCell>,
            <TableCell key={`rsaPublicN`}>
              <p className="w-[100px] break-all break-words">
                {student.rsaPublicN}
              </p>
            </TableCell>,
          ],
          includeRC4 && (
            <TableCell key={`rc4Key`}>
              <p className="w-[200px] break-all break-words">
                {student.rc4Key}
              </p>
            </TableCell>
          ),
        ].filter(Boolean)}
        <TableCell key={`nim`}>
          <p className="w-[200px] break-all break-words">{student.nim}</p>
        </TableCell>
        <TableCell key={`name`}>
          <p className="w-[200px] break-all break-words">{student.name}</p>
        </TableCell>
        {[...Array(10)].map((_, i) => {
          const course = student.courses[i];
          return [
            <TableCell key={`courses[${i}].code`} className="break-all break-words">
              {course?.code || "-"}
            </TableCell>,
            <TableCell key={`courses[${i}].name`} className="break-all break-words">
              <p className="w-[200px]">{course?.name || "-"}</p>
            </TableCell>,
            <TableCell key={`courses[${i}].grade`} className="break-all break-words">
              {course?.grade || "-"}
            </TableCell>,
            <TableCell key={`courses[${i}].credit`} className="break-all break-words">
              {course?.credit || "-"}
            </TableCell>,
          ];
        })}
      </TableRow>
    );
  };

  const rows = data.map(RenderStudent);

  const bottomContent = (
    <div className="flex flex-row items-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="secondary"
        page={page}
        total={totalPages}
        onChange={pageChangeHandler}
      />
    </div>
  );

  return (
    <div
      className={`flex flex-col items-center gap-2 w-full mx-auto bg-neutral-900 bg-opacity-70 rounded-xl shadow-md ${
        showPagination ? "pb-2" : ""
      } ${
        topContent ? "pt-2" : ""
      } border-neutral-950 border-2 border-opacity-30`}>
      {topContent}
      <Table
        classNames={{
          base: "max-w-full",
        }}
        selectionMode={selectionMode ? "single" : "none"}
        onSelectionChange={handleSelect}
        aria-label="Transcript Table">
        <TableHeader columns={tableColumns}>
          {(column) => (
            <TableColumn key={column.key}>
              <p className={column.className}>{column.name}</p>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={rows}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading" />}
          emptyContent="No rows to display."
          >
          {(row) => row}
        </TableBody>
      </Table>
      {showPagination ? bottomContent : null}
    </div>
  );
}
