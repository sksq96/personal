import { Callout } from './components/callout'
import { CopyEmail } from './components/copy-email'
import Header from './components/header'

export default function Page() {
  return (
    <>
      <section className="mb-0">
        <Header />
      </section>

      <div className="flex flex-col gap-4 mb-4 w-full max-w-2xl">
        <Callout icon="🦋">
          <p className="text-[17px]">
            {`building `}<a href="https://tryhue.app" target="_blank" rel="noopener noreferrer" className="italic underline underline-offset-4 decoration-1">hue</a>{`. personal intelligence. like artificial intelligence, but it actually knows you. dm me on `}<a href="https://x.com/sksq96" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-1">twitter</a>{` or `}<CopyEmail />{` if any of this resonates.`}
          </p>
        </Callout>
        <Callout icon="🎓">
          <p className="text-[17px]">
            {`taught `}<a href="https://www.youtube.com/playlist?list=PLxebUzBtXdb3c5OXSG_1F7VXqcmh9Xdnz" target="_blank" rel="noopener noreferrer" className="italic underline underline-offset-4 decoration-1">frontier language models</a>{`, a class on llms from the ground up. all lectures are on youtube.`}
          </p>
        </Callout>
      </div>

      <section className="mb-0">
        <p className="text-5xl font-biro-script mb-3 text-left">yo,</p>
      </section>

      <section className="mb-4">
        <p className="mb-4 text-left text-[17px]">
          {`welcome to this `}<span className="italic">little space</span>{` of mine on the internet`}
        </p>
      </section>

      <div className="flex gap-8">
        <div className="w-full max-w-2xl">
          <section className="mb-4">
            <p className="mb-4 text-left text-[17px] leading-relaxed">
              {`i'm shubham. llm researcher, accidental quant, deliberate founder. 30, in new york. spent the last decade trying to understand these systems from the inside out. how the math turns into a thing that seems to know what you mean.`}
            </p>
          </section>

          <section className="mb-4">
            <p className="mb-4 text-left text-[17px] leading-relaxed">
              {`currently building `}<a href="https://tryhue.app" target="_blank" rel="noopener noreferrer" className="italic underline underline-offset-4 decoration-1">hue</a>{` at `}<a href="https://www.strangeintelligence.ai/" target="_blank" rel="noopener noreferrer" className="italic underline underline-offset-4 decoration-1">strange intelligence</a>{`. a personal intelligence layer that lives in your imessages, learns who you are from your data, and reaches out to your friends' agents on your behalf. agent-to-agent communication, but the agent is shaped by you. the bet is that personal models are the missing piece. not bigger, just `}<span className="italic">yours</span>{`.`}
            </p>
          </section>

          <section className="mb-4">
            <p className="mb-4 text-left text-[17px] leading-relaxed">
              {`before this, did ai research at `}<span className="italic">vatic labs</span>{` (a small quant fund, agents learning market predictions instead of ml models). before that, trained language models at `}<a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-1">github copilot</a>{` and shipped intellisense pieces into `}<span className="italic">vs code</span>{` at microsoft. did my masters at `}<span className="italic">nyu</span>{`, worked with `}<a href="https://en.wikipedia.org/wiki/Yann_LeCun" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-1">yann lecun</a>{`. the path from `}<span className="italic">curious about how neural nets actually work</span>{` to `}<span className="italic">trying to build one that knows you</span>{` has been a long but pretty linear line.`}
            </p>
          </section>

          <section className="mb-4">
            <p className="mb-4 text-left text-[17px] leading-relaxed">
              {`i think in `}<span className="italic">arrows</span>{`. when the target is chosen, execution is the easy part. i can lock into a pod for three hours and ship a flow. the hard part is choosing. paralyzed by dimensionality, not volume. wants to do everything: build, host events, read papers, teach, write. in practice i do one or two things per week at depth and let the rest slide.`}
            </p>
          </section>

          <section className="mb-4">
            <p className="mb-4 text-left text-[17px] leading-relaxed">
              {`outside work i host `}<span className="italic">research salons</span>{` and game nights in nyc. small rooms, real conversations about consciousness, alignment, the shape of these models. the optimal go-to-market for hue turned out to not be a marketing funnel. it's a social calendar. every event is a conversion event.`}
            </p>
          </section>

          <section className="mb-4">
            <p className="mb-4 text-left text-[17px] leading-relaxed">
              {`reading: scott alexander style essays, ai consciousness papers, indirect realism, jhana phenomenology. trying to write the kind of essay i wish existed. `}<span className="italic">the gradual disempowerment</span>{` and `}<span className="italic">the artificial self</span>{`. translating frontier ai for people who don't read academic papers.`}
            </p>
          </section>

          <section className="mb-4">
            <p className="mb-4 text-left text-[17px] leading-relaxed">
              {`i like meeting people. if any of this resonates (building agents, personal intelligence, ai consciousness, or you just want to get a coffee in new york) reach out via `}<a href="https://x.com/sksq96" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-1">twitter</a>{` or `}<CopyEmail />{`. or skim my `}<a href="/links" className="underline underline-offset-4 decoration-1">links</a>{`, 2000+ things i've read and saved.`}
            </p>
          </section>

          <section className="mb-4">
            <p className="text-5xl font-biro-script mb-4 text-left">- shubham</p>
          </section>
        </div>

        <div className="flex-1 flex justify-end items-end">
          <div className="text-right">
          </div>
        </div>
      </div>

      <p className="font-eb-garamond text-3xl text-center">***</p>
    </>
  )
}
