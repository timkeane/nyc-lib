PACKAGE_VERSION=$(jq -r ".version" package.json)
echo '##' ${PACKAGE_VERSION} >> CHANGELOG.md
git fetch --tags
LOG=$(git log $(git describe --tags --abbrev=0)..HEAD --pretty=format:"%h %s")
echo ${LOG} >> CHANGELOG.md
