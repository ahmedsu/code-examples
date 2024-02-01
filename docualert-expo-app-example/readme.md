## How to run deployment

# Run with specifying version manually: sh ./release.sh 3.3.1

# Run for automatic up of major version (Used for big updates): sh ./release.sh major

# Run for automatic up of minor version (Used for smaller updates): sh ./release.sh minor

## BELOW ARE COMMANDS NOT USED NOW:

## release-ios:

# name: Build and release iOS app

# runs-on: macos-latest

# steps:

# - uses: actions/checkout@v2

# - uses: actions/setup-node@v1

# with:

# # node-version: '20.2.0'

# - uses: ruby/setup-ruby@v1

# with:

# ruby-version: '3.1.2'

# - name: Install Fastlane

# run: cd ios && bundle install && cd ..

# #- name: Install packages

# run: yarn install

## - name: Install pods

# run: cd ios && pod install && cd ..

# - name: Prebuild iOS

# run: npm run prebuild-ios

# - name: Execute Fastlane command

# run: cd ios && fastlane github
