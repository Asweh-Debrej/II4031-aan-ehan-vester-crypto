export default function Notes({ notes = [] }) {
  return (
    <div className="flex flex-col gap-4">
      {notes.map((note, index) => (
        <div key={index} className="flex flex-col gap-2">
          <p className="text-lg font-bold">{note.title}</p>
          <p className="text-sm">{note.content}</p>
        </div>
      ))}
    </div>
  );
}
