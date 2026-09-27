# VBC National asset portal

This is a separate, National-only Cloudflare Worker for maintaining the public [VBC brand-assets repository](https://github.com/KolibaSA/vbc-brand-assets). Chapter sites and chapter staff have read-only access to the public files; they do not get portal accounts or repository write access.

The portal lists current chapter/national logos, lets an authorized National editor replace one at its stable path, shows links to the ten previous versions from Git history, and publishes up to ten new templates or other files in one commit. A successful upload is public immediately. The portal adds new template and other-asset paths to `manifest.json` so chapter AIs can discover them.

## Before deploying

1. Create a **dedicated** Cloudflare Worker named `vbc-national-assets`. Protect the Worker with a Cloudflare Access policy that allows only the chosen National staff email addresses, using One-Time PIN or the organization's identity provider. Do not expose the Worker without Access. The Worker also rejects requests unless Cloudflare supplies an authenticated Access identity.
2. Set `ALLOWED_EMAILS` to the same comma-separated National staff email addresses as a Worker variable. An empty or missing list denies everyone. Keep this list synchronized with the Access policy.
3. Create a GitHub fine-grained personal access token limited to **only** `KolibaSA/vbc-brand-assets` with **Contents: Read and write**. Store it as the Worker secret `GITHUB_TOKEN`. Never put it in the repository or frontend. A dedicated GitHub App installation token may replace this later.
4. Verify the intended VBC Cloudflare account and set its `account_id` in `wrangler.jsonc` before deploying; do not rely on a default account. From this directory, run `npm install`, `npm test`, then `npx wrangler deploy`. Confirm the deployed Worker is protected by Access before sharing its URL. Do a signed-in smoke test with a small test asset.

No contributor email addresses or GitHub credentials are stored in this public repository. The portal fails closed until both Access and its server-side allowlist are configured. It does not use the chapter-page application's editor accounts or resources.

## Publishing behavior

- Replacing an existing logo retains its public URL and extension. A chapter using the national fallback receives a new PNG at `logos/chapters/<chapter>.png` and the manifest switches to it in the same commit.
- An upload goes to `templates/` or `uploads/`; an existing filename is rejected, so a replacement can never happen by accident in the bulk uploader.
- All files in a bulk upload and the manifest update are committed together. If someone else publishes first, the request fails safely and the editor can refresh and retry.
- Upload limits: 10 files, 8 MB each, 20 MB total. Supported formats are PNG, JPG, WebP, PDF, PPTX, and DOCX. Logos accept the current file's image format only.
- Git history retains previous logos indefinitely; the interface displays the latest ten older versions. A repository administrator can recover any older version.

- Cloudflare Access configuration: https://developers.cloudflare.com/workers/configuration/cloudflare-access/
- GitHub token permissions: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
