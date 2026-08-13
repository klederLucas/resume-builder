# Resume Builder

An A4 resume generator that runs entirely in your browser. Fill in a form, watch
the document render live, and print it to PDF — no account, no upload, no
server.

**🔗 [Open the app](https://resume-builder.kleder1994.workers.dev)**

> The app interface is in Brazilian Portuguese. The resume itself can be
> generated in either Portuguese or English.

## Your data never leaves your browser

This project has no backend. No API, no database. What you type is kept only in
your own browser's `localStorage`, and the PDF is produced by Chrome's print
function. Nothing is sent anywhere.

## What it does

- **Three steps**: pick a template, fill in your data, print.
- **Bilingual document**: the same resume renders in Portuguese or English, with
  section headings translated.
- **Faithful printing**: real A4 output, with the coloured sidebar running to the
  bottom of every page and no entry split across a page break.
- **Autosaved draft**: what you write is stored as you type, so closing the tab
  loses nothing.
- **Import and export**: download your resume as JSON and load it back later.

## Stack

React 19 + TypeScript, Vite, Tailwind CSS v4 (CSS-first, no
`tailwind.config.js`), shadcn/ui, react-hook-form with Zod, and react-to-print.
Deployed to Cloudflare Workers as static assets.

## Running locally

```bash
npm install
npm run dev        # dev server on http://localhost:3000
```

Other commands:

```bash
npm run check      # tsc --noEmit
npm run test       # vitest run
npm run build      # outputs to dist/public
npm run preview:cf # build + wrangler dev, served exactly as Cloudflare will
npm run deploy     # build + wrangler deploy
```

## Structure

```
client/src/
  pages/          # one page per step: picker, editor, preview
  templates/      # resume templates (one directory each)
  components/     # app UI + form fields
shared/resume/    # schema, view projection, JSON import, labels
```

Data flows one way: a `Resume` (the schema) goes through `selectResumeView()`
and becomes the `ResumeView` a template draws. The rule that empty fields
disappear from the document lives entirely in that projection, so a new template
only has to draw — it never reimplements any filtering.

To add a template: create a folder under `client/src/templates/` and register it
in `registry.ts`. The component receives `{ view, labels, mode, ref }`.

## Printing

On `/preview`, use the print button and, in Chrome's dialog, choose **Save as
PDF**, margins **None**, scale **100%**. The sidebar colours are forced through
`print-color-adjust`, so the output is correct even with "Background graphics"
unchecked.
