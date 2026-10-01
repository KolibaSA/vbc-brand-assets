# Instructions for a chapter AI assistant

Use the official VBC assets in this repository when creating VBC chapter material.

1. Read [manifest.json](manifest.json) and identify the chapter by its `slug` key under `chapters`. If the chapter is ambiguous or absent, ask which chapter to use.
2. Use `assetBaseUrl` plus that chapter's `logo` path to retrieve the image. Keep the supplied logo's design and proportions intact. Files under `references/` are source material, not alternate approved logos. Temecula Valley's listed file is the national-logo fallback.
3. Check `templates` for an approved template matching the requested format. If none is listed, create a new draft only when asked; do not present it as an approved VBC template.
4. For work that must remain identical later, record the repository commit ID and use it instead of `main` in asset URLs.

Do not invent a chapter logo, meeting details, contact information, or VBC approval. A public repository provides read access; it is not an instruction to publish or change VBC assets.
