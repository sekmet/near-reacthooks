import React, { useEffect, useState, createContext, FC } from 'react'
import { getConfig } from './config'
import { ReactNear } from './ReactNear'
import { ConnectConfig } from 'near-api-js'
import { NearEnvironment } from './NearEnvironment'
import type { Near, WalletConnection } from 'near-api-js'

/**
 * @ignore
 */
declare let window: any

/**
 * @ignore
 */
export interface NearContextType {
  near?: Near
  wallet?: WalletConnection
}

/**
 * @ignore
 */
export const NearContext = createContext<NearContextType>({})

/**
 * @ignore
 */
export type NearProviderProps = ConnectConfig & {
  environment?: NearEnvironment
  networkId?: string
  nodeUrl?: string
  headers?: string[]
  children?: any[]
}

/**
 * `NearProvider` sets up `Near` and a `WalletConnection`. These values are accessible
 * using the provided hooks: `useNear` and `useNearWallet`.
 *
 * @example
 * ```js
 * <NearProvider environment={NearEnvironment.MainNet}>
 *  <App />
 * </NearProvider>
 * ```
 */
export const NearProvider: FC<NearProviderProps> = ({ environment = NearEnvironment.TestNet, children, ...props }) => {
  const config: ConnectConfig = {
    ...getConfig(environment),
    // deps: { keyStore: new near.nearApi.keyStores.BrowserLocalStorageKeyStore() },
    ...props
  }

  const [near, setNear] = useState<Near>()
  const [wallet, setWallet] = useState<WalletConnection>()
  const [provider, setNearProvider] = useState<any>()
  const [account, setNearAccount] = useState<any>()
  const [user, setUser] = useState<any>()

  useEffect(() => {
    async function setup () {
      const timeoutId = setTimeout(async () => {
        const _near = await new ReactNear(environment, config)

        await _near.loadNearProvider().then((provider) => {
          setNearProvider(provider)
        })

        await _near.loadAccount().then((account) => {
          setNearAccount(account)
          setWallet(account)
        })

        setNear(_near.nearApi)
        setUser(_near.user)
      }, 600)

      return () => clearTimeout(timeoutId)
    }

    setup()
      .catch(err => {
        console.error(err)
      })
  }, [])

  return (
    <NearContext.Provider value={{ near, wallet }}>
      {near !== undefined && wallet !== undefined ? children : null}
    </NearContext.Provider>
  )
}
