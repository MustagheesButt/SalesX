## Introduction

SalesX is a next-gen Point of Sales system, built using Electron and L(ovefield)ERN stack. 

## Getting Started

To setup and run the program:

1. Make sure you have NodeJS installed and updated.
2. From the project root directory, run:

    `npm install -g electron-builder concurrently cross-env wait-on`

    This will install all global development dependencies.

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

- [https://www.youtube.com/watch?v=zq-XcnjLpXI]
