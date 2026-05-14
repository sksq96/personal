import Link from 'next/link';

export default function NotFound() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        👀
      </h1>
      <p className="mb-4">what you are looking for is not here. <Link href="https://idhant.xyz/" className="underline underline-offset-4 decoration-1">home</Link>?</p>
    </section>
  )
}
