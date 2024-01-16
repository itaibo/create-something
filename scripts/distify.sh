#! /bin/bash

echo "#!/usr/bin/env node" | cat - "./dist/index.js" > temp && mv temp "./dist/index.js"

cat >./dist/package.json <<!EOF
{
  "type": "commonjs"
}
!EOF
