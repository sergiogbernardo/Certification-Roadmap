export default function Hero() {
  return (
    <section className="mb-8 text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-400/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-emerald-300/80">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-live" aria-hidden />
        mapa de certificações
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
        Trilhas e certificações de{' '}
        <span className="text-emerald-400">cibersegurança</span>
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
        Explore as certificações por domínio e senioridade, monte sua própria trilha a partir de
        uma certificação e avalie os pontos fortes do seu perfil. Tudo no navegador, sem cadastro.
      </p>
    </section>
  );
}
