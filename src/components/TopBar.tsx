const HUB_URL = 'https://sergiogbernardo.github.io/';

export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-emerald-500/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
        <a href={HUB_URL} className="group inline-flex items-center gap-2">
          <span className="font-display text-sm font-semibold tracking-wide text-emerald-300">
            certification<span className="text-slate-500">/</span>roadmap
          </span>
        </a>
        <a
          href={HUB_URL}
          className="font-mono text-xs text-slate-500 transition hover:text-emerald-300"
        >
          ← portfólio
        </a>
      </div>
    </header>
  );
}
