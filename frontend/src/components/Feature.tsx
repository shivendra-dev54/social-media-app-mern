export const Feature = ({ title, desc }: { title: string; desc: string }) => (
  <div className="group">
    <div className="relative h-full bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent rounded-xl transition-all duration-300" />
      <div className="relative">
        <h6 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          {title}
        </h6>
        <p className="text-slate-300 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  </div>
);