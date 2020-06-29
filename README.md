## Introduction

SalesX is a next-gen Point of Sales system, built using Electron and L(ovefield)ERN stack. 

## Getting Started

To setup and run the program:

1. Make sure you have NodeJS installed and updated.
2. From the project root directory, run:

    `npm install`

    This will install all the required dependencies.

3. To start React-only version, run:

    `npm run react-start`
    
    To start the complete app, run:

    `npm run start`

## Packaging/Building

To build a platform specific release, you need to be on that platform (or at least that's what I think). Run:

`npm run build`

To configure build options, see [electron-builder configuration docs](https://www.electron.build/configuration/configuration).

## Miscellaneous Info
### Tutorials Used

- [Desktop App with Electron and React - Will Ward](https://www.youtube.com/watch?v=Cdu2O6o2DCg)
- [Developing ElectronJS applications with SQLite3 - Tarik Guney](https://www.youtube.com/watch?v=c76FTxLRwAw)
- [Electron Tutorial: Get data from database and display it using JQuery](https://www.youtube.com/watch?v=oxZ5lIk4B38)

comment on: https://www.youtube.com/watch?v=zq-XcnjLpXI

I personally can't recommend Create React App for Electron development. You can't use native node modules with Create React App [0]. This way Electron becomes just a Chromium window. I would recommend Electron Forge[1] with the React template[2] or as you mentioned Electron React Boilerplate [3]. 

The React template of Electron Forge is much less opinionated about react, but delivers a lot of Electron goodies like building and publishing of packages. It also comes with electron-compile[4]. Which lets you use a plethora of languages for Electron development.

Electron React Boilerplate on the other hand is much more similar to Create React App in regard to project structure and react development. But it is not as advanced as electron-forge in regard to electron.

[0] https://github.com/facebook/create-react-app/issues/3074
[1] https://electronforge.io/
[2] https://electronforge.io/templates
[3] https://github.com/electron-react-boilerplate/electron-react-boilerplate
[4] https://github.com/electron-userland/electron-compile