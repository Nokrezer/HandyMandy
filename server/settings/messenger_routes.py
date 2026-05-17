class MessengerRoutes():
    def __init__(self, messenger_controller, messenger_auth_controller):
        self.messenger_controller = messenger_controller
        self.messenger_auth_controller = messenger_auth_controller
        
        self.MESSENGER_ROUTES = {"sendMessage":self.messenger_controller.send_message,
                                 "auth":self.messenger_auth_controller.auth,
                                 "getChats": self.messenger_controller.get_chats,
                                 "getChatMessages": self.messenger_controller.get_chat_messages,
                                 "deleteMessage": self.messenger_controller.delete_message,
                                 "echo": self.messenger_controller.echo}