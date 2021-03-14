# Ashes.live static front-end

This is the front-end Javascript application for Ashes.live, a fan-developed deckbuilder
and community site for the card game Ashes Reborn. The site uses the following frameworks
to make developing easier:

* [VueJS 3](https://v3.vuejs.org) for Javascript logic
* [Tailwind CSS 2](https://tailwindcss.com/) for utility-first styling

## Installation

First, you will want to install a local copy of the Python API (don't worry, it's not scary!).
Please see instructions at https://github.com/onecrayon/api.ashes.live#dependencies (and make
sure to perform the steps listed under First Run, as well! You can ignore the rest). You can
find API endpoint documentation at your root local API URL, or https://api.ashes.live

Once you have the backend running:

1. Copy the file `.env.example` and name it `.env`
2. In your favorite Terminal, run `npm install`
3. In your favorite Terminal, run `npm run dev`
4. Load the URL specified in your browser; defaults to http://localhost:3000

That's it! You've now got an automatic refreshing local copy of the front end application.

## Command line

* `npm run dev`: run an auto-reloading, local development server
* `npm run build`: build a deployable copy of the site (will be saved to `dist/` folder)

## Deployment

The site can be deployed anywhere, since the generated site is wholly static. When building
for production, please remember to set your environment variables properly! In particular,
it is important to set `NODE_ENV=production` or your CSS files will be way too large.
