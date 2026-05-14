import LinksClient from './links-client'

export const metadata = {
  title: 'links',
  description: '2000+ links — things i\'ve read, saved, and thought about.',
}

export default function Page() {
  return (
    <section>
      <h1 className="text-4xl font-biro-script mb-3 text-left">links,</h1>
      <p className="mb-8 text-[15px]">
        things i&rsquo;ve read, saved, and thought about. semantic search across <span className="italic">2000+</span> links.
      </p>
      <LinksClient />
    </section>
  )
}
