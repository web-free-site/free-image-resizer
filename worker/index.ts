interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);

    if (response.status === 404 && !url.pathname.includes(".")) {
      const fallback = await env.ASSETS.fetch(
        new URL(`${url.pathname.replace(/\/$/, "")}/index.html`, url.origin),
      );
      if (fallback.ok) return withSecurityHeaders(fallback);
    }

    return withSecurityHeaders(response);
  },
};

/** No COOP/COEP — third-party ad scripts/iframes must load; image WASM does not need isolation here. */
function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
