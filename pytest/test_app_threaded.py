import json
import threading
from queue import Queue
import requests
#import bs4
import time

print_lock = threading.Lock()

def get_url(current_url):

    #with print_lock:
    #    print("\nStarting thread {}".format(threading.current_thread().name))
    res = requests.get(current_url)
    res.raise_for_status()

    #with print_lock:
    #    print("\nFinished fetching : {}".format(current_url))

def process_queue():
    while True:
        current_url = url_queue.get()
        get_url(current_url)
        url_queue.task_done()

url_queue = Queue()

url_list = ["http://localhost:3000/files"]*500

def start_p_thread():
    t = threading.Thread(target=process_queue)
    t.daemon = True
    t.start()
    return t
threadlist = [start_p_thread() for _ in range(25)]

start = time.time()

for current_url in url_list:
    url_queue.put(current_url)

url_queue.join()

print("Execution time = {0:.5f}".format(time.time() - start))

for tt in threadlist:
    tt.join()

