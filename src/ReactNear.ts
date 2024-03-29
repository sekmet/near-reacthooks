import type { Near, WalletConnection, Contract } from 'near-api-js'
declare let window: any

// Optional config, can be passed in before plugin install:
// {
//   appTitle: '',
//   contractName: '',
// }
export function getConfig (env, options: any = {}) {
  const config = {
    ...options,
    appTitle: options.appTitle || 'NEAR',
    contractName: options.contractName || 'test.near'
  }

  switch (env) {
    case 'production':
    case 'mainnet':
      return {
        ...config,
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        explorerUrl: 'https://explorer.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org'
      }
    case 'development':
    case 'testnet':
      return {
        ...config,
        networkId: 'default',
        nodeUrl: 'https://rpc.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
      }
    case 'betanet':
      return {
        ...config,
        networkId: 'betanet',
        nodeUrl: 'https://rpc.betanet.near.org',
        explorerUrl: 'https://explorer.betanet.near.org',
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org'
      }
    case 'local':
      return {
        ...config,
        networkId: 'local',
        nodeUrl: 'http://localhost:3000',
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
        walletUrl: 'http://localhost:4000/wallet'
      }
    case 'test':
    case 'ci':
      return {
        ...config,
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        masterAccount: 'test.near'
      }
    case 'ci-betanet':
      return {
        ...config,
        networkId: 'shared-test-staging',
        nodeUrl: 'https://rpc.ci-betanet.near.org',
        masterAccount: 'test.near'
      }
    default:
      throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`)
  }
}

// string to uint array
// REF: https://coolaj86.com/articles/unicode-string-to-a-utf-8-typed-array-buffer-in-javascript/
function unicodeStringToTypedArray (s) {
  const escstr = encodeURIComponent(s)
  const binstr = escstr.replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode(Number('0x' + p1))
  })
  const ua = new Uint8Array(binstr.length)
  Array.prototype.forEach.call(binstr, function (ch, i) {
    ua[i] = ch.charCodeAt(0)
  })
  return ua
}

export class ReactNear {
  nearApi?: any
  config?: any
  near?: Near
  keystore?: any
  walletConnection?: WalletConnection
  user?: any

  constructor (env, config) {
    // loading via CDN, requires adding this line to index.html:
    // <script src="https://cdn.jsdelivr.net/gh/nearprotocol/near-api-js/dist/near-api-js.js" ></script>
    if (typeof window !== 'undefined') {
      this.nearApi = { ...window.nearApi }
      this.config = getConfig(env, config)
      this.near = {} as Near
      this.keystore = null
      this.walletConnection = {} as WalletConnection
      this.user = null
      return this
    } else {

    }
  }

  async loadNearProvider (): Promise<any> {
    try {
      this.keystore = new this.nearApi.keyStores.BrowserLocalStorageKeyStore(window.localStorage, 'nearlib:keystore:')
      this.near = await this.nearApi.connect(Object.assign({ deps: { keyStore: this.keystore } }, this.config))
      return this
    } catch (error) {
      console.log(error)
      return false
    }
  }

  async loadAccount (): Promise<any> {
    try {
      // Needed to access wallet
      this.walletConnection = new this.nearApi.WalletConnection(this.near)
      this.user = new this.nearApi.WalletAccount(this.near)

      if ((this.walletConnection != null) && this.walletConnection.getAccountId()) {
        this.user.accountId = this.walletConnection.getAccountId()
        this.user.balance = (await this.walletConnection.account().state()).amount
      }

      return this.user
    } catch (error) {
      console.log(error)
      return false
    }
  }

  async loginAccount (): Promise<any> {
    if (this.user && this.user.isSignedIn()) return this.user
    const appTitle = this.config.appTitle || 'NEAR'
    await this.user.requestSignIn(this.config.contractName, appTitle)
    return await this.loadAccount()
  }

  async logoutAccount (): Promise<any> {
    this.walletConnection = new this.nearApi.WalletConnection(this.near)
    this.user = new this.nearApi.WalletAccount(this.near)
    await this.user.signOut()

    this.keystore = null
    this.user = null
  }

  async getContract (contract_id, abiMethods): Promise<Contract|undefined> {
    if (!this.user || !this.user.accountId || (this.walletConnection == null)) return
    const account = this.walletConnection.account()
    const abi = {
      changeMethods: [],
      viewMethods: [],
      ...abiMethods
    }

    // Sender is the account ID to initialize transactions.
    return new this.nearApi.Contract(
      account,
      contract_id,
      { ...abi, sender: account.accountId }
    )
  }

  async getSignedPayload (message): Promise<any> {
    if (!this.user || !this.user.accountId) return
    const { secretKey } = await this.keystore.getKey(this.config.networkId, this.user.accountId)
    if (!secretKey) return
    const pair = new this.nearApi.utils.key_pair.KeyPairEd25519(secretKey)
    if (!pair) return
    const parsed = unicodeStringToTypedArray(message)
    const sig = await pair.sign(parsed)

    return {
      message,
      signature: sig.signature,
      publicKey: sig.publicKey.data
    }
  }

  signedPayloadToString (payload) {
    const payloadStr = `${payload.message}|${payload.signature.toString()}|${payload.publicKey.toString()}`
    return this.nearApi.utils.serialize.base_encode(payloadStr)
  }
}
