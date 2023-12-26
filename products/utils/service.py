import uuid

class Utils:
    @staticmethod
    def generate_uuid():
        return str(uuid.uuid4()).replace("-", "")
