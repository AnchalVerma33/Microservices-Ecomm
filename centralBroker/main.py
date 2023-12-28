from multiprocessing import Process
from broker.comments_worker.worker import CommentsWorker


if __name__ == "__main__":
    comment_process = Process(target = CommentsWorker("comments").process_message())
    try:
        comment_process.join()    
    except KeyboardInterrupt :
        comment_process.terminate()
        exit(0)