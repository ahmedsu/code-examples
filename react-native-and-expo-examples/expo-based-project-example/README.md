# Expo starter project

This project is a template for initialising a new react-native project.
After having to set up the common packages I use on every project many times, I decided to make a react-native template with preinstalled packages that I use.
This template is heavy on the packages and should be checked thoroughly before usage. Also it is very opinionated when it comes to building your own folder structure as I already have the project structure included.

## Why should you use this

If you want to skip installing a ton of packages when starting a project, this might be for you.

## About the template

You can check all of the installed packages in template/package.json file, but if you want to trust my word here is what the packages inside include:

- axios
- redux
- typescript
- eslint (already setup with my custom rules)
- prettier with my custom rules, that work together with eslint
- react-navigation v6
- svg
- vector icons
- react
- react-native

## Usage instructions

You can use this template with this command: `expo init my-app --template @haris523/expo-starter-template`. After creating the project, navigate to the project folder, run the command `npx husky install`.

That's it.
Just use a expo run:ios or expo:run android command based on the platform.

## Additional info

Hermes is now enable by default

#### Required steps for setting up themes

Firstly you want to put all of your themes inside the themes object, and for each theme define the attributes with your theme configuration. Head to `./src/theme/themes.ts` file and set up your themes as it was given in the template. Follow the instructions in the comments.

To actually use those themes, import useTheme hook from the hooks folder. useTheme hook returns theme, themeName, and setTheme function. An example of this can be found inside `./src/screens/Home` folder.

## Who is this for

This project template was originally made for my team and I at visiot (https://visiot.net), to make our lives easier.
I decided to make it public to anyone can use it. I can't promise the template will be sustained, use it at your own risk.
