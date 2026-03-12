"use client";

import { motion } from "framer-motion";
import { Laptop, Cloud } from "lucide-react";

export default function UploadAnimation() {
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur flex items-center justify-center z-50">

      <div className="flex items-center gap-16">

        {/* PC */}
        <div className="flex flex-col items-center text-green-400">
          <Laptop size={60} />
          <p className="mt-3 text-sm font-mono">Your PC</p>
        </div>

        {/* Data Transfer Animation */}
        <div className="relative w-[300px] h-[20px] flex items-center">

          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]"
              initial={{ x: 0, opacity: 0 }}
              animate={{
                x: 280,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}

          <div className="w-full h-[2px] bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 opacity-30" />
        </div>

        {/* Cloud */}
        <div className="flex flex-col items-center text-yellow-400">
          <Cloud size={60} />
          <p className="mt-3 text-sm font-mono">S3 Cloud</p>
        </div>

      </div>

      <motion.p
        className="absolute bottom-20 text-gray-400 font-mono text-sm"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        transferring data to cloud...
      </motion.p>

    </div>
  );
}