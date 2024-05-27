"use client";

import { useState, useEffect, useRef } from "react";

import { Button, Spacer, Input } from "@nextui-org/react";
import TranscriptTable from "./transcript-table";

import { getData } from "./data";
import { set } from "lodash";

const studentsPerPage = 10;

export default function RetrieveDatabase({
  defaultData = null,
  onRetrieve = (data) => {},
}) {
  const [databaseData, setDatabaseData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [retrievedData, setRetrievedData] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const filterOptions = useRef({
    codeFilter: "",
    page: 1,
    itemsPerPage: studentsPerPage,
  });
  const [isFetching, setIsFetching] = useState(true);

  const dataReady = Boolean(databaseData.length);

  const fetchData = (options) => {
    const { codeFilter = "", page = 1 } = options || {};

    setIsFetching(true);

    getData({ codeFilter, page, itemsPerPage: studentsPerPage })
      .then((res) => {
        if (!res.ok) {
          alert(res.error);
          return;
        }

        setDatabaseData(res.data.students || []);
        setIsFetching(false);
        setPageCount(Math.ceil(res.data.total / studentsPerPage) || 1);
      })
      .catch((e) => {
        console.error(e);
        setIsFetching(false);
        alert("Error fetching data from database");
      });
  };

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

  useEffect(fetchData, []);

  // timer
  const timer = useRef(null);
  const onOptionsChange = (options) => {
    filterOptions.current = options;
    setIsFetching(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fetchData(options), 700);
  };

  const topTableContent = (
    <div className="flex flex-row gap-4 items-center ml-auto px-4">
      <Input
        label="NIM Filter"
        className="w-[240px]"
        onValueChange={(val) =>
          onOptionsChange({ ...filterOptions.current, codeFilter: val })
        }
        size="sm"
      />
      <Button
        onClick={() => fetchData(filterOptions.current)}
        color="primary"
        className="font-bold w-[160px] ml-auto"
        size="md">
        Refresh Data
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 max-w-full">
      <p>{`Retrieve your student data from our database`}</p>
      <p>{`Select the student data you want to retrieve`}</p>
      <TranscriptTable
        data={databaseData}
        isLoading={isFetching}
        selectionMode
        onSelect={onSelectData}
        showPagination
        totalPages={pageCount}
        topContent={topTableContent}
        onPageChange={(page) =>
          onOptionsChange({ ...filterOptions.current, page })
        }
      />
      <p className="text-warning font-bold">
        {`To improve readability, we hide hash and public keys in the table above. However, they are stored in the database.`}
      </p>
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
