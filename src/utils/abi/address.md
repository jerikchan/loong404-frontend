| 测试环境 OP Sepolia Testnet   | address                                    |
| ----------------------------- | ------------------------------------------ |
| greatLAddr(大龙token)         | 0xec8DF505661c0d5845Bd3D3F3a4180Eade2ACA32 |
| greatLMintAddr(大龙mint addr) | 0xc77dF1E6D4351f8aBa98722f66c481dd236F8885 |
| babyLAddr(小龙token)          | 0x89426d1e7D8Cc62d89eA543E696ee589DA3722E0 |
| babyLMintAddr(小龙mint addr)  | 0x799d5050fa3dd87ef31b4Baa918A631A2521CFF4 |
| swapAddress                   | 0x7D15890177D88a38778702643CAb414cd387Bc40 |
| dataAddress                   | 0x46096ca702716ea68e7fb1A30679fa1B263d7e77 |

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
