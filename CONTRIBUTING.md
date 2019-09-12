# Contributing to Staple

Loving Staple and want to get involved? Thanks! There are plenty of ways you can help.

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue or assessing patches and features.

## Core Ideas

As much as possible, we try to avoid adding configuration and flags. The purpose of this tool is to provide the best experience for people getting started with Staple, and this will always be our first priority. This means that sometimes we [sacrifice additional functionality] because it is too hard to solve it in a way that wouldn’t require any configuration.

We prefer **convention, heuristics, or interactivity** over configuration.<br>
Here are a few examples of them in action.

### Convention

Instead of letting the user specify the entry filename, we always assume it to be `src/index.js`. Rather than letting the user specify the output bundle name, we generate it, but make sure to include the content hash in it. Whenever possible, we want to leverage convention to make good choices for the user, especially in cases where it’s easy to misconfigure something.

### Heuristics

Normally, `npm start` runs on port `4000`, and this is not explicitly configurable. However, some environments like cloud IDEs want the programs to run on a specific port to serve their output. We want to play well with different environments, so Staple reads `PORT` environment variable and prefers it when it is specified. The trick is that we know cloud IDEs already specify it automatically, so there is no need for the user to do anything. Staple relies on heuristics to do the right thing depending on environment.

### Interactivity

We prefer to add interactivity to the command line interface rather than add configuration flags. For example, `npm start` will attempt to run with port `4000` by default, but it may be busy. Many other tools just fail in this case and ask that you pass a different port, but Staple will display a prompt asking if you’d like to run the app on the next available port.

### Breaking the Rules

No rules are perfect. Sometimes we may introduce flags or configuration if we believe the value is high enough to justify the mental cost. For example, we know that apps may be hosted paths different from the root, and we need to support this use case. However, we still try to fall back to heuristics when possible.

## Submitting a Pull Request

Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

Please **ask first** if somebody else is already working on this or the core developers think your feature is in-scope for Staple. Generally always have a related issue with discussions for whatever you are including.

Please also provide a **test plan**, i.e. specify how you verified that your addition works.

## Folder Structure of Staple

`staple` is a monorepo, meaning it is divided into independent sub-packages.<br>
These packages can be found in the [`packages/`](https://gitlab.com/moretape/staple/tree/develop/packages) directory.

### Overview of directory structure

```
packages/
  staple/
  papers/
    mailer-paper/
    routes-paper/
    shop-paper/
    users-paper/
```

### Package Descriptions

#### [staple](https://gitlab.com/moretape/staple/tree/develop/packages/staple)

This package is the heart of the project, which contains the scripts for setting up the development server, building production builds, configuring all software used, etc.

The global CLI command code can be found in this directory, and shouldn't often be changed. It should run on Node 0.10+.

#### [papers](https://gitlab.com/moretape/staple/tree/develop/packages/papers)

This folder is where or the main papers (plugins) live. All the papers are optional, none of them are required for staple to run.

#### [mailer-paper](https://gitlab.com/moretape/staple/tree/develop/packages/papers/mailer-paper)

This paper it's in charge of sending emails. It allows other papers to send emails.

#### [routes-paper](https://gitlab.com/moretape/staple/tree/develop/packages/papers/routes-paper)

This paper generates routes automatically based on the booklet (all the stapled papers) and all the default papers configurations. It allow staple to run in any NodeJS framework without any configuration by just using it as a middleware ex. `app.use(staple.routes)`.

#### [shop-paper](https://gitlab.com/moretape/staple/tree/develop/packages/papers/shop-paper)

This paper generates an API for a shop with payments, subscriptions, products, orders and other ecommerce functionalities.

#### [users-paper](https://gitlab.com/moretape/staple/tree/develop/packages/papers/users-paper)

This paper generates an API for a users with login, signup, forgot password and other user-related functionalities.

## Setting Up a Local Copy

1.  Make sure you have a `PostgreSQL` server running.

2.  Clone the repo with `git clone https://gitlab.com/moretape/staple`

3.  Run `yarn` or `npm install` in the root `staple` folder.

4.  Run `yarn bootstrap` or `npm run bootstrap` in the root `staple` folder.

Once it is done, you can modify any file locally and run `npm run start` and it will run the `examples/with-sequelize` project by default.

If you want to try out the end-to-end flow with the global CLI, you can do this too:

```sh
cd packages/staple
npm link

# then you can use it into any app, for example:
cd path/to/my-awesome-react-app
staple paper users
```

## Installing packages

To install packages into any of the `examples/*` or `packages/*`, you need to have [`lerna`](https://github.com/lerna/lerna) installed. After, you can add npm packages like:

```sh
lerna add <package> --scope=<example-or-paper>
```

For example:

```sh
lerna add underscore --scope=staple
```

or

```sh
lerna add underscore --scope=users-paper
```

or

```sh
lerna add underscore --scope=staple-with-sequelize
```

## Tips for contributors using Windows

The scripts in tasks folder and other scripts in `package.json` will not work in Windows out of the box. However, using [Bash on windows](https://msdn.microsoft.com/en-us/commandline/wsl/about) makes it easier to use those scripts without any workarounds. The steps to do so are detailed below:

### Install Bash on Ubuntu on Windows

A good step by step guide can be found [here](https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/)

### Install Node.js

Even if you have node installed on your windows, it would not be accessible from the bash shell. You would have to install it again. Installing via [`nvm`](https://github.com/creationix/nvm#install-script) is recommended.

### Line endings

By default git would use `CRLF` line endings which would cause the scripts to fail. You can change it for this repo only by setting `autocrlf` to false by running `git config core.autocrlf false`. You can also enable it for all your repos by using the `--global` flag if you wish to do so.

---

_Many thanks to [h5bp](https://github.com/h5bp/html5-boilerplate/blob/master/.github/CONTRIBUTING.md) for the inspiration with this contributing guide_
