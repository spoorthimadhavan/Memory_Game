class GameException(Exception):
    """Base game error."""

    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class SessionNotFoundError(GameException):
    def __init__(self, session_id: str):
        super().__init__(f"Session not found: {session_id}", status_code=404)


class InvalidActionError(GameException):
    def __init__(self, message: str = "Action is invalid or too short"):
        super().__init__(message, status_code=422)


class InvalidCategoryError(GameException):
    def __init__(self, category_id: str):
        super().__init__(f"Unknown category: {category_id}", status_code=400)
