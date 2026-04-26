export default function FooterSection() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 px-5 py-10 text-white sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white">
            PS
          </span>
          <span className="text-sm font-black tracking-tight">Persona Signal</span>
        </div>
        <p className="text-sm font-semibold text-slate-400">Made by Haley</p>
      </div>
    </footer>
  );
}
