import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'work',
  description: 'A summary of my work and contributions.',
};


export default function WorkPage() {
  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">experience</h1>
      <div className="prose prose-neutral dark:prose-invert">
      <hr className="my-6 border-neutral-100 dark:border-neutral-800" />
      <h2 className="font-medium text-xl mb-1 tracking-tighter">Unemployed</h2>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm">
        Software Developer
      </p>
      <p>
        Since I left my old company, I have been working on personal projects.
        These projects are all open source and available on my{' '}
        <Link href="https://github.com/knnuznr">GitHub</Link>.
      </p>
      </div>
      <div className="prose prose-neutral dark:prose-invert">
        <hr className="my-6 border-neutral-100 dark:border-neutral-800" />
        <h2 className="font-medium text-xl mb-1 tracking-tighter">Crede-Tech</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Junior Software Developer
        </p>
        <p>
        Since joining this company in August 2023, I have been maintaining an application for lawyers to track their cases. My responsibilities include ensuring the application’s smooth operation, implementing new features, fixing bugs, and optimizing performance.
        </p>
      </div>
    </section>
  );
}
