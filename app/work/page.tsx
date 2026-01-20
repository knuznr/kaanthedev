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

      {/* Current Status */}
      <div className="mb-12">
        <h2 className="font-medium text-lg mb-6 tracking-tighter text-amber-600 dark:text-amber-500">
          Currently Looking for Opportunities
        </h2>
        
        <div className="prose prose-neutral dark:prose-invert bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800">
          
          <h3 className="font-medium text-base mb-2 mt-0">Software Developer</h3>
          <p className="mb-0 text-sm">
            Currently exploring new opportunities and building open-source projects. Check out my{' '}
            <Link href="https://github.com/knnuznr" className="font-medium hover:underline">
              GitHub
            </Link>{' '}
            for my work. Open to <code>full-time, part-time, or freelance</code> roles.{' '}
            <Link href="mailto:me@kaanuzuner.dev" className="font-medium hover:underline">
              Let's talk!
            </Link>
          </p>
        </div>
      </div>

      {/* Previous Experience */}
      <div>
        <h2 className="font-medium text-lg mb-6 tracking-tighter text-neutral-700 dark:text-neutral-300">
          Previous Experience
        </h2>

        {/* OtoArena */}
        <div className="prose prose-neutral dark:prose-invert mb-8">
          <div className="border-l-4 border-neutral-300 dark:border-neutral-700 pl-4">
            <div className="flex items-baseline justify-between gap-4 mb-2">
              <h3 className="font-medium text-base mt-0 mb-0">OtoArena</h3>
              <span className="text-neutral-500 dark:text-neutral-500 text-xs whitespace-nowrap flex-shrink-0">
                Mar 2025 - Aug 2025
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
              Junior Software Developer
            </p>
            <p className="mb-0 text-sm">
              Developed critical modules for OtoArena auction platform using .NET Core and JavaScript. Built commission calculation systems, user management features, and dynamic form validations. Implemented responsive UI components and optimized backend performance for financial transactions. Delivered features for stock sales management, discount processing, and user authentication with focus on performance and user experience.
            </p>
          </div>
        </div>

        {/* Crede-Tech */}
        <div className="prose prose-neutral dark:prose-invert">
          <div className="border-l-4 border-neutral-300 dark:border-neutral-700 pl-4">
            <div className="flex items-baseline justify-between gap-4 mb-2">
              <h3 className="font-medium text-base mt-0 mb-0">Crede-Tech</h3>
              <span className="text-neutral-500 dark:text-neutral-500 text-xs whitespace-nowrap flex-shrink-0">
                Aug 2023 - Nov 2024
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
              Junior Software Developer
            </p>
            <p className="mb-0 text-sm">
              Joined to maintain an application for lawyers to track their cases. Responsibilities included ensuring smooth application operation, implementing new features, fixing bugs, and optimizing performance. Gained valuable experience in full-stack development and working with legal domain requirements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
