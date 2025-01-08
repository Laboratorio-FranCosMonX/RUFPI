from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Tipo(db.Model):
    __tablename__ = 'tipos'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipo = db.Column(db.String(50), nullable=False)
    descricao = db.Column(db.String(255))

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    matricula_siapi = db.Column(db.Integer, unique=True, nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    cpf = db.Column(db.Integer, unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)
    tipo_id = db.Column(db.Integer, db.ForeignKey('tipos.id'), nullable=False)
    is_nutricionista = db.Column(db.Boolean, default=False)
    fichas = db.Column(db.Integer, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tipo = db.relationship('Tipo', backref='usuarios')

with app.app_context():
    db.create_all()

@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    usuarios = Usuario.query.all()
    result = []
    for usuario in usuarios:
        result.append({
            'id': usuario.id,
            'matricula_siapi': usuario.matricula_siapi,
            'nome': usuario.nome,
            'email': usuario.email,
            'cpf': usuario.cpf,
            'senha': usuario.senha,
            'tipo': usuario.tipo.tipo,
            'is_nutricionista': usuario.is_nutricionista,
            'created_at': usuario.created_at,
            'updated_at': usuario.updated_at
        })
    return jsonify(result)

@app.route('/usuarios/<int:id>', methods=['GET'])
def get_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    return jsonify({
        'id': usuario.id,
        'matricula_siapi': usuario.matricula_siapi,
        'nome': usuario.nome,
        'email': usuario.email,
        'cpf': usuario.cpf,
        'senha': usuario.senha,
        'tipo': usuario.tipo.tipo,
        'is_nutricionista': usuario.is_nutricionista,
        'created_at': usuario.created_at,
        'updated_at': usuario.updated_at
    })

@app.route('/usuarios', methods=['POST'])
def create_usuario():
    data = request.get_json()
    tipo = Tipo.query.filter_by(tipo=data['tipo']).first()
    if not tipo:
        return jsonify({'message': 'Tipo not found'}), 404

    usuario = Usuario(
        matricula_siapi=data['matricula_siapi'],
        nome=data['nome'],
        email=data['email'],
        cpf=data['cpf'],
        senha=data['senha'],
        tipo_id=tipo.id,
        is_nutricionista=data.get('is_nutricionista', False),
        fichas=0
    )

    db.session.add(usuario)
    db.session.commit()
    return jsonify({'message': 'Usuario created successfully'}), 201

@app.route('/tipos', methods=['POST'])
def create_tipo():
    data = request.get_json()
    tipo = Tipo(tipo=data['tipo'], descricao=data['descricao'])
    db.session.add(tipo)
    db.session.commit()
    return jsonify({'message': 'Tipo created successfully'}), 201

@app.route('/usuario/<int:id>/add_fichas', methods=['POST'])
def add_fichas(id):
    user = Usuario.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        fichas_to_add = int(request.json.get('fichas'))
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid fichas value'}), 400

    user.fichas += fichas_to_add
    db.session.commit()

    return jsonify({'message': f'Added {fichas_to_add} fichas to user {id}', 'fichas': user.fichas}), 200

@app.route('/usuario/<int:id>/deduct_fichas', methods=['POST'])
def deduct_fichas(id):
    user = Usuario.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        fichas_to_deduct = int(request.json.get('fichas'))
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid fichas value'}), 400

    if user.fichas < fichas_to_deduct:
        return jsonify({'error': 'Not enough fichas to deduct'}), 400

    user.fichas -= fichas_to_deduct
    db.session.commit()

    return jsonify({'message': f'Deducted {fichas_to_deduct} fichas from user {id}', 'fichas': user.fichas}), 200

if __name__ == '__main__':
    app.run(debug=True)
