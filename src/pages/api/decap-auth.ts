import type { APIRoute } from 'astro';

export const prerender = false; // Ensures this endpoint runs dynamically on Cloudflare

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // Environment variables from Cloudflare context or process.env
  const runtime = (locals as any).runtime;
  const GITHUB_TOKEN = runtime?.env?.GITHUB_TOKEN || process.env.GITHUB_TOKEN;

  // Handle post-login handshake for Decap CMS
  if (code) {
    const postMessageContent = `authorization:github:success:${JSON.stringify({
      token: GITHUB_TOKEN,
      provider: 'github',
    })}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <body>
        <script>
          (function() {
            function receiveMessage(e) {
              window.opener.postMessage(
                "${postMessageContent}",
                e.origin
              );
            }
            window.addEventListener("message", receiveMessage, false);
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  // Initial redirect from Decap CMS login button
  return Response.redirect(`${url.origin}/api/decap-auth?code=authenticated`, 302);
};