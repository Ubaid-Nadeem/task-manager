"use client";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import Link from "next/link";
import HoverButton from "../ReuseComponent/button/button";
import { useEffect, useState } from "react";
import Loader from "@/ReuseComponent/loader/loader";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col gap-4 items-center justify-center px-4"
          >
            <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
              Welcome to Go Task
            </div>
            <div className="font-extralight text-base md:text-2xl dark:text-neutral-200 py-4">
              Get Things Done, One Task at a Time.
            </div>
            <Link href={"/tasks"} onClick={() => setLoading(!loading)}>
              <HoverButton />
            </Link>
            {/* <button className="w-[250px] bg-black dark:bg-white  w-fit text-white dark:text-black px-4 py-4">
          <Link href={"/task"}>GET STARTED</Link>
        </button> */}
          </motion.div>
        </AuroraBackground>
      )}
    </div>
  );
}
