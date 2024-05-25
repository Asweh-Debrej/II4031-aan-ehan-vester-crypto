"use client";

import { useState, useEffect } from "react";

import { Button, Spacer } from "@nextui-org/react";
import TranscriptTable from "./transcript-table";

import { getData } from "./data";

export default function RetrieveDatabase({ defaultData = null, onRetrieve = (data) => {}}) {
  const [databaseData, setDatabaseData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [retrievedData, setRetrievedData] = useState(null);

  const dataReady = Boolean(databaseData.length);

  const onLoadFromStep14 = () => {
    if (!defaultData) {
      alert("No data from step 1.4");
      return;
    }

    setRetrievedData(defaultData);
    onRetrieve(defaultData);
  };

  const onSelectAndLoad = () => {
    if (!selectedData) {
      alert("Please select data to load");
      return;
    }

    setRetrievedData(selectedData);
    onRetrieve(selectedData);
  };

  const onSelectData = (data) => {
    setSelectedData(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setDatabaseData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 max-w-full">
      <p>{`Retrieve your student data from our database`}</p>
      <p>{`Select the student data you want to retrieve`}</p>
      <TranscriptTable
        data={databaseData}
        isLoading={!dataReady}
        selectionMode
        onSelect={onSelectData}
      />
      <div className="flex flex-row gap-4 items-center ml-auto">
        <p>You can also load data from step 1.4</p>
        <Button
          color="primary"
          className="font-bold w-[250px]"
          size="md"
          onClick={onLoadFromStep14}>
          Load from Step 1.4
        </Button>
        <Button
          color="primary"
          className="font-bold w-[250px]"
          size="md"
          onClick={onSelectAndLoad}>
          Select and load from table
        </Button>
      </div>
      <Spacer y={4} />
      <p>{`The data you've selected is shown below`}</p>
      <TranscriptTable
        data={retrievedData ? [retrievedData] : []}
        includeHash
        includeRSA
      />
    </div>
  );
}
