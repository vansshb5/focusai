import { motion } from "framer-motion";

export default function GlassCard({ children, style = {}, delay = 0, hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(12px)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        ...style
      }}
    >
      {children}
    </motion.div>
  );
}