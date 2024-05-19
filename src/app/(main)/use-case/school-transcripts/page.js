import { example } from "./data";

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

import TranscriptTable from "./transcript-table";

export default async function SchoolTranscripts() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold">School Transcripts</h1>
      <TranscriptTable data={example} />
    </div>
  );
}

