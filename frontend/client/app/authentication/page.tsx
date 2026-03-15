import { Suspense } from "react";
import CliLogin from "@/features/CliLogin";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <CliLogin />
    </Suspense>
  );
}