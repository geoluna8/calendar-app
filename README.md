# Calendar App - React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

- npm create vite@latest
- npm install
    - npm i react-router
- npm i react-big-calendar
    - npm i date-fns
    - npm install --save react-modal
    - npm i react-datepicker
    - npm i sweetalert2
- npm install @reduxjs/toolkit
- npm install react-redux
- npm install axios

- Testing
    - npm install --dev jest babel-jest @babel/preset-env @babel/preset-react
    - npm install --dev @testing-library/react @types/jest jest-environment-jsdom
    - package.json scripts => "test": "jest --watchAll"
    - Crear archivo babel.config.js
        - export default { presets: [ [ '@babel/preset-env', { targets: { esmodules: true } } ], [ '@babel/preset-react', { runtime: 'automatic' } ], ], };
        - Crear archivo jest.config.js
            export default { testEnvironment: 'jest-environment-jsdom', setupFiles: ['./jest.setup.js'] }
        - Crear jest.setup.js
            - npm i -D dotenv