import ContrastChecker from "@/components/contrast-checker"

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Contrast Checker</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">Check color contrast for accessibility compliance</p>
        </header>

        <ContrastChecker />
      </div>
    </main>
  )
}
