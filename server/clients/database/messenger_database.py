class MessengerDatabase():
    def __init__(self, database):
        self.database = database

    async def exist_chat(self, writer_id, reader_id):
        return await self.database.get_data("""SELECT chat_id FROM chats
                                            WHERE (writer_id = %s AND reader_id = %s)
                                            OR (writer_id = %s AND reader_id = %s)""", writer_id, reader_id, reader_id, writer_id)
    
    async def delete_message(self, message_id, user_id):
        await self.database.create("""UPDATE messages SET deleted=1
                                   WHERE message_id=%s AND user_id=%s""", message_id, user_id)

    async def send_message(self, user_id, chat_id, message, message_id):
        await self.database.create("INSERT INTO messages (user_id, chat_id, message, message_id) VALUES (%s, %s, %s, %s)", user_id, chat_id, message, message_id)

    async def get_chat_messages(self, user_id, reader_id, limit=50, offset=0):
        return await self.database.get_data("""SELECT messages.message_id, messages.user_id, messages.chat_id, messages.message,
                                                DATE_FORMAT(messages.created_at, '%%Y-%%m-%%d %%H:%%i:%%s') AS created_at
                                                FROM messages
                                                JOIN chats ON (chats.writer_id=%s AND chats.reader_id=%s) OR (chats.writer_id=%s AND chats.reader_id=%s)
                                                WHERE chats.chat_id = messages.chat_id AND messages.deleted = 0                               
                                                LIMIT %s OFFSET %s""", user_id, reader_id, reader_id, user_id, limit, offset, fetchall=True)
    
    async def create_chat(self, writer_id, reader_id, chat_id):
        await self.database.create("""INSERT INTO chats (writer_id, reader_id, chat_id)
                                    SELECT %s, %s, %s
                                    WHERE NOT EXISTS (
                                    SELECT 1 FROM chats 
                                    WHERE (writer_id = %s AND reader_id = %s)
                                    OR (writer_id = %s AND reader_id = %s)
                                    )""", writer_id, reader_id, chat_id, writer_id, reader_id, reader_id, writer_id)

    async def get_chats(self, user_id):
        return await self.database.get_data("""SELECT chats.writer_id, chats.reader_id, users.photo_url, users.name
                                            FROM chats
                                            JOIN users ON users.id = IF(chats.writer_id <> %s, chats.writer_id, chats.reader_id)
                                            WHERE writer_id=%s OR reader_id=%s
                                            ORDER BY created_at DESC""", user_id, user_id, user_id, fetchall=True)

    #Метод для получения id пользователей с которыми общается переданный пользователь(его id)
    async def get_users_in_chats(self, user_id):
        return await self.database.get_data("""SELECT writer_id AS user_id, chat_id FROM chats
                                            WHERE reader_id=%s
                                            UNION
                                            SELECT writer_id AS user_id, chat_id FROM chats
                                            WHERE writer_id=%s""", user_id, user_id, fetchall=True)
    
    async def get_message(self, message_id):
        return await self.database.get_data("""SELECT msgs.message_id, msgs.user_id, msgs.chat_id, msgs.message,
                                            DATE_FORMAT(msgs.created_at, '%%Y-%%m-%%d %%H:%%i:%%s') AS created_at
                                            FROM messages AS msgs
                                            WHERE message_id=%s""", message_id)
    # async def create_message(self, writer_id, reader_id, chat_id, message):
    #     await self.create_chat("""INSERT INTO messages
    #                            (writer_id, reader_id, chat_id, message)
    #                            VALUES (%s, %s, %s, %s)""", writer_id, reader_id, chat_id, message)