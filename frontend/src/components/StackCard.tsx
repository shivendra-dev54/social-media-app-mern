export const StackCard = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <div className="group">
    <div className="relative h-full bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent rounded-xl transition-all duration-300" />
      <div className="relative">
        <h5 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
          {title}
        </h5>
        <ul className="space-y-2.5">
          {items.map((item, idx) => (
            <li 
              key={item} 
              className="text-slate-300 flex items-start gap-3 group/item transition-all duration-200 hover:translate-x-1"
              style={{ 
                animation: `fadeInUp 0.4s ease-out forwards ${idx * 0.1}s`,
                opacity: 0 
              }}
            >
              <span className="text-blue-500 mt-1.5 text-xs">▸</span>
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);