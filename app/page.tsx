import { BlogPosts } from "app/components/posts";
import Head from "next/head";

export default function Page() {
  return (
    <section>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <h1 className="mb-8 text-2xl font-medium tracking-tighter">
        hey, I'm kaan! 👋
      </h1>
      <p className="prose prose-neutral dark:prose-invert">
        {`I am a software developer with a deep passion for coding, coffee, and technology. My journey in the tech world has been fueled by a relentless curiosity and a love for problem-solving. Whether it’s writing clean, efficient code or exploring the latest advancements in technology, I am always eager to learn and innovate. When I’m not immersed in coding, you’ll find me enjoying a good cup of coffee, which fuels my creativity and productivity. My passion for technology goes beyond just writing code; I am enthusiastic about understanding how things work and finding ways to make them better. With a keen eye for detail and a commitment to excellence, I strive to create software solutions that are not only functional but also user-friendly. I am excited about the endless possibilities that technology offers and look forward to contributing to projects that make a difference.`}
      </p>
      <div className="my-8 flex w-full flex-col space-y-4">
        <BlogPosts />
      </div>
    </section>
  );
}
