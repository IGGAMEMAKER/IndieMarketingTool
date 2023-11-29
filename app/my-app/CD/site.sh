cmt=$1
source nvmuse

git commit -a -m "Site update: $cmt"
git push
node serverManager.js site