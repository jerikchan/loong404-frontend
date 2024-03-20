const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com',
};

const testnet = {
  chainId: 97,
  name: 'BNB Smart Chain Testnet',
  currency: 'tBNB',
  explorerUrl: 'https://testnet.bscscan.com',
  rpcUrl: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
};

export const optest = {
  chainId: 11155420,
  name: 'Optimism Testnet',
  currency: 'ETH',
  explorerUrl: 'https://sepolia-optimism.etherscan.io/',
  rpcUrl: 'https://sepolia.optimism.io',
  contract: {
    GreatLoongAddress: '0xec8DF505661c0d5845Bd3D3F3a4180Eade2ACA32',
    greatLMintAddr: '0xc77dF1E6D4351f8aBa98722f66c481dd236F8885',
    BabyLoongAddress: '0x89426d1e7D8Cc62d89eA543E696ee589DA3722E0',
    babyLMintAddr: '0x799d5050fa3dd87ef31b4Baa918A631A2521CFF4',
    swapAddress: '0xB3914496790Aaab054eDb1325A37D0167E72671d',
    dataAddress: '0x46096ca702716ea68e7fb1A30679fa1B263d7e77',
  },
};

export const Arbitrum_Sepolia = {
  chainId: 421614,
  name: 'Arbitrum Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia-explorer.arbitrum.io/',
  rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
  contract: {
    GreatLoongAddress: '0xEEdb8cc53eA0bd6eD67a22D07d3945dc54b79E67',
    greatLMintAddr: '0xe1Ca9Bf70A8539534df230462F18644BC7469C3E',
    BabyLoongAddress: '0x2436C27Acf956D1155899dc7a084BC9aA6B8A62a',
    babyLMintAddr: '0x2d9fFfa05B5315cd57292778Fe8E774Fe7BbA13D',
    swapAddress: '0xE11d592cDF2eB37740A2609f5B70e2f4a1a31cf4',
    dataAddress: '0xC95FF4bf5511F8c32a5FDA3412e0Cf54Ae5aEdb2',
  },
};

export const Arbitrum_One = {
  chainId: 42161,
  name: 'Arbitrum LlamaNodes',
  currency: 'ETH',
  explorerUrl: 'https://arbiscan.io/',
  rpcUrl: 'https://arbitrum.llamarpc.com',
  contract: {
    GreatLoongAddress: '0xDB3Fe75CF3263218f061C3E22dB037D15652d506',
    greatLMintAddr: '0xAD4DF2eEb39929B288A6dBD9cF005d2936da4E0d',
    BabyLoongAddress: '0x09905C09975908d41bA1D761487F7785D3A7BC70',
    babyLMintAddr: '0x2682385Aa693735Ae9717E0f88E5604B767D98A5',
    swapAddress: '0xBc4B1e8caC87872AA6970f4d396C778CAE4F4C1F',
    dataAddress: '0xc2f9B5ec0CCbB4A0EDD2508Dec4d573a3D413a33',
  },
};

export const chain =
  process.env.RELEASE_TARGET === 'development'
    ? Arbitrum_Sepolia
    : Arbitrum_One;
// export const contractAddress = '0x582a2124A6a47Db11B33f5ae67B12055655396d8'
// export const chain = mainnet;
export const contractAddress = '0xBc4B1e8caC87872AA6970f4d396C778CAE4F4C1F';
