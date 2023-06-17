def ble_send():
    import requests
    import json
    import time
    import pika
    from config import BLE_LINK
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='hello')
    start_time = time.time()
    while True:

        link = BLE_LINK
        f = requests.get(link)
        response = json.loads(f.text)
        for i in response['devices']:
            device_link = link+i
            o = requests.get(device_link)
            response = json.loads(o.text)
            msg = response['devices'][i]['raddec']

            channel.basic_publish(exchange='',
                                  routing_key='hello',
                                  body=json.dumps(msg))
        if time.time()-start_time >= 5:
            channel.basic_publish(exchange='',
                                  routing_key='hello',
                                  body="End")
            print("sent message")
            # connection.close()
            break
