import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import QuickAnswer from "@/components/QuickAnswer";
import { getArticle } from "@/lib/articles";

const article = getArticle("publish-threejs-scene-single-file")!;

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  alternates: { canonical: `https://arcadelab.ai/learn/${article.slug}` },
  openGraph: {
    title: article.title,
    description: article.description,
    url: `https://arcadelab.ai/learn/${article.slug}`,
    type: "article",
  },
};

const FAQS = [
  {
    question: "How do I publish a Three.js scene as a single file?",
    answer:
      "Write your Three.js scene as one HTML file with all JavaScript inline. List 'three' in the ARCADELAB header and ArcadeLab loads the Three.js CDN automatically. Paste at arcadelab.ai/publish.",
  },
  {
    question: "Which version of Three.js does ArcadeLab use?",
    answer:
      "Three.js r128, loaded from cdnjs. This is the last version before Three.js moved to ES modules as the primary distribution, so the global THREE object is available without imports.",
  },
  {
    question: "Can I use Three.js loaders like GLTFLoader on ArcadeLab?",
    answer:
      "Loaders that need to fetch external files won't work — the iframe blocks network requests. To use a 3D model, embed it inline as base64 or build the scene procedurally with primitives.",
  },
  {
    question: "Can I use react-three-fiber?",
    answer:
      "Not easily. ArcadeLab loads React separately, but react-three-fiber is typically distributed via npm and ES modules. For ArcadeLab, write directly against the Three.js API.",
  },
  {
    question: "What's the file size limit for a Three.js scene?",
    answer:
      "500KB for the HTML file. Three.js itself is loaded from CDN separately and doesn't count. Procedurally generated scenes fit easily; scenes with large embedded models may not.",
  },
];

export default function Page() {
  return (
    <ArticleLayout article={article} faqs={FAQS}>
      <QuickAnswer>
        Write your Three.js scene as one HTML file with all JavaScript inline. Add an
        ARCADELAB header with <code>libraries: three</code>. Paste at{" "}
        <Link href="/publish" className="text-accent-purple underline">arcadelab.ai/publish</Link>.
        ArcadeLab injects Three.js automatically (r128, classic global API).
      </QuickAnswer>

      <p>
        Three.js works beautifully as a single-file HTML scene as long as you stick to the
        classic global <code>THREE</code> API and avoid the ES-module distribution. That&apos;s
        exactly what ArcadeLab loads, so you get a working 3D scene with no build step.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What does a minimal Three.js scene look like on ArcadeLab?
      </h2>
      <pre className="pixel-border-green bg-sky-top p-4 my-3 overflow-x-auto text-[10px]">
{`<!--ARCADELAB
title: Three.js Cube
description: A spinning cube
libraries: three
emoji: 🧊
color: blue
-->
<!DOCTYPE html>
<html>
<head>
  <style>body { margin: 0; }</style>
</head>
<body>
  <script>
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x44aaff });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 3;
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  </script>
</body>
</html>`}
      </pre>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Can I load a 3D model file?
      </h2>
      <p>
        Not directly. Loaders like <code>GLTFLoader</code> need to fetch the model file
        over the network, and ArcadeLab&apos;s sandbox blocks all network requests. Two
        workarounds:
      </p>
      <ul className="list-disc list-inside space-y-1 my-3">
        <li>
          <strong>Build the geometry procedurally:</strong> use Three.js primitives
          (BoxGeometry, SphereGeometry, etc.) and modify them programmatically.
        </li>
        <li>
          <strong>Embed the model inline:</strong> base64-encode a small GLB or convert to
          a JSON format and parse it directly. Practical only for very small models.
        </li>
      </ul>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        Is the global THREE namespace available?
      </h2>
      <p>
        Yes. ArcadeLab loads Three.js r128 from cdnjs, which exposes <code>THREE</code> as
        a global. Use <code>new THREE.Scene()</code>, <code>new THREE.PerspectiveCamera()</code>,
        and so on without imports.
      </p>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        How do I get a working Three.js scene from Claude or ChatGPT?
      </h2>
      <p>Use this prompt:</p>
      <blockquote className="border-l-4 border-accent-purple pl-4 my-3 italic">
        &quot;Build a Three.js scene as a single self-contained HTML file. Use the global
        THREE namespace (Three.js r128). Don&apos;t include the Three.js CDN script tag —
        ArcadeLab injects it. Put an{" "}
        <code>&lt;!--ARCADELAB&gt;</code> header at the top with <code>libraries: three</code>.
        All JS inline. No external models or textures — build geometry procedurally and
        use solid colors.&quot;
      </blockquote>

      <h2 className="text-xs text-wood-dark mt-6 mb-2 normal-case font-semibold">
        What about react-three-fiber?
      </h2>
      <p>
        React-three-fiber is normally distributed as an ES module that needs bundling.
        ArcadeLab&apos;s single-file format doesn&apos;t play well with that. If you want
        to write Three.js with a React-like component model, you&apos;d need to inline
        a UMD build — which is heavier than just writing direct Three.js. For ArcadeLab,
        stick with the imperative Three.js API.
      </p>
    </ArticleLayout>
  );
}
