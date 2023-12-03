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
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        # CSVファイルを読み込み、最後の管理番号を取得
        try:
            with open('data.csv', 'r', newline='') as file:
                last_id = sum(1 for row in csv.reader(file))
        except FileNotFoundError:
            last_id = 0

        # 数量が0の場合、エラーを回避するためにデフォルトの重量を設定
        quantity = max(1, int(data['quantity']))

        # 一個当たりの重量を計算（モデルケースとしての総重量は1000g）
        per_item_weight = round(1000 / quantity, 2)  # 小数点以下2桁に丸める

        # CSVファイルにデータを書き込み
        with open('data.csv', 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([last_id + 1, data['name'], data['quantity'], per_item_weight])

        # レスポンスを送信
        self.send_response(200)
        self.set_cors_headers()
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