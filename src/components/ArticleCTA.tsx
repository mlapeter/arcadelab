import Link from "next/link";

export default function ArticleCTA() {
  return (
    <div className="rpg-panel p-6 my-8 text-center">
      <p className="text-[11px] leading-relaxed text-wood-mid mb-4 normal-case">
        Ready to publish? Paste your HTML file and get a URL.
      </p>
      <Link
        href="/publish"
        className="rpg-btn rpg-btn-green inline-flex items-center gap-2 px-6 py-3 text-[10px]"
      >
        <span className="text-base">🚀</span>
        <span>Publish your thing</span>
      </Link>
    </div>
  );
}
