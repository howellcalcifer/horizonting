import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers'; // Import env directly

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // Access GITHUB_TOKEN directly from Cloudflare workers env
  const GITHUB_TOKEN = env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;

  if (!GITHUB_TOKEN) {
    return new Response('Missing GITHUB_TOKEN environment variable', { status: 500 });
  }

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

  return Response.redirect(`${url.origin}/api/decap-auth?code=authenticated`, 302);
};