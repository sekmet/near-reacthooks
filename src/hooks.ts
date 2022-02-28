import { useContext } from 'react'
import { NearContext } from './NearProvider'
import { parseNearAmount, formatNearAmount } from './format'
import type { Contract, Near, WalletConnection } from 'near-api-js'

export const useNear = (): any => {
  const { near } = useContext(NearContext)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return near as Near
}

export const useNearWallet = (): any => {
  const { wallet } = useContext(NearContext)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return wallet as WalletConnection
}

/**
 * Define `parseNearAmount` and `formatNearAmount`. These functions are accessible
 * using the provided hook: `useNearFormatUtils`.
 */
export const useNearFormatUtils = (): any => {
  const formatUtils = {
    parseNearAmount, 
    formatNearAmount
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return formatUtils
}

/**
  * Define a smart contract on **NEAR**
  * ```js
  * const contract = useNearContract('dev-345324325324', {
  *   viewMethods: ['getCount'],
  *   changeMethods: ['increment', 'decrement']
  * });
  * ```
  *
  * @param contractId  The id of the smart contract
  * @param contractMethods The methods defined on the smart contract
  */
export const useNearContract = (contractId: string|undefined, contractMethods: { viewMethods: string[], changeMethods: string[] }): Contract => {
  const near = useNear()
  const wallet = useNearWallet()
  return new near.Contract(wallet.account(), contractId, contractMethods)
}