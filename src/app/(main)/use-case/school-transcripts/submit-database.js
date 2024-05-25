"use client";

import { useState, useEffect } from "react";

import { Button, Spacer } from "@nextui-org/react";
import TranscriptTable from "./transcript-table";
import { getData } from "./data";

export default function SubmitDatabase({ encryptedData = null }) {
  const [databaseData, setDatabaseData] = useState([]);

  const dataReady = Boolean(databaseData.length);

  const onSubmitHandler = () => {
    if (!encryptedData) {
      alert("Encrypted data is required");
      return;
    }

    // Submit to database
    alert("Data submitted to database");
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setDatabaseData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-fit max-w-full">
      <p>
        {`Once you've encrypted all the fields of the student data, you can submit
        it to the database. This step can be skipped.`}
      </p>
      <p className="text-danger font-bold">
        {`Once submitted, you cannot change or delete the data and it will be visible to all visitors of this page. However, you can restart the process from certain steps in step 1. Proceed with caution.`}
      </p>
      <Button
        onClick={onSubmitHandler}
        color="warning"
        className="font-bold w-[200px]"
        size="lg">
        Submit to Database
      </Button>
      <Spacer y={4} />
      <p>{`The data stored in the database is shown below`}</p>
      <TranscriptTable data={databaseData} isLoading={!dataReady} />
    </div>
  );
}
