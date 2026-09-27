# Veterans Beer Club brand assets

Approved VBC logos and chapter artwork for chapters and their designers or AI assistants. This repository is public so the files can be read without a GitHub account. VBC maintainers publish changes; chapters should use the listed assets as supplied.

## Find your chapter logo

1. Open [manifest.json](manifest.json).
2. Find your chapter's slug under `chapters` (for example, `yolo`).
3. Add its `logo` path to `assetBaseUrl` to get a direct image URL. For example: [Yolo-Solano logo](https://raw.githubusercontent.com/KolibaSA/vbc-brand-assets/main/logos/chapters/yolo.png).

The national logo is at [logos/national/vbc-logo.webp](logos/national/vbc-logo.webp). Temecula Valley currently uses that national logo because no Temecula badge was supplied. The [chapter composite](references/vbc-chapters.jpg) is a reference image, not a substitute for an individual logo.

`main` points to the latest approved files. To preserve a particular version in a finished design, replace `main` in the URL with the commit ID used for that design. [GitHub explains version-specific links](https://docs.github.com/en/repositories/working-with-files/using-files/getting-permanent-links-to-files).

## Templates

See [templates/README.md](templates/README.md) and the `templates` list in `manifest.json`. National publishes approved templates through its separate, restricted asset portal. Other published files appear in the `uploads` list.

## Guidance for chapter AI assistants

Read [AI-START-HERE.md](AI-START-HERE.md). Use the exact logo file listed for the chapter. Do not redraw, modify, or invent an official VBC mark. Ask for an approved template if the manifest lists none for the requested format.

## Source and use

The logo and composite files are byte-for-byte copies of the assets used by the VBC site at source commit `7e70114ddcad3e47f15c4535f66be8aa415b3117`. The individual badge PNGs were extracted from VBC's supplied chapter artwork for that site. The site source repository is private; everything chapters need to read is here. This repository contains brand assets and portal source code, but no member data, credentials, or editor access. The [running asset portal](portal/README.md) requires private National authorization; chapters cannot use it to change assets.

VBC chapters may use these files for VBC chapter communications and activities. Public download access does not authorize unrelated uses of the VBC name or marks. Contact VBC national for a new logo, template, or other use.
