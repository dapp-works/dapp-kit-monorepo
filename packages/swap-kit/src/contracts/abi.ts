export const WETH = [{"name":"Approval","type":"event","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"spender","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"Transfer","type":"event","inputs":[{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"CALLBACK_SUCCESS","type":"function","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"name":"PERMIT_TYPEHASH","type":"function","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"name":"allowance","type":"function","inputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"approve","type":"function","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"name":"approveAndCall","type":"function","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"name":"balanceOf","type":"function","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"decimals","type":"function","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"name":"deposit","type":"function","inputs":[],"outputs":[],"stateMutability":"payable"},{"name":"depositTo","type":"function","inputs":[{"name":"to","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"payable"},{"name":"depositToAndCall","type":"function","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"data","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"success","type":"bool","internalType":"bool"}],"stateMutability":"payable"},{"name":"flashFee","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"},{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"flashLoan","type":"function","inputs":[{"name":"receiver","type":"address","internalType":"contract IERC3156FlashBorrower"},{"name":"token","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"name":"flashMinted","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"maxFlashLoan","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"name","type":"function","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"name":"nonces","type":"function","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"permit","type":"function","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"spender","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"v","type":"uint8","internalType":"uint8"},{"name":"r","type":"bytes32","internalType":"bytes32"},{"name":"s","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"symbol","type":"function","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"name":"totalSupply","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"transfer","type":"function","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"name":"transferAndCall","type":"function","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"name":"transferFrom","type":"function","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"name":"withdraw","type":"function","inputs":[{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"withdrawFrom","type":"function","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address payable"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"withdrawTo","type":"function","inputs":[{"name":"to","type":"address","internalType":"address payable"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"receive","stateMutability":"payable"}] as const;
export const UniswapFactory = [{"type":"constructor","inputs":[{"name":"_feeToSetter","type":"address","internalType":"address"}],"payable":false,"stateMutability":"nonpayable"},{"name":"PairCreated","type":"event","inputs":[{"name":"token0","type":"address","indexed":true,"internalType":"address"},{"name":"token1","type":"address","indexed":true,"internalType":"address"},{"name":"pair","type":"address","indexed":false,"internalType":"address"},{"name":"","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"INIT_CODE_PAIR_HASH","type":"function","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"allPairs","type":"function","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"allPairsLength","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"createPair","type":"function","inputs":[{"name":"tokenA","type":"address","internalType":"address"},{"name":"tokenB","type":"address","internalType":"address"}],"outputs":[{"name":"pair","type":"address","internalType":"address"}],"payable":false,"constant":false,"stateMutability":"nonpayable"},{"name":"feeTo","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"feeToSetter","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"getPair","type":"function","inputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"setFeeTo","type":"function","inputs":[{"name":"_feeTo","type":"address","internalType":"address"}],"outputs":[],"payable":false,"constant":false,"stateMutability":"nonpayable"},{"name":"setFeeToSetter","type":"function","inputs":[{"name":"_feeToSetter","type":"address","internalType":"address"}],"outputs":[],"payable":false,"constant":false,"stateMutability":"nonpayable"}] as const;
export const ERC20 = [{"type":"constructor","inputs":[{"name":"name","type":"string","internalType":"string"},{"name":"symbol","type":"string","internalType":"string"},{"name":"initialSupply","type":"uint256","internalType":"uint256"},{"name":"owner","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"name":"Approval","type":"event","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"spender","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"Transfer","type":"event","inputs":[{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"allowance","type":"function","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"spender","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"approve","type":"function","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"name":"balanceOf","type":"function","inputs":[{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"burn","type":"function","inputs":[{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"burnFrom","type":"function","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"decimals","type":"function","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"name":"decreaseAllowance","type":"function","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"subtractedValue","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"name":"increaseAllowance","type":"function","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"addedValue","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"name":"name","type":"function","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"name":"symbol","type":"function","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"name":"totalSupply","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"transfer","type":"function","inputs":[{"name":"recipient","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"name":"transferFrom","type":"function","inputs":[{"name":"sender","type":"address","internalType":"address"},{"name":"recipient","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"}] as const;
export const UniswapRouter = [{"type":"constructor","inputs":[{"name":"_factory","type":"address","internalType":"address"},{"name":"_WETH","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"name":"WETH","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"name":"addLiquidity","type":"function","inputs":[{"name":"tokenA","type":"address","internalType":"address"},{"name":"tokenB","type":"address","internalType":"address"},{"name":"amountADesired","type":"uint256","internalType":"uint256"},{"name":"amountBDesired","type":"uint256","internalType":"uint256"},{"name":"amountAMin","type":"uint256","internalType":"uint256"},{"name":"amountBMin","type":"uint256","internalType":"uint256"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amountA","type":"uint256","internalType":"uint256"},{"name":"amountB","type":"uint256","internalType":"uint256"},{"name":"liquidity","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"name":"addLiquidityETH","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"},{"name":"amountTokenDesired","type":"uint256","internalType":"uint256"},{"name":"amountTokenMin","type":"uint256","internalType":"uint256"},{"name":"amountETHMin","type":"uint256","internalType":"uint256"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amountToken","type":"uint256","internalType":"uint256"},{"name":"amountETH","type":"uint256","internalType":"uint256"},{"name":"liquidity","type":"uint256","internalType":"uint256"}],"stateMutability":"payable"},{"name":"factory","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"name":"getAmountIn","type":"function","inputs":[{"name":"amountOut","type":"uint256","internalType":"uint256"},{"name":"reserveIn","type":"uint256","internalType":"uint256"},{"name":"reserveOut","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amountIn","type":"uint256","internalType":"uint256"}],"stateMutability":"pure"},{"name":"getAmountOut","type":"function","inputs":[{"name":"amountIn","type":"uint256","internalType":"uint256"},{"name":"reserveIn","type":"uint256","internalType":"uint256"},{"name":"reserveOut","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amountOut","type":"uint256","internalType":"uint256"}],"stateMutability":"pure"},{"name":"getAmountsIn","type":"function","inputs":[{"name":"amountOut","type":"uint256","internalType":"uint256"},{"name":"path","type":"address[]","internalType":"address[]"}],"outputs":[{"name":"amounts","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"name":"getAmountsOut","type":"function","inputs":[{"name":"amountIn","type":"uint256","internalType":"uint256"},{"name":"path","type":"address[]","internalType":"address[]"}],"outputs":[{"name":"amounts","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"name":"quote","type":"function","inputs":[{"name":"amountA","type":"uint256","internalType":"uint256"},{"name":"reserveA","type":"uint256","internalType":"uint256"},{"name":"reserveB","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amountB","type":"uint256","internalType":"uint256"}],"stateMutability":"pure"},{"name":"removeLiquidity","type":"function","inputs":[{"name":"tokenA","type":"address","internalType":"address"},{"name":"tokenB","type":"address","internalType":"address"},{"name":"liquidity","type":"uint256","internalType":"uint256"},{"name":"amountAMin","type":"uint256","internalType":"uint256"},{"name":"amountBMin","type":"uint256","internalType":"uint256"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amountA","type":"uint256","internalType":"uint256"},{"name":"amountB","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"name":"removeLiquidityETH","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"},{"name":"liquidity","type":"uint256","internalType":"uint256"},{"name":"amountTokenMin","type":"uint256","internalType":"uint256"},{"name":"amountETHMin","type":"uint256","internalType":"uint256"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amountToken","type":"uint256","internalType":"uint256"},{"name":"amountETH","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"name":"removeLiquidityETHSupportingFeeOnTransferTokens","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"},{"name":"liquidity","type":"uint256","internalType":"uint256"},{"name":"amountTokenMin","type":"uint256","internalType":"uint256"},{"name":"amountETHMin","type":"uint256","internalType":"uint256"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amountETH","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"name":"swapETHForExactTokens","type":"function","inputs":[{"name":"amountOut","type":"uint256","internalType":"uint256"},{"name":"path","type":"address[]","internalType":"address[]"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amounts","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"payable"},{"name":"swapExactETHForTokens","type":"function","inputs":[{"name":"amountOutMin","type":"uint256","internalType":"uint256"},{"name":"path","type":"address[]","internalType":"address[]"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amounts","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"payable"},{"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","type":"function","inputs":[{"name":"amountOutMin","type":"uint256","internalType":"uint256"},{"name":"path","type":"address[]","internalType":"address[]"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"payable"},{"name":"swapExactTokensForETH","type":"function","inputs":[{"name":"amountIn","type":"uint256","internalType":"uint256"},{"name":"amountOutMin","type":"uint256","internalType":"uint256"},{"name":"path","type":"address[]","internalType":"address[]"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amounts","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"nonpayable"},{"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","type":"function","inputs":[{"name":"amountIn","type":"uint256","internalType":"uint256"},{"name":"amountOutMin","type":"uint256","internalType":"uint256"},{"name":"path","type":"address[]","internalType":"address[]"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"swapExactTokensForTokens","type":"function","inputs":[{"name":"amountIn","type":"uint256","internalType":"uint256"},{"name":"amountOutMin","type":"uint256","internalType":"uint256"},{"name":"path","type":"address[]","internalType":"address[]"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amounts","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"nonpayable"},{"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","type":"function","inputs":[{"name":"amountIn","type":"uint256","internalType":"uint256"},{"name":"amountOutMin","type":"uint256","internalType":"uint256"},{"name":"path","type":"address[]","internalType":"address[]"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"swapTokensForExactETH","type":"function","inputs":[{"name":"amountOut","type":"uint256","internalType":"uint256"},{"name":"amountInMax","type":"uint256","internalType":"uint256"},{"name":"path","type":"address[]","internalType":"address[]"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amounts","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"nonpayable"},{"name":"swapTokensForExactTokens","type":"function","inputs":[{"name":"amountOut","type":"uint256","internalType":"uint256"},{"name":"amountInMax","type":"uint256","internalType":"uint256"},{"name":"path","type":"address[]","internalType":"address[]"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amounts","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"nonpayable"},{"type":"receive","stateMutability":"payable"}] as const;
export const LPToken = [{"type":"constructor","inputs":[],"payable":false,"stateMutability":"nonpayable"},{"name":"Approval","type":"event","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"spender","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"Burn","type":"event","inputs":[{"name":"sender","type":"address","indexed":true,"internalType":"address"},{"name":"amount0","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"amount1","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"to","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"name":"Mint","type":"event","inputs":[{"name":"sender","type":"address","indexed":true,"internalType":"address"},{"name":"amount0","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"amount1","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"Swap","type":"event","inputs":[{"name":"sender","type":"address","indexed":true,"internalType":"address"},{"name":"amount0In","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"amount1In","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"amount0Out","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"amount1Out","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"to","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"name":"Sync","type":"event","inputs":[{"name":"reserve0","type":"uint112","indexed":false,"internalType":"uint112"},{"name":"reserve1","type":"uint112","indexed":false,"internalType":"uint112"}],"anonymous":false},{"name":"Transfer","type":"event","inputs":[{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"MINIMUM_LIQUIDITY","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"allowance","type":"function","inputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"approve","type":"function","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"payable":false,"constant":false,"stateMutability":"nonpayable"},{"name":"balanceOf","type":"function","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"burn","type":"function","inputs":[{"name":"to","type":"address","internalType":"address"}],"outputs":[{"name":"amount0","type":"uint256","internalType":"uint256"},{"name":"amount1","type":"uint256","internalType":"uint256"}],"payable":false,"constant":false,"stateMutability":"nonpayable"},{"name":"decimals","type":"function","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"factory","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"getReserves","type":"function","inputs":[],"outputs":[{"name":"_reserve0","type":"uint112","internalType":"uint112"},{"name":"_reserve1","type":"uint112","internalType":"uint112"},{"name":"_blockTimestampLast","type":"uint32","internalType":"uint32"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"initialize","type":"function","inputs":[{"name":"_token0","type":"address","internalType":"address"},{"name":"_token1","type":"address","internalType":"address"}],"outputs":[],"payable":false,"constant":false,"stateMutability":"nonpayable"},{"name":"kLast","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"mint","type":"function","inputs":[{"name":"to","type":"address","internalType":"address"}],"outputs":[{"name":"liquidity","type":"uint256","internalType":"uint256"}],"payable":false,"constant":false,"stateMutability":"nonpayable"},{"name":"name","type":"function","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"price0CumulativeLast","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"price1CumulativeLast","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"skim","type":"function","inputs":[{"name":"to","type":"address","internalType":"address"}],"outputs":[],"payable":false,"constant":false,"stateMutability":"nonpayable"},{"name":"swap","type":"function","inputs":[{"name":"amount0Out","type":"uint256","internalType":"uint256"},{"name":"amount1Out","type":"uint256","internalType":"uint256"},{"name":"to","type":"address","internalType":"address"},{"name":"data","type":"bytes","internalType":"bytes"}],"outputs":[],"payable":false,"constant":false,"stateMutability":"nonpayable"},{"name":"symbol","type":"function","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"sync","type":"function","inputs":[],"outputs":[],"payable":false,"constant":false,"stateMutability":"nonpayable"},{"name":"token0","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"token1","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"totalSupply","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"payable":false,"constant":true,"stateMutability":"view"},{"name":"transfer","type":"function","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"payable":false,"constant":false,"stateMutability":"nonpayable"},{"name":"transferFrom","type":"function","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"payable":false,"constant":false,"stateMutability":"nonpayable"}] as const;
export const MimoBasedCashier = [{"type":"constructor","inputs":[{"name":"_factory","type":"address","internalType":"address"},{"name":"_maxAmount","type":"uint256","internalType":"uint256"},{"name":"_fee","type":"uint256","internalType":"uint256"},{"name":"_taxRate","type":"uint8","internalType":"uint8"}],"stateMutability":"nonpayable"},{"name":"OwnableInvalidOwner","type":"error","inputs":[{"name":"owner","type":"address","internalType":"address"}]},{"name":"OwnableUnauthorizedAccount","type":"error","inputs":[{"name":"account","type":"address","internalType":"address"}]},{"name":"Exchanged","type":"event","inputs":[{"name":"recipient","type":"address","indexed":true,"internalType":"address"},{"name":"srcToken","type":"address","indexed":true,"internalType":"address"},{"name":"amountIn","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"amountOut","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"OwnershipTransferred","type":"event","inputs":[{"name":"previousOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"name":"Received","type":"event","inputs":[{"name":"","type":"address","indexed":false,"internalType":"address"},{"name":"","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"deposit","type":"function","inputs":[{"name":"_chainId","type":"uint256","internalType":"uint256"},{"name":"_txHash","type":"bytes32","internalType":"bytes32"},{"name":"_recipient","type":"address","internalType":"address payable"},{"name":"_token","type":"address","internalType":"address"},{"name":"_amountIn","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"genId","type":"function","inputs":[{"name":"_chainId","type":"uint256","internalType":"uint256"},{"name":"_txHash","type":"bytes32","internalType":"bytes32"},{"name":"_recipient","type":"address","internalType":"address"},{"name":"_token","type":"address","internalType":"address"},{"name":"_amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"pure"},{"name":"maxAmount","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"mimoFactory","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IMimoFactory"}],"stateMutability":"view"},{"name":"owner","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"name":"pathOf","type":"function","inputs":[{"name":"_token","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"address[]","internalType":"address[]"}],"stateMutability":"view"},{"name":"renounceOwnership","type":"function","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"name":"setOperator","type":"function","inputs":[{"name":"_operator","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"setTokenPath","type":"function","inputs":[{"name":"_token","type":"address","internalType":"address"},{"name":"_path","type":"address[]","internalType":"address[]"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"taxRate","type":"function","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"name":"transactionFee","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"transferOwnership","type":"function","inputs":[{"name":"newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"withdraw","type":"function","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"receive","stateMutability":"payable"}] as const;
export const UniswapV3Factory = [{"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"name":"FeeAmountEnabled","type":"event","inputs":[{"name":"fee","type":"uint24","indexed":true,"internalType":"uint24"},{"name":"tickSpacing","type":"int24","indexed":true,"internalType":"int24"}],"anonymous":false},{"name":"OwnerChanged","type":"event","inputs":[{"name":"oldOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"name":"PoolCreated","type":"event","inputs":[{"name":"token0","type":"address","indexed":true,"internalType":"address"},{"name":"token1","type":"address","indexed":true,"internalType":"address"},{"name":"fee","type":"uint24","indexed":true,"internalType":"uint24"},{"name":"tickSpacing","type":"int24","indexed":false,"internalType":"int24"},{"name":"pool","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"name":"createPool","type":"function","inputs":[{"name":"tokenA","type":"address","internalType":"address"},{"name":"tokenB","type":"address","internalType":"address"},{"name":"fee","type":"uint24","internalType":"uint24"}],"outputs":[{"name":"pool","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"name":"enableFeeAmount","type":"function","inputs":[{"name":"fee","type":"uint24","internalType":"uint24"},{"name":"tickSpacing","type":"int24","internalType":"int24"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"feeAmountTickSpacing","type":"function","inputs":[{"name":"","type":"uint24","internalType":"uint24"}],"outputs":[{"name":"","type":"int24","internalType":"int24"}],"stateMutability":"view"},{"name":"getPool","type":"function","inputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint24","internalType":"uint24"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"name":"owner","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"name":"parameters","type":"function","inputs":[],"outputs":[{"name":"factory","type":"address","internalType":"address"},{"name":"token0","type":"address","internalType":"address"},{"name":"token1","type":"address","internalType":"address"},{"name":"fee","type":"uint24","internalType":"uint24"},{"name":"tickSpacing","type":"int24","internalType":"int24"}],"stateMutability":"view"},{"name":"setOwner","type":"function","inputs":[{"name":"_owner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"}] as const;
export const SwapRouter02 = [{"type":"constructor","inputs":[{"name":"_factoryV2","type":"address","internalType":"address"},{"name":"factoryV3","type":"address","internalType":"address"},{"name":"_positionManager","type":"address","internalType":"address"},{"name":"_WETH9","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"name":"WETH9","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"name":"approveMax","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"payable"},{"name":"approveMaxMinusOne","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"payable"},{"name":"approveZeroThenMax","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"payable"},{"name":"approveZeroThenMaxMinusOne","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"payable"},{"name":"callPositionManager","type":"function","inputs":[{"name":"data","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"result","type":"bytes","internalType":"bytes"}],"stateMutability":"payable"},{"name":"checkOracleSlippage","type":"function","inputs":[{"name":"paths","type":"bytes[]","internalType":"bytes[]"},{"name":"amounts","type":"uint128[]","internalType":"uint128[]"},{"name":"maximumTickDivergence","type":"uint24","internalType":"uint24"},{"name":"secondsAgo","type":"uint32","internalType":"uint32"}],"outputs":[],"stateMutability":"view"},{"name":"checkOracleSlippage","type":"function","inputs":[{"name":"path","type":"bytes","internalType":"bytes"},{"name":"maximumTickDivergence","type":"uint24","internalType":"uint24"},{"name":"secondsAgo","type":"uint32","internalType":"uint32"}],"outputs":[],"stateMutability":"view"},{"name":"exactInput","type":"function","inputs":[{"name":"params","type":"tuple","components":[{"name":"path","type":"bytes","internalType":"bytes"},{"name":"recipient","type":"address","internalType":"address"},{"name":"amountIn","type":"uint256","internalType":"uint256"},{"name":"amountOutMinimum","type":"uint256","internalType":"uint256"}],"internalType":"struct IV3SwapRouter.ExactInputParams"}],"outputs":[{"name":"amountOut","type":"uint256","internalType":"uint256"}],"stateMutability":"payable"},{"name":"exactInputSingle","type":"function","inputs":[{"name":"params","type":"tuple","components":[{"name":"tokenIn","type":"address","internalType":"address"},{"name":"tokenOut","type":"address","internalType":"address"},{"name":"fee","type":"uint24","internalType":"uint24"},{"name":"recipient","type":"address","internalType":"address"},{"name":"amountIn","type":"uint256","internalType":"uint256"},{"name":"amountOutMinimum","type":"uint256","internalType":"uint256"},{"name":"sqrtPriceLimitX96","type":"uint160","internalType":"uint160"}],"internalType":"struct IV3SwapRouter.ExactInputSingleParams"}],"outputs":[{"name":"amountOut","type":"uint256","internalType":"uint256"}],"stateMutability":"payable"},{"name":"exactOutput","type":"function","inputs":[{"name":"params","type":"tuple","components":[{"name":"path","type":"bytes","internalType":"bytes"},{"name":"recipient","type":"address","internalType":"address"},{"name":"amountOut","type":"uint256","internalType":"uint256"},{"name":"amountInMaximum","type":"uint256","internalType":"uint256"}],"internalType":"struct IV3SwapRouter.ExactOutputParams"}],"outputs":[{"name":"amountIn","type":"uint256","internalType":"uint256"}],"stateMutability":"payable"},{"name":"exactOutputSingle","type":"function","inputs":[{"name":"params","type":"tuple","components":[{"name":"tokenIn","type":"address","internalType":"address"},{"name":"tokenOut","type":"address","internalType":"address"},{"name":"fee","type":"uint24","internalType":"uint24"},{"name":"recipient","type":"address","internalType":"address"},{"name":"amountOut","type":"uint256","internalType":"uint256"},{"name":"amountInMaximum","type":"uint256","internalType":"uint256"},{"name":"sqrtPriceLimitX96","type":"uint160","internalType":"uint160"}],"internalType":"struct IV3SwapRouter.ExactOutputSingleParams"}],"outputs":[{"name":"amountIn","type":"uint256","internalType":"uint256"}],"stateMutability":"payable"},{"name":"factory","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"name":"factoryV2","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"name":"getApprovalType","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint8","internalType":"enum IApproveAndCall.ApprovalType"}],"stateMutability":"nonpayable"},{"name":"increaseLiquidity","type":"function","inputs":[{"name":"params","type":"tuple","components":[{"name":"token0","type":"address","internalType":"address"},{"name":"token1","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"amount0Min","type":"uint256","internalType":"uint256"},{"name":"amount1Min","type":"uint256","internalType":"uint256"}],"internalType":"struct IApproveAndCall.IncreaseLiquidityParams"}],"outputs":[{"name":"result","type":"bytes","internalType":"bytes"}],"stateMutability":"payable"},{"name":"mint","type":"function","inputs":[{"name":"params","type":"tuple","components":[{"name":"token0","type":"address","internalType":"address"},{"name":"token1","type":"address","internalType":"address"},{"name":"fee","type":"uint24","internalType":"uint24"},{"name":"tickLower","type":"int24","internalType":"int24"},{"name":"tickUpper","type":"int24","internalType":"int24"},{"name":"amount0Min","type":"uint256","internalType":"uint256"},{"name":"amount1Min","type":"uint256","internalType":"uint256"},{"name":"recipient","type":"address","internalType":"address"}],"internalType":"struct IApproveAndCall.MintParams"}],"outputs":[{"name":"result","type":"bytes","internalType":"bytes"}],"stateMutability":"payable"},{"name":"multicall","type":"function","inputs":[{"name":"previousBlockhash","type":"bytes32","internalType":"bytes32"},{"name":"data","type":"bytes[]","internalType":"bytes[]"}],"outputs":[{"name":"","type":"bytes[]","internalType":"bytes[]"}],"stateMutability":"payable"},{"name":"multicall","type":"function","inputs":[{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes[]","internalType":"bytes[]"}],"outputs":[{"name":"","type":"bytes[]","internalType":"bytes[]"}],"stateMutability":"payable"},{"name":"multicall","type":"function","inputs":[{"name":"data","type":"bytes[]","internalType":"bytes[]"}],"outputs":[{"name":"results","type":"bytes[]","internalType":"bytes[]"}],"stateMutability":"payable"},{"name":"positionManager","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"name":"pull","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"payable"},{"name":"refundETH","type":"function","inputs":[],"outputs":[],"stateMutability":"payable"},{"name":"selfPermit","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"v","type":"uint8","internalType":"uint8"},{"name":"r","type":"bytes32","internalType":"bytes32"},{"name":"s","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"payable"},{"name":"selfPermitAllowed","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"},{"name":"nonce","type":"uint256","internalType":"uint256"},{"name":"expiry","type":"uint256","internalType":"uint256"},{"name":"v","type":"uint8","internalType":"uint8"},{"name":"r","type":"bytes32","internalType":"bytes32"},{"name":"s","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"payable"},{"name":"selfPermitAllowedIfNecessary","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"},{"name":"nonce","type":"uint256","internalType":"uint256"},{"name":"expiry","type":"uint256","internalType":"uint256"},{"name":"v","type":"uint8","internalType":"uint8"},{"name":"r","type":"bytes32","internalType":"bytes32"},{"name":"s","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"payable"},{"name":"selfPermitIfNecessary","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"v","type":"uint8","internalType":"uint8"},{"name":"r","type":"bytes32","internalType":"bytes32"},{"name":"s","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"payable"},{"name":"swapExactTokensForTokens","type":"function","inputs":[{"name":"amountIn","type":"uint256","internalType":"uint256"},{"name":"amountOutMin","type":"uint256","internalType":"uint256"},{"name":"path","type":"address[]","internalType":"address[]"},{"name":"to","type":"address","internalType":"address"}],"outputs":[{"name":"amountOut","type":"uint256","internalType":"uint256"}],"stateMutability":"payable"},{"name":"swapTokensForExactTokens","type":"function","inputs":[{"name":"amountOut","type":"uint256","internalType":"uint256"},{"name":"amountInMax","type":"uint256","internalType":"uint256"},{"name":"path","type":"address[]","internalType":"address[]"},{"name":"to","type":"address","internalType":"address"}],"outputs":[{"name":"amountIn","type":"uint256","internalType":"uint256"}],"stateMutability":"payable"},{"name":"sweepToken","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"},{"name":"amountMinimum","type":"uint256","internalType":"uint256"},{"name":"recipient","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"payable"},{"name":"sweepToken","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"},{"name":"amountMinimum","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"payable"},{"name":"sweepTokenWithFee","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"},{"name":"amountMinimum","type":"uint256","internalType":"uint256"},{"name":"feeBips","type":"uint256","internalType":"uint256"},{"name":"feeRecipient","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"payable"},{"name":"sweepTokenWithFee","type":"function","inputs":[{"name":"token","type":"address","internalType":"address"},{"name":"amountMinimum","type":"uint256","internalType":"uint256"},{"name":"recipient","type":"address","internalType":"address"},{"name":"feeBips","type":"uint256","internalType":"uint256"},{"name":"feeRecipient","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"payable"},{"name":"uniswapV3SwapCallback","type":"function","inputs":[{"name":"amount0Delta","type":"int256","internalType":"int256"},{"name":"amount1Delta","type":"int256","internalType":"int256"},{"name":"_data","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"unwrapWETH9","type":"function","inputs":[{"name":"amountMinimum","type":"uint256","internalType":"uint256"},{"name":"recipient","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"payable"},{"name":"unwrapWETH9","type":"function","inputs":[{"name":"amountMinimum","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"payable"},{"name":"unwrapWETH9WithFee","type":"function","inputs":[{"name":"amountMinimum","type":"uint256","internalType":"uint256"},{"name":"recipient","type":"address","internalType":"address"},{"name":"feeBips","type":"uint256","internalType":"uint256"},{"name":"feeRecipient","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"payable"},{"name":"unwrapWETH9WithFee","type":"function","inputs":[{"name":"amountMinimum","type":"uint256","internalType":"uint256"},{"name":"feeBips","type":"uint256","internalType":"uint256"},{"name":"feeRecipient","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"payable"},{"name":"wrapETH","type":"function","inputs":[{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"payable"},{"type":"receive","stateMutability":"payable"}] as const;
export const UniswapV3Pool = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"int24","name":"tickLower","type":"int24"},{"indexed":true,"internalType":"int24","name":"tickUpper","type":"int24"},{"indexed":false,"internalType":"uint128","name":"amount","type":"uint128"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"recipient","type":"address"},{"indexed":true,"internalType":"int24","name":"tickLower","type":"int24"},{"indexed":true,"internalType":"int24","name":"tickUpper","type":"int24"},{"indexed":false,"internalType":"uint128","name":"amount0","type":"uint128"},{"indexed":false,"internalType":"uint128","name":"amount1","type":"uint128"}],"name":"Collect","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint128","name":"amount0","type":"uint128"},{"indexed":false,"internalType":"uint128","name":"amount1","type":"uint128"}],"name":"CollectProtocol","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"paid0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"paid1","type":"uint256"}],"name":"Flash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint16","name":"observationCardinalityNextOld","type":"uint16"},{"indexed":false,"internalType":"uint16","name":"observationCardinalityNextNew","type":"uint16"}],"name":"IncreaseObservationCardinalityNext","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"indexed":false,"internalType":"int24","name":"tick","type":"int24"}],"name":"Initialize","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"int24","name":"tickLower","type":"int24"},{"indexed":true,"internalType":"int24","name":"tickUpper","type":"int24"},{"indexed":false,"internalType":"uint128","name":"amount","type":"uint128"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"feeProtocol0Old","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"feeProtocol1Old","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"feeProtocol0New","type":"uint8"},{"indexed":false,"internalType":"uint8","name":"feeProtocol1New","type":"uint8"}],"name":"SetFeeProtocol","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"int256","name":"amount0","type":"int256"},{"indexed":false,"internalType":"int256","name":"amount1","type":"int256"},{"indexed":false,"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"indexed":false,"internalType":"uint128","name":"liquidity","type":"uint128"},{"indexed":false,"internalType":"int24","name":"tick","type":"int24"}],"name":"Swap","type":"event"},{"inputs":[{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint128","name":"amount","type":"uint128"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint128","name":"amount0Requested","type":"uint128"},{"internalType":"uint128","name":"amount1Requested","type":"uint128"}],"name":"collect","outputs":[{"internalType":"uint128","name":"amount0","type":"uint128"},{"internalType":"uint128","name":"amount1","type":"uint128"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint128","name":"amount0Requested","type":"uint128"},{"internalType":"uint128","name":"amount1Requested","type":"uint128"}],"name":"collectProtocol","outputs":[{"internalType":"uint128","name":"amount0","type":"uint128"},{"internalType":"uint128","name":"amount1","type":"uint128"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fee","outputs":[{"internalType":"uint24","name":"","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeGrowthGlobal0X128","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeGrowthGlobal1X128","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"flash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint16","name":"observationCardinalityNext","type":"uint16"}],"name":"increaseObservationCardinalityNext","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"liquidity","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxLiquidityPerTick","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint128","name":"amount","type":"uint128"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"mint","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"observations","outputs":[{"internalType":"uint32","name":"blockTimestamp","type":"uint32"},{"internalType":"int56","name":"tickCumulative","type":"int56"},{"internalType":"uint160","name":"secondsPerLiquidityCumulativeX128","type":"uint160"},{"internalType":"bool","name":"initialized","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32[]","name":"secondsAgos","type":"uint32[]"}],"name":"observe","outputs":[{"internalType":"int56[]","name":"tickCumulatives","type":"int56[]"},{"internalType":"uint160[]","name":"secondsPerLiquidityCumulativeX128s","type":"uint160[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"positions","outputs":[{"internalType":"uint128","name":"_liquidity","type":"uint128"},{"internalType":"uint256","name":"feeGrowthInside0LastX128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthInside1LastX128","type":"uint256"},{"internalType":"uint128","name":"tokensOwed0","type":"uint128"},{"internalType":"uint128","name":"tokensOwed1","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"protocolFees","outputs":[{"internalType":"uint128","name":"token0","type":"uint128"},{"internalType":"uint128","name":"token1","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"feeProtocol0","type":"uint8"},{"internalType":"uint8","name":"feeProtocol1","type":"uint8"}],"name":"setFeeProtocol","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"slot0","outputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"internalType":"int24","name":"tick","type":"int24"},{"internalType":"uint16","name":"observationIndex","type":"uint16"},{"internalType":"uint16","name":"observationCardinality","type":"uint16"},{"internalType":"uint16","name":"observationCardinalityNext","type":"uint16"},{"internalType":"uint8","name":"feeProtocol","type":"uint8"},{"internalType":"bool","name":"unlocked","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"}],"name":"snapshotCumulativesInside","outputs":[{"internalType":"int56","name":"tickCumulativeInside","type":"int56"},{"internalType":"uint160","name":"secondsPerLiquidityInsideX128","type":"uint160"},{"internalType":"uint32","name":"secondsInside","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bool","name":"zeroForOne","type":"bool"},{"internalType":"int256","name":"amountSpecified","type":"int256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[{"internalType":"int256","name":"amount0","type":"int256"},{"internalType":"int256","name":"amount1","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int16","name":"wordPosition","type":"int16"}],"name":"tickBitmap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tickSpacing","outputs":[{"internalType":"int24","name":"","type":"int24"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int24","name":"tick","type":"int24"}],"name":"ticks","outputs":[{"internalType":"uint128","name":"liquidityGross","type":"uint128"},{"internalType":"int128","name":"liquidityNet","type":"int128"},{"internalType":"uint256","name":"feeGrowthOutside0X128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthOutside1X128","type":"uint256"},{"internalType":"int56","name":"tickCumulativeOutside","type":"int56"},{"internalType":"uint160","name":"secondsPerLiquidityOutsideX128","type":"uint160"},{"internalType":"uint32","name":"secondsOutside","type":"uint32"},{"internalType":"bool","name":"initialized","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}] as const;
export const NonfungiblePositionManager = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH9","type":"address"},{"internalType":"address","name":"_tokenDescriptor_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Collect","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint128","name":"liquidity","type":"uint128"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"DecreaseLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint128","name":"liquidity","type":"uint128"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"IncreaseLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WETH9","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint128","name":"amount0Max","type":"uint128"},{"internalType":"uint128","name":"amount1Max","type":"uint128"}],"internalType":"struct INonfungiblePositionManager.CollectParams","name":"params","type":"tuple"}],"name":"collect","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token0","type":"address"},{"internalType":"address","name":"token1","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"}],"name":"createAndInitializePoolIfNecessary","outputs":[{"internalType":"address","name":"pool","type":"address"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"amount0Min","type":"uint256"},{"internalType":"uint256","name":"amount1Min","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct INonfungiblePositionManager.DecreaseLiquidityParams","name":"params","type":"tuple"}],"name":"decreaseLiquidity","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"amount0Desired","type":"uint256"},{"internalType":"uint256","name":"amount1Desired","type":"uint256"},{"internalType":"uint256","name":"amount0Min","type":"uint256"},{"internalType":"uint256","name":"amount1Min","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct INonfungiblePositionManager.IncreaseLiquidityParams","name":"params","type":"tuple"}],"name":"increaseLiquidity","outputs":[{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"token0","type":"address"},{"internalType":"address","name":"token1","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint256","name":"amount0Desired","type":"uint256"},{"internalType":"uint256","name":"amount1Desired","type":"uint256"},{"internalType":"uint256","name":"amount0Min","type":"uint256"},{"internalType":"uint256","name":"amount1Min","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct INonfungiblePositionManager.MintParams","name":"params","type":"tuple"}],"name":"mint","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"positions","outputs":[{"internalType":"uint96","name":"nonce","type":"uint96"},{"internalType":"address","name":"operator","type":"address"},{"internalType":"address","name":"token0","type":"address"},{"internalType":"address","name":"token1","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"feeGrowthInside0LastX128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthInside1LastX128","type":"uint256"},{"internalType":"uint128","name":"tokensOwed0","type":"uint128"},{"internalType":"uint128","name":"tokensOwed1","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"refundETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitAllowed","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitAllowedIfNecessary","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitIfNecessary","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"}],"name":"sweepToken","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount0Owed","type":"uint256"},{"internalType":"uint256","name":"amount1Owed","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"uniswapV3MintCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"}],"name":"unwrapWETH9","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}] as const;
export const SmartChefInitializable = [{"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"name":"AdminTokenRecovery","type":"event","inputs":[{"name":"tokenRecovered","type":"address","indexed":false,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"Deposit","type":"event","inputs":[{"name":"user","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"EmergencyWithdraw","type":"event","inputs":[{"name":"user","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"NewPoolLimit","type":"event","inputs":[{"name":"poolLimitPerUser","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"NewRewardPerBlock","type":"event","inputs":[{"name":"rewardPerBlock","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"NewStartAndEndBlocks","type":"event","inputs":[{"name":"startBlock","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"endBlock","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"OwnershipTransferred","type":"event","inputs":[{"name":"previousOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"name":"RewardsStop","type":"event","inputs":[{"name":"blockNumber","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"Withdraw","type":"event","inputs":[{"name":"user","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"name":"PRECISION_FACTOR","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"SMART_CHEF_FACTORY","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"name":"accTokenPerShare","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"bonusEndBlock","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"deposit","type":"function","inputs":[{"name":"_amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"emergencyRewardWithdraw","type":"function","inputs":[{"name":"_amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"emergencyWithdraw","type":"function","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"name":"hasUserLimit","type":"function","inputs":[],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"name":"initialize","type":"function","inputs":[{"name":"_stakedToken","type":"address","internalType":"contract IERC20"},{"name":"_rewardToken","type":"address","internalType":"contract IERC20"},{"name":"_rewardPerBlock","type":"uint256","internalType":"uint256"},{"name":"_startBlock","type":"uint256","internalType":"uint256"},{"name":"_bonusEndBlock","type":"uint256","internalType":"uint256"},{"name":"_poolLimitPerUser","type":"uint256","internalType":"uint256"},{"name":"_admin","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"isInitialized","type":"function","inputs":[],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"name":"lastRewardBlock","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"owner","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"name":"pendingReward","type":"function","inputs":[{"name":"_user","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"poolLimitPerUser","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"recoverWrongTokens","type":"function","inputs":[{"name":"_tokenAddress","type":"address","internalType":"address"},{"name":"_tokenAmount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"renounceOwnership","type":"function","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"name":"rewardPerBlock","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"rewardToken","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IERC20"}],"stateMutability":"view"},{"name":"stakedToken","type":"function","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IERC20"}],"stateMutability":"view"},{"name":"startBlock","type":"function","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"stopReward","type":"function","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"name":"transferOwnership","type":"function","inputs":[{"name":"newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"updatePoolLimitPerUser","type":"function","inputs":[{"name":"_hasUserLimit","type":"bool","internalType":"bool"},{"name":"_poolLimitPerUser","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"updateRewardPerBlock","type":"function","inputs":[{"name":"_rewardPerBlock","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"updateStartAndEndBlocks","type":"function","inputs":[{"name":"_startBlock","type":"uint256","internalType":"uint256"},{"name":"_bonusEndBlock","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"name":"userInfo","type":"function","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"rewardDebt","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"name":"withdraw","type":"function","inputs":[{"name":"_amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"}] as const;
export const XCashier = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_minAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_maxAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "name": "OwnableInvalidOwner",
    "type": "error",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "OwnableUnauthorizedAccount",
    "type": "error",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "name": "DepositReceived",
    "type": "event",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "recipient",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "id",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "MaxAmountSet",
    "type": "event",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "MinAmountSet",
    "type": "event",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "OperatorSet",
    "type": "event",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "active",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "name": "OwnershipTransferred",
    "type": "event",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "name": "Withdrawn",
    "type": "event",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "name": "deposit",
    "type": "function",
    "inputs": [
      {
        "name": "_recipient",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "name": "maxAmount",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "minAmount",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "owner",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "name": "renounceOwnership",
    "type": "function",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "setMaxAmount",
    "type": "function",
    "inputs": [
      {
        "name": "_maxAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "setMinAmount",
    "type": "function",
    "inputs": [
      {
        "name": "_minAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "setOperator",
    "type": "function",
    "inputs": [
      {
        "name": "_operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_active",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "transferOwnership",
    "type": "function",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "name": "withdraw",
    "type": "function",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  }
]
export const USDCSwapper = [ { "type": "constructor", "inputs": [ { "name": "_usdc_e", "type": "address", "internalType": "contract IERC20Burnable" }, { "name": "_iousdc", "type": "address", "internalType": "contract IERC20" } ], "stateMutability": "nonpayable" }, { "name": "balance", "type": "function", "inputs": [], "outputs": [ { "name": "", "type": "uint256", "internalType": "uint256" } ], "stateMutability": "view" }, { "name": "deposit", "type": "function", "inputs": [ { "name": "_amount", "type": "uint256", "internalType": "uint256" } ], "outputs": [], "stateMutability": "nonpayable" }, { "name": "iousdc", "type": "function", "inputs": [], "outputs": [ { "name": "", "type": "address", "internalType": "contract IERC20" } ], "stateMutability": "view" }, { "name": "usdc_e", "type": "function", "inputs": [], "outputs": [ { "name": "", "type": "address", "internalType": "contract IERC20Burnable" } ], "stateMutability": "view" }, { "name": "withdraw", "type": "function", "inputs": [ { "name": "_amount", "type": "uint256", "internalType": "uint256" } ], "outputs": [], "stateMutability": "nonpayable" } ] as const
export const Permit2 = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			}
		],
		"name": "AllowanceExpired",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ExcessiveInvalidation",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "maxAmount",
				"type": "uint256"
			}
		],
		"name": "InvalidAmount",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidContractSignature",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidNonce",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidSignature",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidSignatureLength",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidSigner",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "LengthMismatch",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "signatureDeadline",
				"type": "uint256"
			}
		],
		"name": "SignatureExpired",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint160",
				"name": "amount",
				"type": "uint160"
			},
			{
				"indexed": false,
				"internalType": "uint48",
				"name": "expiration",
				"type": "uint48"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "Lockdown",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint48",
				"name": "newNonce",
				"type": "uint48"
			},
			{
				"indexed": false,
				"internalType": "uint48",
				"name": "oldNonce",
				"type": "uint48"
			}
		],
		"name": "NonceInvalidation",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint160",
				"name": "amount",
				"type": "uint160"
			},
			{
				"indexed": false,
				"internalType": "uint48",
				"name": "expiration",
				"type": "uint48"
			},
			{
				"indexed": false,
				"internalType": "uint48",
				"name": "nonce",
				"type": "uint48"
			}
		],
		"name": "Permit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "word",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "mask",
				"type": "uint256"
			}
		],
		"name": "UnorderedNonceInvalidation",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "DOMAIN_SEPARATOR",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint160",
				"name": "amount",
				"type": "uint160"
			},
			{
				"internalType": "uint48",
				"name": "expiration",
				"type": "uint48"
			},
			{
				"internalType": "uint48",
				"name": "nonce",
				"type": "uint48"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint160",
				"name": "amount",
				"type": "uint160"
			},
			{
				"internalType": "uint48",
				"name": "expiration",
				"type": "uint48"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint48",
				"name": "newNonce",
				"type": "uint48"
			}
		],
		"name": "invalidateNonces",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "wordPos",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "mask",
				"type": "uint256"
			}
		],
		"name": "invalidateUnorderedNonces",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "token",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "spender",
						"type": "address"
					}
				],
				"internalType": "struct IAllowanceTransfer.TokenSpenderPair[]",
				"name": "approvals",
				"type": "tuple[]"
			}
		],
		"name": "lockdown",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "nonceBitmap",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"components": [
					{
						"components": [
							{
								"internalType": "address",
								"name": "token",
								"type": "address"
							},
							{
								"internalType": "uint160",
								"name": "amount",
								"type": "uint160"
							},
							{
								"internalType": "uint48",
								"name": "expiration",
								"type": "uint48"
							},
							{
								"internalType": "uint48",
								"name": "nonce",
								"type": "uint48"
							}
						],
						"internalType": "struct IAllowanceTransfer.PermitDetails[]",
						"name": "details",
						"type": "tuple[]"
					},
					{
						"internalType": "address",
						"name": "spender",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "sigDeadline",
						"type": "uint256"
					}
				],
				"internalType": "struct IAllowanceTransfer.PermitBatch",
				"name": "permitBatch",
				"type": "tuple"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "permit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"components": [
					{
						"components": [
							{
								"internalType": "address",
								"name": "token",
								"type": "address"
							},
							{
								"internalType": "uint160",
								"name": "amount",
								"type": "uint160"
							},
							{
								"internalType": "uint48",
								"name": "expiration",
								"type": "uint48"
							},
							{
								"internalType": "uint48",
								"name": "nonce",
								"type": "uint48"
							}
						],
						"internalType": "struct IAllowanceTransfer.PermitDetails",
						"name": "details",
						"type": "tuple"
					},
					{
						"internalType": "address",
						"name": "spender",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "sigDeadline",
						"type": "uint256"
					}
				],
				"internalType": "struct IAllowanceTransfer.PermitSingle",
				"name": "permitSingle",
				"type": "tuple"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "permit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "address",
								"name": "token",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							}
						],
						"internalType": "struct ISignatureTransfer.TokenPermissions",
						"name": "permitted",
						"type": "tuple"
					},
					{
						"internalType": "uint256",
						"name": "nonce",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deadline",
						"type": "uint256"
					}
				],
				"internalType": "struct ISignatureTransfer.PermitTransferFrom",
				"name": "permit",
				"type": "tuple"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "requestedAmount",
						"type": "uint256"
					}
				],
				"internalType": "struct ISignatureTransfer.SignatureTransferDetails",
				"name": "transferDetails",
				"type": "tuple"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "permitTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "address",
								"name": "token",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							}
						],
						"internalType": "struct ISignatureTransfer.TokenPermissions[]",
						"name": "permitted",
						"type": "tuple[]"
					},
					{
						"internalType": "uint256",
						"name": "nonce",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deadline",
						"type": "uint256"
					}
				],
				"internalType": "struct ISignatureTransfer.PermitBatchTransferFrom",
				"name": "permit",
				"type": "tuple"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "requestedAmount",
						"type": "uint256"
					}
				],
				"internalType": "struct ISignatureTransfer.SignatureTransferDetails[]",
				"name": "transferDetails",
				"type": "tuple[]"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "permitTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "address",
								"name": "token",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							}
						],
						"internalType": "struct ISignatureTransfer.TokenPermissions",
						"name": "permitted",
						"type": "tuple"
					},
					{
						"internalType": "uint256",
						"name": "nonce",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deadline",
						"type": "uint256"
					}
				],
				"internalType": "struct ISignatureTransfer.PermitTransferFrom",
				"name": "permit",
				"type": "tuple"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "requestedAmount",
						"type": "uint256"
					}
				],
				"internalType": "struct ISignatureTransfer.SignatureTransferDetails",
				"name": "transferDetails",
				"type": "tuple"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "witness",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "witnessTypeString",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "permitWitnessTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "address",
								"name": "token",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							}
						],
						"internalType": "struct ISignatureTransfer.TokenPermissions[]",
						"name": "permitted",
						"type": "tuple[]"
					},
					{
						"internalType": "uint256",
						"name": "nonce",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deadline",
						"type": "uint256"
					}
				],
				"internalType": "struct ISignatureTransfer.PermitBatchTransferFrom",
				"name": "permit",
				"type": "tuple"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "requestedAmount",
						"type": "uint256"
					}
				],
				"internalType": "struct ISignatureTransfer.SignatureTransferDetails[]",
				"name": "transferDetails",
				"type": "tuple[]"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "witness",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "witnessTypeString",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "permitWitnessTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint160",
						"name": "amount",
						"type": "uint160"
					},
					{
						"internalType": "address",
						"name": "token",
						"type": "address"
					}
				],
				"internalType": "struct IAllowanceTransfer.AllowanceTransferDetails[]",
				"name": "transferDetails",
				"type": "tuple[]"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint160",
				"name": "amount",
				"type": "uint160"
			},
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
] as const