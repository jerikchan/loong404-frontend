import { ProChat as ProChatAntd } from '@ant-design/pro-chat';

const ProChat = (props: React.ComponentProps<typeof ProChatAntd>) => {
  return <ProChatAntd {...props}></ProChatAntd>;
};

export default ProChat;
