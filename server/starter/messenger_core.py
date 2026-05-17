import asyncio
import websockets
import ssl

from settings.config import *

import jwt
import ast
import json

class AuthData():
    def __init__(self):
        self.token = None
        self.user_id = None
        self.websocket = None
    
    def set_token(self, data):
        self.token = data["ACCESS_TOKEN"].encode() if data.get("ACCESS_TOKEN", None) else None#data.get("ACCESS_TOKEN")

class MessageData():
    def __init__(self, data):
        self.action = data.get("action", None)
        self.reader_id = data.get("readerId", None)
        self.chat_id = data.get("chatId", None)
        self.message = data.get("message", None)
        self.message_id = data.get("messageId", None)
        self.limit = data.get("limit", 50)
        self.offset = data.get("offset", 0)

class CommandData():
    def __init__(self, data, users):
        self.message_data = data
        self.users = users

class MessengerCore():
    def __init__(self, token_service, routes, messenger_database):
        self.token_service = token_service
        self.routes = routes
        self.messenger_database = messenger_database

        self.authed_users = {}#ключ - аргумент, значение - websocket

    async def handler(self, websocket):
        auth_data = AuthData()
        # latest_chat_id = None
        
        async for message in websocket:#Получаем сообщение из сокета
            print(message)
            json_message = ast.literal_eval(message)
            message_data = MessageData(json_message)#Класс, хранит данные сообщения и пользователя(отправителя)
            message_data.user_id = auth_data.user_id#в данные сообщения передаём id пользователя
            
            call_func = self.routes.MESSENGER_ROUTES.get(message_data.action)

            if not call_func:
                await websocket.send("Метод не найден")
                continue

            try:
                if message_data.action == "auth":#Если это запрос авторизации
                    try:
                        auth_data.set_token(json_message)
                        
                        if not auth_data.token:
                            await websocket.send("Токен не передан")
                            continue

                        send_data = await call_func(auth_data)#await self.auth(websocket, message_data)#Направляем пользователя на авторизацию
                        
                        if send_data:#Если авторизация вернула что-либо, отправляем клиенту
                            await websocket.send(str(send_data))
                            
                        #Получаем id пользователя
                        auth_data.user_id = self.token_service.decrypt_token(auth_data.token)["userId"]
                        #Добавляем авторизованного пользователя(его id и сокет), 
                        #чтобы пользователи могли обмениваться сообщениями в режиме реального времени
                        self.authed_users[auth_data.user_id] = websocket
                        
                        #Получаем всех собеседников пользователя и id чатов в которых они состоят
                        # for user in await self.messenger_database.get_users_in_chats(auth_data.user_id):
                            
                        #     reader_id = user.get("user_id")#получаем id собеседника(если имеется)
                        #     #Если id полученного пользователя в списке онлайн пользователей
                        #     if reader_id in self.authed_users and reader_id != auth_data.user_id:
                        #         try:
                        #             del self.chats[user.get("chat_id")]
                        #         except: pass

                        #         self.chats[user.get("chat_id")] = {reader_id:self.authed_users.get(reader_id), auth_data.user_id:websocket}

                    except Exception as e:
                        await websocket.send(str(e))
                        #Если происходит ошибка, обнуляем авторизацию и пользователь должен заново авторизоваться
                        auth_data.token = None
                        del self.authed_users[auth_data.user_id]
                    continue#Не даём доступ ко всем методам

                if auth_data.token == None:#Если токен пустой
                    await websocket.send("Необходима авторизация")
                    continue#Запрещаем дальнейший доступ
                
                #Проверка токена
                try:
                    #Если токен валиден - пропускаем,
                    #Иначе происходит ошибка
                    self.token_service.verify_token(auth_data.token)
                except jwt.ExpiredSignatureError:
                    await websocket.send("Недействительный токен")
                    auth_data.token = None#Обнуляем токен
                    continue
                except Exception as e:
                    await websocket.send(str(e))
                    continue
                
                #Если пользователь отправляет сообщение в другой чат(или не отправляет)
                #то удаляем прошлый из памяти
                # if message_data.chat_id != latest_chat_id:
                #     try:
                #         del self.chats[latest_chat_id]
                #     except: pass

                #Если пользователь присылает сообщение другому пользователю,
                #Ищем собеседника в онлайн по чатам или по пользователям,
                #Если найдет - отправляем сообщение
                
                #обращаемся к запрашиваемому методу и сохраняем его вывод(если имеется)
                command_data = CommandData(message_data, self.authed_users)
                send_data = {message_data.action:await call_func(command_data)}
                #отправляем ответ, который дал контроллер
                
                await websocket.send(str(send_data))
                
                # if message_data.chat_id:
                # latest_chat_id = message_data.chat_id

            except Exception as e:
                await websocket.send(str(e))
            
        #Если цикл завершился(клиент отключился), удаляем из памяти пользователя и чат в котором он был
        try:
            del self.authed_users[auth_data.user_id]
            # del self.chats[latest_chat_id]
        except: pass
        
class MessengerRun():
    def __init__(self, messenger_core):
        self.messenger_core = messenger_core
        self.ssl_certs = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        self.ssl_certs.load_cert_chain(certfile=SSL_CERTFILE, keyfile=SSL_CERTKEY)

    async def init(self):
        server = await websockets.serve(self.messenger_core.handler, SERVER_HOST, MESSENGER_PORT, ssl=self.ssl_certs)
        await server.wait_closed()