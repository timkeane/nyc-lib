git push origin dev
git checkout master
git merge dev
git push origin master
git checkout dev
git tag v$1
git push origin v$1
export NODE_ENV=stg
yarn deploy
export NODE_ENV=prd
yarn deploy
yarn pkg
cd dist
npm publish
cd ..
export NODE_ENV=dev

