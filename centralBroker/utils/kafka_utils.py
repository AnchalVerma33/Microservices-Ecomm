from confluent_kafka import Consumer


class KafkaUtils:
    
    def __init__(self) -> None:
        self.servers = "localhost:9092"
        
        
    def get_kafka_consumer(self, group_id):
        configurations = {
            "bootstrap.servers" : self.servers,
            "auto.offset.reset" : "earliest",
            "group.id": group_id
        }
        return Consumer(configurations)
    
    
    def subscribe_to_topic(self,topic,consumer):
        consumer.subscribe([topic])
        
        
        
    
    
    