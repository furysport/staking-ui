export const config = {
    RPC_URL: [
        'https://rpc.furya.xyz',
        'https://furya-rpc.synergynodes.com',
        'https://furya.rpc.nodeshub.online/',
    ],
    REST_URL: [
        'https://api.furya.xyz',
        'https://furya.api.nodeshub.online/',
        'https://furya-api.synergynodes.com',
    ],
    EXPLORER_URL: 'https://explorer.nodeshub.online/furya',
    NETWORK_NAME: 'Furya',
    NETWORK_TYPE: 'mainnet',
    CHAIN_ID: 'furya-1',
    CHAIN_NAME: 'Furya',
    COIN_DENOM: 'FURY',
    COIN_MINIMAL_DENOM: 'ufury',
    COIN_DECIMALS: 6,
    PREFIX: 'furya',
    COIN_TYPE: 118,
    COINGECKO_ID: 'fanfury',
    DEFAULT_GAS: 250000,
    GAS_PRICE_STEP_LOW: 0.01,
    GAS_PRICE_STEP_AVERAGE: 0.025,
    GAS_PRICE_STEP_HIGH: 0.025,
    FEATURES: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
};
