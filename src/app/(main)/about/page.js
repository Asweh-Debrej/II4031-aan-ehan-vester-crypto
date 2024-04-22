import Link from "next/link";

export default function About() {
  const members = [
    { name: 'Muhamad Farhan Syakir', id: 18221145 },
    { name: 'Silvester Kresna W. P. P.', id: 18221049 },
  ];

  const githubRepoLink = 'https://github.com/Asweh-Debrej/T1-II4031-Kripto';

  return (
    <div className="flex relative items-center justify-center grow h-full">
      <div className="flex text-center flex-col gap-12">
        <ul className='text-xl'>
          {members.map((member) => (
            <li key={member.id}>
              {member.name} - {member.id}
            </li>
          ))}
        </ul>
        <Link href={githubRepoLink}
        className="text-2xl font-bold text-primary" target="_blank" rel="noopener noreferrer">GitHub Repo</Link>
      </div>
    </div>
  );
}
