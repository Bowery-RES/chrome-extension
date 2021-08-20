# Bowery Chrome Extension Svelte

## Development
1. Check if your Node.js version is >= 6.
2. Clone the repository.
3. Run `npm install`
4. Create `.env` file with the following content:
    ```
    GOOGLE_API_KEY=
    BOWERY_APP_DOMAIN=
    AMPLITUDE_API_KEY=
    ```
5. Run the following command:
    ```
    $ npm start
    ```
6. Load your extension on Chrome following:
    1. Access `chrome://extensions/`
    2. Check `Developer mode`
    3. Click on `Load unpacked extension`
    4. Select the `build` folder.
7. Have fun.

## Add to chrome
1. Access `chrome://extensions/`
2. Check `Developer mode` switch
3. Click on `Load unpacked extension`
4. Select the folder containing extensions source.

## Webpack auto-reload and HRM
To make your workflow much more efficient this boilerplate uses the [webpack server](https://webpack.github.io/docs/webpack-dev-server.html) to development (started with `npm start`) with auto reload feature that reloads the browser automatically every time that you save some file o your editor.

You can run the dev mode on other port if you want. Just specify the env var `port` like this:

```
$ PORT=6002 npm start
```

## Packing
After the development of your extension create `.env` file with the following content:

```
GOOGLE_API_KEY=
BOWERY_APP_DOMAIN=
AMPLITUDE_API_KEY=
```
Run command:
```
$ npm run build
```
Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store.
