import { ConnectConfig } from 'near-api-js'
import { NearEnvironment } from './NearEnvironment'

// Optional config, can be passed in before plugin install:
// {
//   appTitle: '',
//   contractName: '',
// }
export function getConfig (env: NearEnvironment, options: any = {}): ConnectConfig {
  const config = {
    ...options,
    appTitle: options.appTitle || 'NEAR',
    contractName: options.contractName || 'test.near'
  }

  const nearHeaders:any = {}
  //nearHeaders['x-api-key'] = RPC_API_KEY
  nearHeaders['Content-Type'] = 'application/json'

  switch (env) {
    case NearEnvironment.MainNet:
      return {
        headers: { nearHeaders },
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org'
      }
    case NearEnvironment.BetaNet:
      return {
        headers: { nearHeaders },
        networkId: 'betanet',
        nodeUrl: 'https://rpc.betanet.near.org',
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org'
      }
    case NearEnvironment.Test:
      return {
        headers: { nearHeaders },
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        masterAccount: 'test.near'
      }
    case NearEnvironment.Local:
      return {
        headers: { nearHeaders },
        networkId: 'local',
        nodeUrl: 'http://localhost:3030',
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
        walletUrl: 'http://localhost:4000/wallet'
      }
    case NearEnvironment.TestNet:
    default:
      return {
        headers: { nearHeaders },
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
      }
  }
}
