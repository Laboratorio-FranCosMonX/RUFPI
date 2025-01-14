from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

@app.errorhandler(400)
def handle_bad_request(error):
    return jsonify({
        "error": "Bad Request",
        "message": str(error.description) if error.description else "The request could not be understood by the server."
    }), 400

@app.errorhandler(404)
def handle_not_found(error):
    return jsonify({
        "error": "Not Found",
        "message": "The requested resource was not found on the server."
    }), 404

@app.errorhandler(405)
def handle_method_not_allowed(error):
    return jsonify({
        "error": "Method Not Allowed",
        "message": f"The method {error.method} is not allowed for the requested URL."
    }), 405

@app.errorhandler(500)
def handle_internal_server_error(error):
    return jsonify({
        "error": "Internal Server Error",
        "message": "An unexpected error occurred on the server."
    }), 500

@app.errorhandler(Exception)
def handle_exception(error):
    return jsonify({
        "error": "An unexpected error occurred",
        "message": str(error)
    }), 500

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

class Cardapio(db.Model):
    __tablename__ = 'cardapios'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    descricao = db.Column(db.String(255), nullable=False)
    data = db.Column(db.Date, nullable=False)
    anotacao = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Prato(db.Model):
    __tablename__ = 'pratos'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Ingrediente(db.Model):
    __tablename__ = 'ingredientes'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(100), nullable=False)

with app.app_context():
    db.create_all()

@app.route('/usuarios', methods=['POST'])
def create_usuario():
    data = request.get_json()
    tipo = Tipo.query.filter_by(tipo=data['tipo']).first()
    if not tipo:
        return jsonify({'message': 'Tipo not found'}), 404
    existing_user = Usuario.query.filter_by(cpf=data['cpf']).first()
    if existing_user:
        return jsonify({'error': 'CPF já cadastrado'}), 400

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

@app.route('/usuarios/matricula/<int:matricula_siapi>', methods=['GET'])
def get_usuario_by_matricula(matricula_siapi):
    usuario = Usuario.query.filter_by(matricula_siapi=matricula_siapi).first()
    if usuario:
        return jsonify({
            "id": usuario.id,
            "matricula_siapi": usuario.matricula_siapi,
            "nome": usuario.nome,
            "email": usuario.email,
            "cpf": usuario.cpf,
            "tipo_id": usuario.tipo_id,
            "is_nutricionista": usuario.is_nutricionista,
            "fichas": usuario.fichas,
            "created_at": usuario.created_at,
            "updated_at": usuario.updated_at
        }), 200
    else:
        return jsonify({"error": "Usuario not found"}), 404

@app.route('/usuarios/tipo/<int:tipo_id>', methods=['GET'])
def get_usuarios_by_tipo(tipo_id):
    usuarios = Usuario.query.filter_by(tipo_id=tipo_id).all()
    if usuarios:
        return jsonify([
            {
                "id": usuario.id,
                "matricula_siapi": usuario.matricula_siapi,
                "nome": usuario.nome,
                "email": usuario.email,
                "cpf": usuario.cpf,
                "tipo_id": usuario.tipo_id,
                "is_nutricionista": usuario.is_nutricionista,
                "fichas": usuario.fichas,
                "created_at": usuario.created_at,
                "updated_at": usuario.updated_at
            }
            for usuario in usuarios
        ]), 200
    else:
        return jsonify({"error": "No usuarios found for the given tipo_id"}), 404

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

@app.route('/cardapios', methods=['POST'])
def create_cardapio():
    data = request.get_json()
    cardapio = Cardapio(
        descricao=data['descricao'],
        data=datetime.strptime(data['data'], '%Y-%m-%d').date(),
        anotacao=data.get('anotacao', '')
    )
    db.session.add(cardapio)
    db.session.commit()
    return jsonify({'message': 'Cardapio created successfully'}), 201

@app.route('/cardapios', methods=['GET'])
def get_cardapios():
    cardapios = Cardapio.query.all()
    result = []
    for cardapio in cardapios:
        result.append({
            'id': cardapio.id,
            'descricao': cardapio.descricao,
            'data': cardapio.data,
            'anotacao': cardapio.anotacao,
            'created_at': cardapio.created_at,
            'updated_at': cardapio.updated_at
        })
    return jsonify(result)

@app.route('/pratos', methods=['POST'])
def create_prato():
    data = request.get_json()
    prato = Prato(nome=data['nome'])
    db.session.add(prato)
    db.session.commit()
    return jsonify({'message': 'Prato created successfully'}), 201

@app.route('/pratos', methods=['GET'])
def get_pratos():
    pratos = Prato.query.all()
    result = []
    for prato in pratos:
        result.append({
            'id': prato.id,
            'nome': prato.nome,
            'created_at': prato.created_at,
            'updated_at': prato.updated_at
        })
    return jsonify(result)

@app.route('/ingredientes', methods=['POST'])
def create_ingrediente():
    data = request.get_json()
    ingrediente = Ingrediente(nome=data['nome'])
    db.session.add(ingrediente)
    db.session.commit()
    return jsonify({'message': 'Ingrediente created successfully'}), 201

@app.route('/ingredientes', methods=['GET'])
def get_ingredientes():
    ingredientes = Ingrediente.query.all()
    result = []
    for ingrediente in ingredientes:
        result.append({
            'id': ingrediente.id,
            'nome': ingrediente.nome
        })
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
