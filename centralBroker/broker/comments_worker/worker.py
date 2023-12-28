from confluent_kafka import KafkaError
from utils.kafka_utils import KafkaUtils
# from kafka_utils import get_kafka_consumer, subscribe_to_topic, close_kafka_consumer
        
class CommentsWorker:
    def __init__(self, topic) -> None:
        self.topic = topic
        self.kafka_utils = KafkaUtils()
        self.consumer = self.kafka_utils.get_kafka_consumer(self.topic)
        
    def process_message(self):
        self.kafka_utils.subscribe_to_topic(self.topic, self.consumer)
        try:
            while True:
                msg = self.consumer.poll(timeout=1)
                print(msg)
                if msg is None:
                    continue
                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        continue
                    else:
                        print(msg.error())
                        break

                print(f"Received message from {self.topic}: {msg.value().decode('utf-8')}")
                
            
        except Exception as e:
            print(e)
        
        except KeyboardInterrupt :
            exit(0)            
            
    

    

