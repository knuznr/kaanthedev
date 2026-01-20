import { BlogPosts } from "app/components/posts";
import Head from "next/head";
import { Suspense } from 'react';

import Link from 'next/link';

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BlogLink({ slug, name }) {
  return (
    <div className="group">
      <a
        href={`/blog/${slug}`}
        className="flex w-full items-center justify-between rounded border border-neutral-200 bg-neutral-50 px-3 py-4 dark:border-neutral-700 dark:bg-neutral-800"
      >
        <div className="flex flex-col">
          <p className="font-medium text-neutral-900 dark:text-neutral-100">
            {name}
          </p>
          
        </div>
        <div className="transform text-neutral-700 transition-transform duration-300 group-hover:-rotate-12 dark:text-neutral-300">
          <ArrowIcon />
        </div>
      </a>
    </div>
  );
}
export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tighter">
        hey there, I'm kaan! 👋
      </h1>
      <p className="prose prose-neutral dark:prose-invert">
        {`I'm a software developer who loves turning ideas into code.

I'm all about building cool stuff with the latest tech. Currently exploring web development and AI applications and always excited to learn something new.

When I'm not coding, you'll find me reading tech blogs, contributing to open source, or planning my next project.

Feel free to `}
        <Link href="mailto:me@kaanuzuner.dev">contact</Link>
        {` me!`}
      </p>
      <div className="my-8 flex w-full flex-col space-y-4">
        <BlogLink name="Explanation of 'Time Complexity'" slug="time-complexity" />
        <BlogLink name="Types of Sorting Algorithms" slug="sorting-algorithms" />
      </div>
    </section>
  );
}
