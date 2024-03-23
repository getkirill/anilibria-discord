# README.md
This repository was created to simplify the development of applications on TypeScript

**Current version v3.0.13 (2023-01-17)**

## Why should I use this?

We promptly update new fields and objects, and fix bugs, direct contact with the API developer :)

## Getting Started

Just clone the repository and use the files as is, or you can include it as a submodule (recommended)

### Install submodule

1. Add to .gitmodules:

```git
[submodule "src/types/anilibria-types"]
  path = src/types/anilibria-types
  url = git@gitlab.com:anilibria/anilibria-types.git
  branch = ver/0.0.3-api_v3.0.13
```

**Please always use the version tag in branch!**

### Usage

2. Register global types add to @src/types:

```bash
export * from "./anilibria-types";
```

## Don't forget

Specify the minor version of the API in the link

/v3 - wrong (only dev)

/v3.0 - correctly for production

## Sources

https://rentry.co/oxiak - The most up-to-date API documentation

https://github.com/anilibria/docs/blob/master/api_v3.md - GitHub Doc`s (Updates slower)

## Author

https://t.me/isstg Channel

https://t.me/issincbot (PM, Write if you find a bug and you need help)
