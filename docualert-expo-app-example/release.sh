VERSION=$1

cd android
fastlane version version:$VERSION
cd ..
cd ios
fastlane version version:$VERSION
NEWVERSIONSTRING=$(fastlane run get_version_number)
NEWVERSION=${NEWVERSIONSTRING#*Result: }
echo "New version number: $NEWVERSION"
cd ..

NEWVERSION=${NEWVERSION%????}
git add .
git commit -m "Update app to version $NEWVERSION"
git push origin main

git tag -a "v"$NEWVERSION -m 'add version tag' -f
git push origin v$NEWVERSION -f

