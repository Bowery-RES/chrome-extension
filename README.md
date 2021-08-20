# Bowery Chrome Extension Svelte

## Development
* Check if your Node.js version is >= 12.
* Clone the repository.
* Run `npm install`
* Create `.env` file with the following content:
    ```
    GOOGLE_API_KEY=***
    BOWERY_APP_DOMAIN=***
    AMPLITUDE_API_KEY=***
    APP_ENV=development
    ```
* Run the following command:
    ```
    $ npm start
    ```
* Load your extension on Chrome following:
    1. Access `chrome://extensions/`
    2. Check `Developer mode`
    3. Click on `Load unpacked extension`
    4. Select the `build` folder.
* Have fun.


## Webpack auto-reload and HRM
To make your workflow much more efficient this boilerplate uses the [webpack server](https://webpack.github.io/docs/webpack-dev-server.html) to development (started with `npm start`) with auto reload feature that reloads the browser automatically every time that you save some file o your editor.

You can run the dev mode on other port if you want. Just specify the env var `port` like this:

```
$ PORT=6002 npm start
```

## Packing
Create `.env` file with the following content:

```
GOOGLE_API_KEY=
BOWERY_APP_DOMAIN=
AMPLITUDE_API_KEY=
APP_ENV=
NODE_ENV=production
```
Run command:
```
$ npm run build
```
Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store.

### Add to chrome
1. Access `chrome://extensions/`
2. Check `Developer mode` switch
3. Click on `Load unpacked extension`
4. Select the folder containing extensions source.

## Release
_Releases are maintained by Github releases. The flow is the following_
* Update version in package.json to `<CURRENT_VERSION>`
* Create new release in github with `<CURRENT_VERSION>` tag
* Archives with extension for each environment automatically attached as files to release page
### [Example Release](https://github.com/Bowery-RES/chrome-extension/releases/tag/v2.1.6)
