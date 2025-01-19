from flask import Flask
from flask_cors import CORS
from models import db
from routes.auth import auth_bp
from routes.cardapio import cardapio_bp
from routes.ingrediente import ingrediente_bp
from routes.prato import prato_bp
from routes.refeicao import refeicao_bp
from routes.tipo import tipo_bp
from routes.usuario import usuario_bp
from routes.error_handler import error_handler_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'chave-de-teste'
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(cardapio_bp)
app.register_blueprint(ingrediente_bp)
app.register_blueprint(prato_bp)
app.register_blueprint(refeicao_bp)
app.register_blueprint(tipo_bp)
app.register_blueprint(usuario_bp)
app.register_blueprint(error_handler_bp)

db.init_app(app)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=False)