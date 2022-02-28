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
  switch (env) {
    case NearEnvironment.MainNet:
      return {
        headers: {},
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org'
      }
    case NearEnvironment.BetaNet:
      return {
        headers: {},
        networkId: 'betanet',
        nodeUrl: 'https://rpc.betanet.near.org',
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org'
      }
    case NearEnvironment.Test:
      return {
        headers: {},
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        masterAccount: 'test.near'
      }
    case NearEnvironment.Local:
      return {
        headers: {},
        networkId: 'local',
        nodeUrl: 'http://localhost:3030',
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
        walletUrl: 'http://localhost:4000/wallet'
      }      
    case NearEnvironment.TestNet:
    default:
      return {
        headers: {},
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org'
      }
  }
}
