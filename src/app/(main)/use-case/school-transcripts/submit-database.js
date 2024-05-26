"use client";

import { useState, useEffect } from "react";

import { Button, Spacer } from "@nextui-org/react";
import TranscriptTable from "./transcript-table";
import { getData, addData } from "./data";

export default function SubmitDatabase({ encryptedData = null }) {
  const [databaseData, setDatabaseData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const dataReady = Boolean(databaseData.length);

  const fetchData = () => {
    setIsFetching(true);

    getData()
      .then((res) => {
        if (!res.ok) {
          alert(res.error);
          return;
        }

        setDatabaseData(res.data.students || []);

        setIsFetching(false);
      })
      .catch((e) => {
        console.error(e);
        setIsFetching(false);
        alert("Error fetching data from database");
      });
  };

  const onSubmitHandler = () => {
    if (!encryptedData) {
      alert("Encrypted data is required");
      return;
    }

    setIsSubmitting(true);

    addData(encryptedData)
      .then((res) => {
        if (!res.ok) {
          alert(res.message);
          setIsSubmitting(false);
          return;
        }

        if (res.data) {
          setDatabaseData([res.data, ...databaseData]);
        }

        setIsSubmitting(false);
      })
      .catch((e) => {
        console.error(e);
        alert(e.message || "Error submitting data to database");
        setIsSubmitting(false);
      });
  };

  useEffect(fetchData, []);

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
        className="font-bold w-[240px]"
        size="lg">
        Submit to Database
      </Button>
      <Spacer y={4} />
      <p>{`The data stored in the database will look like below`}</p>
      <TranscriptTable data={databaseData} isLoading={isSubmitting} />
    </div>
  );
}
