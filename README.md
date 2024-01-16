# npm create something
A command to create something.

# Usage
Use this command whenever you want to start something new:

```sh
npm create something@latest
```

And that's it! Now start coding!

# What does it include?
For this proof of concept, `something` includes the following:
- New Git repo with basic `.gitignore`
- Basic `package.json` with commands
- TypeScript with a basic and strict configuration
- `src` directory with an `index.ts` file waiting for you
- Jest.js with basic configuration for testing and a `tests` directory
- Types for Jest.js and Node
- `@/*` path that works also in the tests and dist

## npm commands
You can execute the following commands out-of-the-box:

```
npm run dev

npm run test

npm run test:watch

npm run build

npm run start
```

# Future
In the future, `something` will let you specify what do you want to create and
prepare the basic folder structure and configurations (e.g. API, CLI, monorepo, ...).
