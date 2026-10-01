# Veterans Beer Club brand assets

Approved VBC logos and chapter artwork for chapters and their designers or AI assistants. This repository is public so the files can be read without a GitHub account. VBC maintainers publish changes; chapters should use the listed assets as supplied.

## Find your chapter logo

1. Open [manifest.json](manifest.json).
2. Find your chapter's slug under `chapters` (for example, `yolo`).
3. Add its `logo` path to `assetBaseUrl` to get a direct image URL. For example: [Yolo-Solano logo](https://raw.githubusercontent.com/KolibaSA/vbc-brand-assets/main/logos/chapters/yolo.png).

The national logo is at [logos/national/vbc-logo.webp](logos/national/vbc-logo.webp). Temecula Valley currently uses that national logo because no Temecula badge was supplied. The [chapter composite](references/vbc-chapters.jpg) is a reference image, not a substitute for an individual logo. A logo appearing in the catalog does not, by itself, establish that a chapter has a published page or is currently active.

`main` points to the latest approved files. To preserve a particular version in a finished design, replace `main` in the URL with the commit ID used for that design. [GitHub explains version-specific links](https://docs.github.com/en/repositories/working-with-files/using-files/getting-permanent-links-to-files).

## Templates

See [templates/README.md](templates/README.md) and the `templates` list in `manifest.json`. National publishes approved templates through its separate, restricted asset portal. Other published files appear in the `uploads` list.

## Guidance for chapter AI assistants

Read [AI-START-HERE.md](AI-START-HERE.md). Use the exact logo file listed for the chapter. Do not redraw, modify, or invent an official VBC mark. Ask for an approved template if the manifest lists none for the requested format.

## Source and use

The 38 chapter marks supplied in VBC's Google Drive folder are published as 400 × 400 transparent PNGs under `logos/chapters/`; the manifest selects the approved image for each chapter key. Exact 2000 × 2000 Drive files are archived under `references/chapters/` (background) and `references/chapters-transparent/` (transparent), with matching file stems. These reference files are source material, not alternate approved logos. The earlier composite and extracted badges remain in Git history, while chapters not covered by the Drive set retain their prior manifest mapping. The site source repository is private; everything chapters need to read is here. This repository contains brand assets and portal source code, but no member data, credentials, or editor access. The [running asset portal](portal/README.md) requires private National authorization; chapters cannot use it to change assets.

VBC chapters may use these files for VBC chapter communications and activities. Public download access does not authorize unrelated uses of the VBC name or marks. Contact VBC national for a new logo, template, or other use.
