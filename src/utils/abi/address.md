| 测试环境 Arbiturm Sepolia Testnet | address                                    |
| --------------------------------- | ------------------------------------------ |
| greatLAddr(大龙token)             | 0x16BC08C21e407343F9C6f951cd11e06C5eC4f0Dd |
| greatLMintAddr(大龙mint addr)     | 0x8F3fF5fD42915EF28EABfDBC29005D8b9Be09e6F |
| babyLAddr(小龙token)              | 0xA4DCba97b9c82ec0C23CAc52Fc048bc6f963fcD6 |
| babyLMintAddr(小龙mint addr)      | 0xa4249C1C66cD184877F9a23eCA043497701a597A |
| swapAddress                       | 0x3FBad78aFC873920F00E7d4373cb59AABa3cB57a |
| dataAddress                       | 0xb0a2291Bb9B2B14122C509A719Af124199ae0cC7 |

1. 大小龙mint的时候用(greatLMintAddr，babyLMintAddr):

- freeMint()：free mint
- mint(uint256 num,string memory \_inviteCode): mint 参数：（个数，邀请码（没有传空串）
- getClaimAmount(address addr): 获取当天可以claim奖励金额 参数:(账户地址)
- getInviteRewards(address addr):获取总的邀请奖励数
- claim(): claim邀请奖励
- checkFree(address addr): 校验钱包是否可以免费mint 参数:账户地址 返回值:(true:可以free mint,false: 不可free mint)
- limitMintMap(address addr) 查询已经mint的个数 参数:账户地址 返回值：mint的个数
- getOwned(address addr)获取地址拥有的nft id
- tokenURI(uint256 id) 获取图片地址

2. dataStorage(dataAddress):

- generateInviteCode(string memory \_inviteCode)：生成邀请码 参数：（邀请码）（需要前端生成6位邀请码传到参数中）
- getInviteCode(address addr): 获取邀请吗
- getInviteCodes():获取所有邀请吗（可校验用户的邀请码是否无效）
- discountList(address addr) 判断地址是否是白单 参数：账户地址 返回值：number number>0 表示地址是白单
- buyListAdultL(address addr) 大龙免费已经mint的个数 参数：账户地址 返回值：个数
- buyListBabyL(address addr) 小龙免费已经mint的个数 参数：账户地址 返回值：个数

3. swap json中:(swapAddress)

- swap： 1：1交换大小龙 参数:(from(大龙或小龙address), to(大龙或小龙address),amount)

4. 显示free mint的逻辑
   ![流程图](./image/img.png)
