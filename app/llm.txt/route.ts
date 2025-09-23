import { NextResponse } from "next/server";

export async function GET() {
  const content = `# llm.txt for Rootwave (rootwave.org)
User-agent: GPTBot
Disallow: /admin/
Disallow: /cart/
Disallow: /checkout/
Disallow: /user-data/
Allow: /products/
Allow: /sustainability/
Allow: /about-us/
Allow: /blog/
Allow: /contact/

User-agent: ClaudeBot
Disallow: /admin/
Disallow: /cart/
Disallow: /checkout/
Allow: /products/
Allow: /sustainability/
Allow: /about-us/
Allow: /blog/

User-agent: PerplexityBot
Disallow: /admin/
Disallow: /cart/
Disallow: /checkout/
Allow: /products/
Allow: /sustainability/
Allow: /about-us/
Allow: /blog/

User-agent: *
Disallow: /admin/
Disallow: /cart/
Disallow: /checkout/
Allow: /products/
Allow: /sustainability/
Allow: /about-us/
Allow: /blog/

Contact: info@rootwave.org`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}