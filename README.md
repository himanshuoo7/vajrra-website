# vajrra.ai

The Vajrra company website. Plain HTML, CSS and JavaScript — no build step.

| File | What it is |
|---|---|
| `index.html` | Home: hero, industries, products by customer, principles, story, contact |
| `divyastra.html` | Divyastra product page |
| `acrf.html` | aCRF Gen product page (life sciences) |
| `privacy.html`, `terms.html` | Privacy Policy and Terms of Service (linked from the Google sign-in screen) |
| `styles.css`, `main.js` | Shared styles and behaviour (nav, tabs, reveals, contact form) |
| `assets/` | Logo, favicons, hero art, social share image |

## Preview locally

```sh
python3 -m http.server 8765
# open http://localhost:8765
```

## Publish on vajrra.ai (Cloudflare Pages, free)

1. Push this folder to a GitHub repo (e.g. `himanshuoo7/vajrra-website`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
   Build command: none. Output directory: `/`.
3. In the Pages project → Custom domains → add `vajrra.ai` and `www.vajrra.ai`.
4. At GoDaddy, either move the domain's nameservers to Cloudflare (simplest),
   or add the CNAME records Cloudflare shows you.

Vercel and Netlify work the same way: import the repo, no build step, add the domain.

## Before launch

- Set up the `hello@vajrra.ai` mailbox (the contact form opens the visitor's
  mail app addressed to it). Google Workspace or Zoho Mail both work with GoDaddy DNS.
- Swap the contact form for a real form backend (Formspree, Tally, or a
  Cloudflare Worker) when you want submissions collected automatically.
- Add privacy policy and terms pages before collecting emails from EU/UK visitors.
