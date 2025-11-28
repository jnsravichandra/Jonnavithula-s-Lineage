```md
# Project structure (proposed)

Root
- package.json
- tsconfig.json
- vite.config.ts
- README.md
- .gitignore
- eslint.config.js

/public
- index.html
- assets/          # Static images, favicons, fonts (served as-is)

/src
- main.ts          # app entry
- App.(ts|tsx|vue) # root component
- components/      # reusable UI components
- pages/           # page-level components
- styles/          # global css / scss
- assets/          # small assets imported by code
- utils/           # helpers
- types/           # shared TS types
- hooks/           # custom hooks (for React)

/docs
- colour-palette.md
- project-structure.md

.github
- workflows/ci.yml  # CI for lint/build/test

Notes
- Keep root tidy: config + readme only.
- Large static files → public/assets (not src/assets).
```