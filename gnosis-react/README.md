# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

add env file in server :


GOOGLE_CLIENT_ID = 840218405895-07abtcjiasttgjuidc5rdjt5nlh667d4.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = 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
CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=anhiudiemhien
JWT_EXPIRATION_TIME=60m
BASE_URL=http://localhost:3000

# FIREBASE_PRIVATE_KEY =1fc7e3ac9a8b39ceb2788034de7db70bf218f3fc
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCrd2STyXKysXSi\nGIFZFGVehjBr9s2HqcP+0GNqODkjsfEmlxReFCononb6M3QFzT8ljkWBIybwsKXO\n9x+C746TVBy9wUnVZLZpuPc+sVSWceqn9RdMjl4xry0eP6FRVkta0UFQpU09ZErf\nJI5CJtyNv/W9i136FzbTdDA0q/ezJbtTWVYVsB9bHUeyL5H5sUcFkN9721mX/QkJ\nLQE6LIwXyPnaleqv3uIB5ZAv3P0gNWkmxJdmJEbGAaYuZzAKIZ9dHlH/mBWPCps9\nzMTVA9iCBqibn+LF6UvtO38ssEO9kRiM1XVPJY4uEHJ5xCdk0DqygAG1DP7wnr00\nthfieqrfAgMBAAECggEAC/U7H+1kIN8sVaOk3awE98ce+GCRa90kjJBG5qD+JyWh\nPkI6CueYGwSDDKbq9/6c4UcfRMbJT+7Z2Wm1mmGPjWnHyVoCBq5L5GqgX5BpaEaQ\niV8X3WBuZEOlv17LpssAXViLmA63KMlmSVKY0zc3mXEiN7JQ/wCAc9W+COZXU3h4\nMHvBd/VjfndAGlpH509CLu97+Z/JIsTKwx5QZkI07eug4Z0ZCRWnFaK9IBPNeRYD\nhWSfOodXWwMfgfkD63TOtLbd3PtkbBjUOWfNQZzh07M4Kg7AbUVqo+jusNry+LTz\n+MDBAp4dnMha+DSny7a+N3JW76iw+Er84BPvCPdnLQKBgQDveBTFEdCvAydzSmZ3\nlYQFE23kwpdX5rj1DSFmK6DhvA5LhS5ey1pmBGYBDnLGga8OMumpZy9cyGuLB3mn\nDZRA6tIKlA2TBbrnH8k4p4S06qJcFJYkpYghMdsdL6ljgdSlaywxs9DUz3Fys5Mc\nhjJidxnfXVPDtJHHFvc6HvHWLQKBgQC3TY/nimuN0FCl91lm7QDloNOk76qFWBmQ\nTou7EDEj+tqz3Xw7+3GSLr3/Ro3yH6G9JU4jZPMSd41lKm1jGK9qLfzvPRfjUxsz\n8zg+xlgL5NpZuwygzaGrQn/3sNDHU9pvDyMEoRCoSrX6SBpblt0kM2oIk9g5+abJ\nhweXORsYuwKBgB4kNjEL6gFtWzTWw4j/x8s/w9BMcfI9d0BY88BBc5GWMxJsZAbI\nf8theFlfsTCtOBSIcgLBmyOJkofAXB6bxfJZ3DA6rG66BOl8hb5cz4ZaFi+S48cf\nEsBi3xqQWjjNKa/cioaDBKEUr0npsnWfqo3cQeRsgdObUdIGYP3u0S/NAoGATyOu\nmLH7g6vH1g/3ymdS9tE77z8GaTHDP7mZvHbeMIGSwQtEIwWJYCrMHxXQHRQpGWes\n170y8Osq4d2ygpFa0sXuKUBAOwZbfU9qHjg2NVRmLU2Dwz1kqnM4mrD9QsHiUgbA\nALSlY3N2JAvTTW3SJloIUpG6TjWKHAIvdcvS9hcCgYBfIPxRK55ZwwXpDa5psg1o\ngt/5TtxyN+9K97J1E6AfUPhx9tDbCV4nJZt5g9YSq1mt+9GLyL7PLDzwVJpv6Yas\nBwOZs/Yo6r71jO48MPTYmg6lgXMZg634dhE0JFSf0A60368oqGvriTDKtyJAmONW\ng0GWipzKBorkpSpLrARK2w==\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-tt16x@gnosis-reactjs.iam.gserviceaccount.com