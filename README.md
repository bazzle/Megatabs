# Megatabs v1

Introducing Megatabs. How I've always imagined browser tabbing should work. With parent/child relationships.

* Parent/child tab model using two horizontal rows.
* The top row works like a normal tab bar. Opening a child tab creates a second row beneath it, contextual to the active parent — switching parents swaps the child row like a megamenu. (hence the name!)
* Only two levels: parent and child. No deeper nesting, keeping the interface simple and vertical space minimal.
* Standard browser shortcuts are preserved: click navigates in place, ⌘+Click opens a sibling on the same row. The only new shortcut is ⌘+⇧+Click from a parent tab to open a child.
* Closing a parent tab closes all its children. The child row stays visible as long as any parent has children open, avoiding jarring layout shifts.

## Run locally

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

