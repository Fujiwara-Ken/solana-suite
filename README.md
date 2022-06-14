![compile workflow](https://github.com/atonoy/solana-suite/actions/workflows/compile.yml/badge.svg)
![lint workflow](https://github.com/atonoy/solana-suite/actions/workflows/lint.yml/badge.svg)
![test:core workflow](https://github.com/atonoy/solana-suite/actions/workflows/test-core.yml/badge.svg)
![test:shared workflow](https://github.com/atonoy/solana-suite/actions/workflows/test-shared.yml/badge.svg)
![test:nft workflow](https://github.com/atonoy/solana-suite/actions/workflows/test-nft.yml/badge.svg)

<img src="https://bafkreibksjy2sdskvcrrlse2lwbskasub36bspidube7rlozhrd7wssg6i.ipfs.nftstorage.link/" width="80%" height="80%" />


## Summary


Solana suite is a convenience package for developing the Solana ecosystem. Using it will speed up your development.

Include @solana/web3.js, @solana/spl-token, Metaplex api, Storage api(nft.storage/arweave), Phantom wallet api.
By using Solana Suite allows for rapid development of blockchain products.

<img src="https://bafkreibolz2wpbpamryvdlcmbqfrit2wyvpx3ayyrjplth2s32ugp5uk2m.ipfs.nftstorage.link/" width="90%" height="90%" />

## Motivation
Solana is a flexible, versatile, and wonderful blockchain. However, it backfires and makes it difficult to quickly develop what you want to do.
We aim to make it easy for engineers who are not familiar with solana to develop with less source code

## Features
### Easy development for web engineers
Wrap @solana/web3.js makes it easy for web engineers to develop the Solana ecosystem. Connect to Solana with less source code, allowing engineers to focus on business logic and accelerate development of the Solana ecosystem.

### All-In-One Package
Various functions such as wallet generation, transaction retrieval, memo addition, multisig, SPL token/NFT mint, content upload to NFT Storage and Arweave, and SOL,SPL token,NFT transfer are provided as an all-in-one package, allowing you to do everything you want with just one Solana suite.

### Supports Node.js and Browser JS
It is developping in Typescript and transpiled to both Node.js (cjs) and Browser JS(mjs) environments. Therefore, it can be used in both server and client environments.

### Result Type
The function response type is Result<T, E>, which is often introduced in functional languages. Users can implement appropriate response handling on a case-by-case basis without throwing an Exception in the event of an error.

### Transaction Search
Search by user address or token address, filter function by Souce address or Destination address, and various filter functions by transaction type such as transfer, mint, create, etc.

## Official Page
comming soon
## Docs
comming soon

