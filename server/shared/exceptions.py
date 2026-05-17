class TokenNotFound(Exception): pass

class TokenOutdated(Exception): pass

class IncorrectToken(Exception): pass#Неверный токен

class UserNotExist(Exception): pass

class IncorrectData(Exception): pass

class PostLimit(Exception): pass

class ProductLimit(Exception): pass

class PermissionDenied(Exception): pass#Доступ запрещён/ограничен

class FileNotFound(Exception): pass#Если изображение/файл не найдены

class UserNotFound(Exception):pass#Если пользователь не найден

class SubcribeOnYourSelf(Exception):pass#Если пользователь подписывается на себя

class NullDataPost(Exception): pass#Если клиент отправляет пустой пост

class NullDataProduct(Exception): pass#Если клиент отправляет пустую карточку товара

class NickNameExists(Exception): pass

class FeedEnd(Exception): pass

class NotValidToken(Exception): pass

class NeedAccessToken(Exception): pass
class NeedRefreshToken(Exception): pass

class AuthRequired(Exception): pass

class ConsentRequired(Exception): pass#Если клиент не передал согласие об пользовательском соглашении
class IncorrectConsentVersion(Exception): pass#Если клиент передаёт версию пользовательского соглашения выше или ниже, которая сейчас