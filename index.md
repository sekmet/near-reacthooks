# NEAR React Hooks v0.1.x

Use react hooks to configure and interact with NEAR.

[Reference Docs](https://sekmet.github.io/near-reacthooks)

## Setup

Reference near-api-js in the browser, include it via CDN or add it to your asset pipeline as you would any other JavaScript library:

```html
<script src="https://cdn.jsdelivr.net/gh/nearprotocol/near-api-js/dist/near-api-js.js"></script>
```

Install the package from npm `npm i @sekmet/near-reacthooks` or `yarn add @sekmet/near-reacthooks`.

Then wrap your application with the `NearProvider` passing it an environment:

* `mainnet`
* `testnet`
* `betanet`
* `local`

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { NearProvider, NearEnvironment } from '@sekmet/near-reacthooks'
import App from './App'

ReactDOM.render(
  <NearProvider environment={NearEnvironment.TestNet}>
    <App />
  </NearProvider>,
  document.querySelector('#root')
)
```

### Using with Next.js + Typescript

```ts
import { NearProvider, NearEnvironment } from '@sekmet/near-reacthooks'
import { AppProps } from 'next/app';
import Script from 'next/script'

const MyApp = ({ Component, pageProps }: AppProps) => {
return (
    <>
    <Script id="near-api-js" src="https://cdn.jsdelivr.net/gh/nearprotocol/near-api-js/dist/near-api-js.js" />
    <NearProvider environment={NearEnvironment.TestNet}>
        <Component {...pageProps} />
    </NearProvider>
    </>
);
}

export default MyApp;
```

You can more finely tune the NEAR configuration by passing additional props
no the `NearProvider`. See the docs for more information.

Once the application is wrapped with the `NearProvider` your can access the
NEAR connection, the NEAR wallet, and NEAR contract using react hooks from
any component in the application.

```js
import React, { useEffect } from 'react'
import { useNear, useNearWallet, useNearContract } from '@sekmet/near-reacthooks';

export default function App() {
  const near = useNear()
  const wallet = useNearWallet()
  const contract = useNearContract('dev-123457824879', {
    viewMethods: ['getCount'],
    changeMethods: ['decrement', 'increment']
  })

  useEffect(() => {
    if(!wallet.isSignedIn()) wallet.requestSignIn();
  }, []);

  if(!wallet.isSignedIn()) return null;
  
  return <h1>{wallet.getAccountId()}</h1>;
}
```
