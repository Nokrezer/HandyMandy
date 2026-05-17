class MessengerController():
    def __init__(self, messenger_service):
        self.messenger_service = messenger_service

    async def send_message(self, command_data):
        message_data = await self.messenger_service.send_message(command_data.message_data)
        await self._send_live_message(message_data, command_data)

        return message_data
    
    async def _send_live_message(self, message_data, command_data):
        # if data.reader_id and data.reader_id in users:#Если передан id собеседника
        
        #Находим пользователя в списке пользователей онлайн и отправляем соо в реальном времени
        # print("MSG data: ", message_data)
        user_online = command_data.users.get(int(command_data.message_data.reader_id))
        if user_online:
            await user_online.send(str({"liveMessage": await self.messenger_service.get_message(message_data["message_id"], message_data["chat_id"])}))
                

        # elif data.chat_id and len(chats) > 0:#Если передан id чата
        #     for chat_user_id, websocket in chats.get(data.chat_id).items():
        #         if chat_user_id != data.user_id:
        #             await websocket.send(str({"liveMessage": await self.messenger_service.get_message(message_id, data.chat_id)}))
    
    async def get_chats(self, command_data):
        return await self.messenger_service.get_chats(command_data.message_data.user_id)
    
    async def get_chat_messages(self, command_data):
        return await self.messenger_service.get_chat_messages(command_data.message_data.user_id,
                                                              command_data.message_data.reader_id)
    
    async def delete_message(self, command_data):
        await self.messenger_service.delete_message(command_data.message_data.message_id,
                                                    command_data.message_data.user_id)

    async def echo(self, command_data):
        return command_data.message_data.message