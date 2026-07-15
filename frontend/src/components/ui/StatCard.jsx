import { motion } from "framer-motion";

function StatCard({ label, value, icon: Icon, delay = 0, accent = "#457D58" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div
          className="rounded-2xl p-3"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          <Icon size={21} />
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;
