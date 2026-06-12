import type { Metadata } from "next";
import MyCodeSignIn from "@/components/MyCodeSignIn";

export const metadata: Metadata = {
  title: "Sign in — ArcadeLab",
  robots: { index: false, follow: false },
};

export default async function MyCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <MyCodeSignIn code={decodeURIComponent(code).toUpperCase()} />
    </main>
  );
}
