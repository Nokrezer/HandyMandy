from quart import request, jsonify

from shared.exceptions import *

import asyncio

import jwt

class AuthController():
    def __init__(self, token_service, auth_service):
        self.token_service = token_service
        self.auth_service = auth_service

    async def update_access_token(self):
        try:
            token = request.cookies.get("REFRESH_TOKEN")#Получаем refresh token от веб клиента
            access_token = await self.token_service.update_access_token(token)
            return jsonify({"ACCESS_TOKEN": access_token}), 200#Возвращаем только access токен
        except Exception as e:
            return str(e), 400

    # async def update_tokens(self):
    #     try:
    #         data = await request.form
            
    #         if "okhttp" in request.headers:#если это клиент помимо веб(андроид/айфон и тд)
                
    #             access_token, refresh_token = await self.token_service.update_tokens(data["token"])

    #             return jsonify({"ACCESS_TOKEN": access_token, "REFRESH_TOKEN": refresh_token}), 200
    #         else:#В случае, если браузер
    #             token = {"token": request.cookies.get("REFRESH_TOKEN")}#Получаем refresh token от веб клиента
                
        #         access_token, refresh_token = await self.token_service.update_tokens(token["token"])
            
        #         response = jsonify({"ACCESS_TOKEN": access_token})
        #         response.set_cookie(
        #                     'REFRESH_TOKEN',
        #                     value=refresh_token,
        #                     httponly=True,
        #                     secure=True,
        #                     samesite='strict',
        #                     max_age=3600 * 24 * 7  # 7 дней
        #                 )
                
        #         return response, 200#Возвращаем только access токен

        # except Exception as e:
        #     return str(e), 401

    async def verify_token(self):#Функция для проверки, действительный ли access токен
        try:
            token = request.headers.get("Authorization").split(" ")[1]
            self.token_service.verify_token(token)
            return {"success": True}, 200
        except TokenOutdated as e:
            return str(e), 401
        except Exception as e:
            return str(e), 400

    async def login(self):
        try:
            data = await request.form
            access_token, refresh_token = await self.auth_service.login(data)
            
            if "okhttp" in request.headers.get("User-Agent") or "PostmanRuntime" in request.headers.get("User-Agent"):#если это клиент помимое веб(андроид/айфон и тд)
                return jsonify({"ACCESS_TOKEN": access_token, "REFRESH_TOKEN": refresh_token}), 200
            else:
                response = jsonify({"ACCESS_TOKEN": access_token})

                response.set_cookie(
                        'REFRESH_TOKEN',
                        value=refresh_token,
                        httponly=True,
                        secure=True,
                        samesite='strict',
                        max_age=3600 * 24 * 7  # 7 дней
                )
                
                return response, 200#Возвращаем только access токен

        except Exception as e:
            return str(e), 400

    async def registration(self):
        try:
            data = await request.form

            await self.auth_service.registration(data["name"], data["nickName"],
                                                 data["password"], data["email"],
                                                 data["consentVersion"])
            
            return '', 200
        except ConsentRequired:
            return "Необходимо подписать пользовательское соглашение", 403
        except IncorrectConsentVersion:
            return "Неверная версия пользовательского соглашения", 403
        except Exception as e:
            return str(e), 400
    
    def get_tmp_token(self):
        try:
            return self.token_service.generate_file_token()
        except Exception as e:
            return str(e), 400
        
    def before_request(self):
        try:
            token = request.headers.get("Authorization").split(" ")[1]
        except:
            token = None

        request.user_id = None

        try:
            request.user_id = self.auth_service.before_request(token, request.path)
        except jwt.ExpiredSignatureError: return "Недействительный токен", 401
        except jwt.InvalidSignatureError: return "Неверная подпись", 401
        except NeedAccessToken: return "Неверный токен, нужен токен доступа", 400
        except NeedRefreshToken: return "Неверный токен, нужен токен типа refresh", 400
        except AuthRequired: return "Необходима авторизация", 401
        except Exception as e: return str(e), 400
