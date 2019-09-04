<p align="center">
  <a href="https://staple.moretape.com/">
    <img src="/img/logo.png?raw=true" width="100"/>
  </a>
</p>

# Staple &middot; [![GitHub license](https://img.shields.io/npm/l/staple.svg)](https://gitlab.com/moretape/staple/blob/develop/LICENSE) [![npm version](https://img.shields.io/npm/v/staple.svg?style=flat)](https://www.npmjs.com/package/staple)

Staple is a JavaScript library for building API's for your user interfaces in any NodeJS framework.

- Maintain papers (plugins) once and use them in any NodeJS framework.
- No need to write browser requests manually for your frontend apps. They will be automatically be generated.
- Prototype apps without worrying about backend stuff.

<p align="center"><img src="/img/demo.gif?raw=true"/></p>

# Installation

You need to install [Node.js](https://nodejs.org/en/download/) first, then install the tool globally using this command:

```sh
npm install -g staple
```

> Still facing an issue? Check the [Issues](#issues) section or open a new issue.

The installation should be very smooth with Node.js v10 or lower. For newer versions, if the installation is failed, you may need to install the development tools to build the `C++` add-ons. Check [node-gyp](https://gitlab.com/nodejs/node-gyp#installation).

# Getting Started

Get started by choosing which paper you need for your app and just staple it using the `paper` command.

```sh
staple paper <name>
```

# Usage

> You can use the `--help` option to get more details about the commands and their options

```sh
staple <command> [options]
```

## Examples

We have several examples [on the website](#examples). Here is the first one to get you started:

```sh
staple paper users mailer
```

### [Contributing](https://gitlab.com/moretape/staple/blob/develop/CONTRIBUTING.md)

The main purpose of this repository is to continue to evolve Staple core, making it faster and easier to use. Development of Staple happens in the open on GitHub, and we are grateful to the community for contributing bug fixes and improvements. Read below to learn how you can take part in improving Staple.

### [Code of Conduct](https://gitlab.com/moretape/staple/blob/develop/CODE_OF_CONDUCT.md)

Moretape has adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](https://gitlab.com/moretape/staple/blob/develop/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### License

Staple is [MIT licensed](./LICENSE).
