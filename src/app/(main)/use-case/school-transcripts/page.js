import TranscriptsForm from "./transcript-form";

// import GeneratePDF from "./GeneratePDF";

export default function SchoolTranscripts() {
  return (
    <div className="flex flex-col items-center mx-auto h-full max-w-7xl p-4 gap-4">
      <p className="text-3xl font-bold">School Transcripts</p>
      {/* <GeneratePDF student={example[0]} /> */}
      <TranscriptsForm />
    </div>
  );
}
