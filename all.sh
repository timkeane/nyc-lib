git push origin dev
git checkout master
git merge dev
git push origin master
git tag $1
git push origin $1
git checkout dev
export NODE_ENV=stg
yarn deploy
export NODE_ENV=prd
yarn deploy
yarn pkg
cd dist
npm publish
cd ..
EXPORT_NODE_ENV=dev

