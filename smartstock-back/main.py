from http.server import BaseHTTPRequestHandler, HTTPServer
import csv
import json

class CSVHTTPRequestHandler(BaseHTTPRequestHandler):

    def set_cors_headers(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self.set_cors_headers()
        self.end_headers()
    
    def do_POST(self):
        # リクエストのコンテンツ長を取得
        content_length = int(self.headers['Content-Length'])
        # リクエストボディを読み取り
        post_data = self.rfile.read(content_length)
        # JSONデータを解析
        data = json.loads(post_data)

        # CSVファイルにデータを書き込み
        with open('data.csv', 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([data['name'], data['quantity']])

        # レスポンスを送信
        self.send_response(200)
        self.set_cors_headers()
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {'status': 'received'}
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_GET(self):
        # CSVファイルの内容を読み込む
        try:
            with open('data.csv', 'r', newline='') as file:
                reader = csv.reader(file)
                data_list = list(reader)
        except FileNotFoundError:
            self.send_response(404)
            self.end_headers()
            return

        # レスポンスを送信
        self.send_response(200)
        self.set_cors_headers()
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data_list).encode('utf-8'))

# サーバーの設定
server_address = ('', 8000)
httpd = HTTPServer(server_address, CSVHTTPRequestHandler)
print('Server running on port %s' % server_address[1])
httpd.serve_forever()