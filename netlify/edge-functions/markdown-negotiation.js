export default async function handler(request, context) {
  const accept = request.headers.get("accept") || "";

  if (!accept.includes("text/markdown")) {
    return context.next();
  }

  const { pathname } = new URL(request.url);
  const path = pathname.replace(/\/$/, "") || "/";

  let mdPath = null;

  if (path === "/") {
    mdPath = "/md/index.md";
  } else if (path === "/projects") {
    mdPath = "/md/projects.md";
  } else if (path.startsWith("/projects/")) {
    const slug = path.slice("/projects/".length);
    if (slug) mdPath = `/projects/${slug}.md`;
  } else if (path.startsWith("/blog/")) {
    const slug = path.slice("/blog/".length);
    if (slug) mdPath = `/posts/${slug}.md`;
  }

  if (!mdPath) return context.next();

  try {
    const mdRes = await fetch(new URL(mdPath, request.url).toString());
    if (!mdRes.ok) return context.next();

    const markdown = await mdRes.text();

    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": String(Math.ceil(markdown.length / 4)),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return context.next();
  }
}

export const config = { path: "/*" };
