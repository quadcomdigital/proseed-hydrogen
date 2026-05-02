import type {Route} from './+types/robots[.]txt';

export async function loader({request}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${url.protocol}//${url.host}/sitemap.xml\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

export default function RobotsTxt() {
  return null;
}
