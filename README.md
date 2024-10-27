# `iso-chidiya-uddi`

A multiplayer [Chidiya Uddi](https://dsource.in/resource/indian-games/indoor-games/chidiya-udd) game built by [IndiaSocial (ISO)](https://reddit.com/r/IndiaSocial) community Discord members.

# Contribution Rules

1. Simple: fork the repo, make meaningful and valuable code updates, create a pr.

# Usage Guide

## Prerequisites

1. [Node.js](https://nodejs.org/en)
2. A text editor [[Visual Studio Code](https://code.visualstudio.com/download) recommended]

### Prettier

##### (how to use)

1. Download prettier extension in VS Code.
1. Go to Settings (Ctrl+,) and set Format on save to `yes`.
1. Save files which need formatting. These files will be formatted according to the config in `.prettierrc` file.

> Note: Always format before raising PR.

## Frontend

All frontend part is housed in `./frontend/`, ensure that you have all the pre-requisites installed on your system.

1. Install packages:

```
npm ci
```

2. Start Development Server:

```
npm run dev
```

## Backend

Install all prerequisites in system.

To run the current version of backend:

1. Run navigate to the backend folder. `[BASE_DIR]/backend/`
1. Run the command
    > node server.js

(Backend is still under development)
