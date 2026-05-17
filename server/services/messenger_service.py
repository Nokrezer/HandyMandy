import ast

import uuid

class MessengerService():
    def __init__(self, crypt_service, messenger_database):
        self.crypt_service = crypt_service
        self.messenger_database = messenger_database

    async def create_new_chat(self, writer_id, reader_id):#создает новый чат, возвращает id нового чата
        chat_id = uuid.uuid4().hex
        print(writer_id, reader_id)
        await self.messenger_database.create_chat(writer_id, reader_id, chat_id)

        return chat_id
    
    #Запись сообщения в БД
    async def send_message(self, data):
        if len(data.message) == 0 or int(data.user_id) == int(data.reader_id):
            print("RET")
            return 
        #Проверяем, существует ли чат по переданному id участников
        exist_chat = await self.messenger_database.exist_chat(data.user_id, data.reader_id)
        
        chat_id = None
        if exist_chat:
            chat_id = exist_chat.get("chat_id")
        if chat_id == None or not exist_chat:#Если чат не существует, создаём
            chat_id = await self.create_new_chat(data.user_id, data.reader_id)
            
        crypt_message = self.crypt_service.crypt_message(data.message, chat_id)
        message_id = uuid.uuid4().hex#Создаём id сообщения
        
        #Создание нового сообщения в БД
        await self.messenger_database.send_message(chat_id=chat_id, user_id=data.user_id, 
                                                   message=crypt_message, message_id=message_id)
        
        return await self.get_message(message_id, chat_id)
        
    async def get_chat_messages(self, user_id, reader_id, limit=50, offset=0):
        chat_messages = await self.messenger_database.get_chat_messages(user_id, reader_id, limit, offset)

        #Необходимо расшифровать сообщения, перебираем каждое сообщение
        #и меняем шифрованное сообщение на обычное
        for message in chat_messages:
            message["message"] = self.crypt_service.decrypt_message(message["message"], message["chat_id"]).decode()
        print(chat_messages)
        return chat_messages

    async def get_chats(self, user_id):
        return await self.messenger_database.get_chats(user_id)
    
    async def delete_message(self, message_id, user_id):
        await self.messenger_database.delete_message(message_id, user_id)

    async def get_message(self, message_id, chat_id):
        raw_message = await self.messenger_database.get_message(message_id)
        raw_message["message"] = self.crypt_service.decrypt_message(raw_message["message"], chat_id).decode()
        return raw_message