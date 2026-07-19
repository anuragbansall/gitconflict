import React from "react";
import { Link } from "react-router";
import {
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiGitBranch,
  FiShield,
  FiTarget,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";

function Home() {
  const highlights = [
    {
      icon: <FiGitBranch />,
      title: "Real Git workflows",
      description:
        "Practice branching, rebasing, resolving conflicts, and shipping fixes the way teams do it.",
    },
    {
      icon: <FiTarget />,
      title: "Challenge-led learning",
      description:
        "Each scenario drops you into a specific problem so you learn by doing instead of by reading alone.",
    },
    {
      icon: <FiShield />,
      title: "Safe practice space",
      description:
        "Break things, recover, and retry with confidence while the platform keeps the exercise contained.",
    },
  ];

  const stats = [
    {
      value: "20+",
      label: "hands-on git scenarios",
    },
    {
      value: "Live",
      label: "feedback as you solve",
    },
    {
      value: "Real",
      label: "world team workflows",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Pick a challenge",
      description:
        "Choose a scenario based on skill level, time, or the Git concept you want to sharpen.",
    },
    {
      number: "02",
      title: "Work in a live repo",
      description:
        "Use the embedded environment to inspect files, make commits, and resolve the issue in real time.",
    },
    {
      number: "03",
      title: "Verify your fix",
      description:
        "Confirm the repo passes the challenge checks and compare your approach with the expected workflow.",
    },
  ];

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-sky-50 via-white to-zinc-50" />
      <div className="absolute left-[-8rem] top-10 -z-10 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute right-[-6rem] top-40 -z-10 h-72 w-72 rounded-full bg-slate-200/70 blur-3xl" />

      <div className="mx-auto flex w-full max-w-300 flex-col gap-20 px-4 py-4 md:px-6 lg:py-8">
        <section className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
              <FaStar className="text-amber-500" />
              Learn Git by solving real problems
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-7xl">
              Build Git confidence with challenges that feel like the real job.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600 sm:text-xl">
              gitconflict helps developers practice practical version-control
              skills through live, hands-on scenarios. You do not just study Git
              commands, you use them to recover broken branches, untangle merge
              conflicts, and ship fixes under pressure.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/challenges"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-zinc-900/10 transition hover:-translate-y-0.5 hover:bg-blue-600"
              >
                Start practicing
                <FiArrowRight />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-4 text-base font-semibold text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
              >
                See how it works
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur"
                >
                  <div className="text-2xl font-semibold text-zinc-900">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-zinc-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden md:block overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100/70 blur-3xl" />
            <div className="absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-zinc-200/70 blur-3xl" />

            <div className="rounded-[1.6rem] border border-zinc-200 bg-zinc-50 p-4">
              <PixelatedCanvas
                src="/github.avif"
                cellSize={3}
                dotScale={0.9}
                shape="square"
                backgroundColor="#000000"
                dropoutStrength={0.4}
                interactive
                distortionStrength={3}
                distortionRadius={80}
                distortionMode="swirl"
                followSpeed={0.2}
                jitterStrength={4}
                jitterSpeed={4}
                sampleAverage
                tintColor="#FFFFFF"
                tintStrength={0.2}
                className="rounded-xl border border-neutral-800 shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                {item.icon}
              </div>
              <h2 className="text-xl font-semibold text-zinc-900">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                {item.description}
              </p>
            </article>
          ))}
        </section>

        <section
          id="how-it-works"
          className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              A practice loop that rewards Git instincts, not memorization.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Every challenge is designed to feel like a real team incident: a
              messy branch, a misunderstood commit, or a deploy blocked by a
              conflict. You inspect the repo, make the right move, and verify
              that your fix holds up.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6"
              >
                <div className="text-sm font-bold tracking-widest text-blue-600">
                  {step.number}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-zinc-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] bg-gray-100/20 px-6 py-10 shadow-lg shadow-zinc-900/10 sm:px-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Ready to practice?
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-zinc-800">
                Pick a challenge and start building muscle memory with Git.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">
                Whether you are preparing for interviews, leveling up at work,
                or just want to stop fearing merge conflicts, the challenge
                library gives you a focused place to train.
              </p>
            </div>

            <Link
              to="/challenges"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Browse challenges
              <FiArrowRight />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home;
