from shared.exceptions import *
from settings.config import *

class AuthService():
    def __init__(self, token_service, crypt_service, user_database):
        self.token_service = token_service
        self.crypt_service = crypt_service
        self.user_database = user_database

    async def login(self, data):
        user_login = data["login"]#Логин это почта или НикНейм

        email_hash = ""
        
        if "@" in user_login:#Если есть собачка, идентефицируем как почту и создаём два хэша для поиска в БД
            email_hash = self.crypt_service.email_hash(user_login)
        
        user = await self.user_database.auth_user(email_hash, user_login)#Данные пользователя из БД
        
        if user == None:
            raise UserNotExist("Пользователь не существует")
            
        password_hash = self.crypt_service.password_hash(data["password"], user["salt"])
        
        if password_hash == user["password_hash"]:#Если пароль верный
            return await self.token_service.generate(user["id"])
            
        else:#Если пароль или другие данные неверны
            raise IncorrectData("Неверные учётные данные")
    
    async def registration(self, name, nick_name, password, email, consent_version):
        #Если пользователь не нажал на галочку об согласии пользовательского соглашении
        if consent_version == 0:
            raise ConsentRequired
        elif consent_version != NOW_CONSENT_VERSION:#Если клиент отправил другую версию пользовательского соглашения
            raise IncorrectConsentVersion

        salt, password_hash, email_hash = self.crypt_service.new_user(password, email)
        await self.user_database.create_user(name, nick_name, None, password_hash, consent_version, salt, email_hash)
        
    def before_request(self, token, path):#При успешной авторизации возвращает id пользователя
        if token != None:
            token_data = self.token_service.decrypt_token(token)
                    
            if token_data["type"] == "refresh" and not path.startswith(AUTH_API_PREFIX + "/updateTokens"):#Если передан токен с типом refresh и запрос к методом для получения данных пользователя, то возвращаем с ошибкой
                # return "Неверный токен, нужен токен доступа", 400
                raise NeedAccessToken

            elif token_data["type"] == "access" and path.startswith(AUTH_API_PREFIX + "/updateTokens"):#Если токен с типом доступа(access) и запрос для получения нового токена
                # return "Неверный токен, нужен токен типа refresh", 400
                raise NeedRefreshToken
                    
            return token_data["userId"]
        #Если не передан токен и это api запросы, то отправляем сообщение что необходима авторизация
        elif path.startswith(USER_API_PREFIX) and USER_API_PREFIX + "/get/" not in path:#request.path.startswith(AUTH_API_PREFIX + "/verifyToken") or 
            # return "Необходима авторизация", 401
            raise AuthRequired