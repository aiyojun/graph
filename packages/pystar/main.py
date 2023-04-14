import json
import os
import sys
import time

from tornado.web import Application, HTTPServer, RequestHandler
from tornado.ioloop import IOLoop

# from textrank4zh import TextRank4Sentence


article_path = 'C:/jpro/graph/packages/website-graph-intro/public/articles'


# tr4s = TextRank4Sentence()
# file_path = os.path.join(article_path, markdown_files[0]["filename"])
# fp = open(file_path)
# text = fp.read()
# print("read: " + text)
# tr4s.analyze(text=text)
# abstract = []
# for item in tr4s.get_key_sentences(num=200):
#     if len(item.sentence) < 300:
#         abstract.append([item.index, item.sentence])
# abstract = sorted(abstract[:10], key=lambda x: x[0])
# abstract = ["(%i) %s" % (i, x[1]) for i, x in enumerate(abstract, 1)]
# print(''.join(abstract))
# print(json.dumps(markdown_files))


class ModelHandler(RequestHandler):
    def get(self):
        self.write({'models': [
            {
                'group': 'Algorithm',
                'name': 'Histogram',
                'description': 'Help to generate histogram of an image by analysis.',
                'author': 'Jun.Dai',
                'create_time': '2023-04-14 12:30:00',
                'topology': {},
            },
            {
                'group': 'Image processing',
                'name': 'To Gray',
                'description': 'Convert a colorful rgb image to a gray image.',
                'author': 'Jun.Dai',
                'create_time': '2023-04-14 12:30:01',
                'topology': {},
            },
            {
                'group': 'Image processing',
                'name': 'To Gray',
                'description': 'Convert a colorful rgb image to a gray image.',
                'author': 'Jun.Dai',
                'create_time': '2023-04-14 12:30:01',
                'topology': {},
            },
            {
                'group': 'Image processing',
                'name': 'To Gray',
                'description': 'Convert a colorful rgb image to a gray image.',
                'author': 'Jun.Dai',
                'create_time': '2023-04-14 12:30:01',
                'topology': {},
            },
            {
                'group': 'Image processing',
                'name': 'To Gray',
                'description': 'Convert a colorful rgb image to a gray image.',
                'author': 'Jun.Dai',
                'create_time': '2023-04-14 12:30:01',
                'topology': {},
            },
        ]})

    def post(self):
        req = json.loads(self.request.body.decode(encoding='UTF-8'))
        print(req)
        self.write({"success": True})
        pass


def main():
    HTTPServer(Application([
        (r"/model/history", ModelHandler),
        (r"/model/create", ModelHandler),
    ])).listen(8090)
    IOLoop.current().start()


if __name__ == '__main__':
    main()
