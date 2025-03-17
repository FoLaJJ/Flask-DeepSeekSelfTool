from flask import Flask, render_template
from route import api
from config import THEMES

app = Flask(__name__)
app.register_blueprint(api, url_prefix='/api')

@app.route('/')
def index():
    return render_template('index.html', themes=THEMES)

if __name__ == '__main__':
    app.run(debug=True, port=5000)