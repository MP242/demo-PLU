"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function test() {
      router.push("/auth/signin");
    }
    test();
  }, []);

  return <main></main>;
}
