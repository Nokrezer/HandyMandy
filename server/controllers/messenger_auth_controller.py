import jwt

class MessengerAuthController():
    def __init__(self, token_service):
        self.token_service = token_service

    async def auth(self, data):#Самый первый метод, для авторизации пользователя
        try:
            token_data = self.token_service.decrypt_token(data.token)
            
            if token_data["type"] != "access":#Если токен с типом доступа(access)
                return "Неверный токен, нужен токен типа access"
            
        except jwt.ExpiredSignatureError: return "Недействительный токен"
        except jwt.InvalidSignatureError: return "Неверная подпись"
        except Exception as e: return str(e)
