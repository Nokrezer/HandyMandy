class LogDatabase():
    def __init__(self, database):
        self.database = database

    async def add_log(self, action, user_ip, user_id=None):
        await self.database.create("INSERT INTO logs (action, user_ip, user_id) VALUES (%s, %s, %s)", action, user_ip, user_id)