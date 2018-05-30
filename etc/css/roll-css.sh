mkdir tmp
mkdir build
cp ../../src/css/* ./tmp/
cp $1 ./tmp/
theme=$(basename $1)
cat ./tmp/$theme >> ./tmp/base.theme.css
postcss ./tmp/nyc-lib.css --o ./build/nyc-lib.css --no-map --config postcss.config.js
postcss ./tmp/nyc-ol-lib.css --o ./build/nyc-ol-lib.css --no-map --config postcss.config.js
rm -rf tmp