<p align=center>
   <img src=https://raw.githubusercontent.com/lord/img/master/logo-slate.png width=226 alt=logo>
</p>

<p align=center>
   <i>A Node.js port of <a href=https://github.com/lord/slate>lord/slate</a></i>
</p>

<p align=center>
   Slate helps you create beautiful, intelligent, responsive API documentation.
</p>

<p align=center>
   <img src=https://raw.githubusercontent.com/lord/img/master/screenshot-slate.png width=700 alt=screenshot>
</p>

<p align=center>
   <em>The example above was created with Slate. Check it out at:
   <a href=https://node-slate.js.org>node-slate.js.org</a></em>
</p>

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/center-key/node-slate/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/node-slate.svg)](https://www.npmjs.com/package/node-slate)
[![Build](https://github.com/center-key/node-slate/workflows/build/badge.svg)](https://github.com/center-key/node-slate/actions/workflows/run-spec-on-push.yaml)

Features
--------

* **Clean, intuitive design** — With Slate, the description of your API is on the left side of your documentation, and all the code examples are on the right side. Inspired by [Stripe's](https://stripe.com/docs/api) and [Paypal's](https://developer.paypal.com/docs/api/overview) API docs. Slate is responsive, so it looks great on tablets, phones, and even in print.

* **Everything on a single page** — Gone are the days when your users had to search through a million pages to find what they wanted. Slate puts the entire documentation on a single page. We haven't sacrificed linkability, though. As you scroll, your browser's hash will update to the nearest header, so linking to a particular point in the documentation is still natural and easy.

* **Slate is just Markdown** — When you write docs with Slate, you're just writing Markdown, which makes it simple to edit and understand. Everything is written in Markdown — even the code samples are just Markdown code blocks.

* **Write code samples in multiple languages** — If your API has bindings in multiple programming languages, you can easily put in tabs to switch between them. In your document, you'll distinguish different languages by specifying the language name at the top of each code block, just like with Github Flavored Markdown.

* **Out-of-the-box syntax highlighting** for [150 languages](https://highlightjs.org/), no configuration required.

* **Automatic, smoothly scrolling table of contents** on the far left of the page. As you scroll, it displays your current position in the document. It's fast, too. TripIt uses Slate to build documentation for their new API, where their table of contents has over 180 entries. They've made sure that the performance remains excellent, even for larger documents.

* **Let your users update your documentation for you** — By default, your Slate-generated documentation is hosted in a public Github repository. Not only does this mean you get free hosting for your docs with Github Pages, but it also makes it simple for other developers to make pull requests to your docs if they find typos or other problems. Of course, if you don't want to use GitHub, you're also welcome to host your docs elsewhere.

Getting started with Slate is super easy! Simply fork this repository and follow the instructions below. Or, if you'd like to check out what Slate is capable of, take a look at the [sample docs](https://node-slate.js.org).

Getting Started with Slate
------------------------------

### Prerequisites

You're going to need:

 - **Node.js**

### Getting Set Up

1. Fork this repository on Github.
2. Clone *your forked repository* (not this original one) to your hard drive with `git clone https://github.com/YOURUSERNAME/node-slate.git`
3. `cd node-slate`
4. Initialize and start Slate:

```shell
npm install
npm run build
npm start
```

You can now see the docs at http://localhost:4567. Whoa! That was fast!

### Commands

Compile documentation to static site in `./build`:

```shell
npm run build
```

Run a dev server that live-reloads at http://localhost:4567:

```shell
npm start
```

Publish your docs to `origin/gh-pages` branch:

```shell
npm run deploy
```

Gulp Task
---------

Slate API documentation generation is also available as a Gulp task with the
[gulp-node-slate](https://github.com/center-key/gulp-node-slate) plugin.

<br>

---
[MIT License](LICENSE.txt)
