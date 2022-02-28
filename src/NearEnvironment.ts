/**
 * There are four NearEnvironments that can be automatically configured
 * using @sekmet/near-reacthooks. `MainNet`, `TestNet`, `BetaNet`, `Test` and `Local`.
 * These four environments are represented by the {@module NearEnvironment} enum.
 */

/**
 * This enum is used to automatically configure the {@link NearProvider}
 * to connect to either `MainNet`, `TestNet`, or `BetaNet`.
 */
 
export enum NearEnvironment {
  MainNet = 'mainnet',
  TestNet = 'testnet',
  BetaNet = 'betanet',
  Test = 'test',
  Local = 'local'
}