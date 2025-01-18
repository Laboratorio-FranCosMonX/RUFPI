from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'chave-de-teste'
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
    nome = db.Column(db.String(50), nullable=False)
    descricao = db.Column(db.String(255))

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
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

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Usuario.query.filter_by(email=data['email']).first()
    if user and user.senha == data['senha']:
        session['user_id'] = user.id
        session['is_nutricionista'] = user.is_nutricionista
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'User logged out successfully'}), 200

@app.route('/usuarios/create', methods=['POST'])
def create_usuario():
    data = request.get_json()
    tipo = Tipo.query.filter_by(id=data['tipo_id']).first()
    if not tipo:
        return jsonify({'message': 'Tipo not found'}), 401
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

@app.route('/usuarios/update', methods=['PUT'])
def update_usuario():
    data = request.get_json()
    if 'id' not in data:
        return jsonify({'error': 'ID is required'}), 400
    usuario = Usuario.query.get_or_404(data['id'])

    if 'nome' in data:
        usuario.nome = data['nome']
    if 'email' in data:
        existing_user = Usuario.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != id:
            return jsonify({'error': 'Email já cadastrado'}), 400
        usuario.email = data['email']
    if 'cpf' in data:
        existing_user = Usuario.query.filter_by(cpf=data['cpf']).first()
        if existing_user and existing_user.id != id:
            return jsonify({'error': 'CPF já cadastrado'}), 400
        usuario.cpf = data['cpf']
    if 'senha' in data:
        usuario.senha = data['senha']
    if 'tipo_id' in data:
        tipo = Tipo.query.filter_by(id=data['tipo_id']).first()
        if not tipo:
            return jsonify({'message': 'Tipo not found'}), 401
        usuario.tipo_id = tipo.id
    if 'is_nutricionista' in data:
        usuario.is_nutricionista = data['is_nutricionista']
    if 'fichas' in data:
        try:
            usuario.fichas = int(data['fichas'])
        except ValueError:
            return jsonify({'error': 'Invalid fichas value'}), 400

    db.session.commit()
    return jsonify({
        'message': 'Usuario updated successfully',
        'usuario': {
            'id': usuario.id,
            'matricula_siapi': usuario.matricula_siapi,
            'nome': usuario.nome,
            'email': usuario.email,
            'cpf': usuario.cpf,
            'senha': usuario.senha,
            'tipo_id': usuario.tipo.id,
            'is_nutricionista': usuario.is_nutricionista,
            'fichas': usuario.fichas,
            'created_at': usuario.created_at,
            'updated_at': usuario.updated_at
        }
    }), 200

@app.route('/usuarios/all', methods=['GET'])
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
            'tipo_id': usuario.tipo_id,
            'is_nutricionista': usuario.is_nutricionista,
            'created_at': usuario.created_at,
            'updated_at': usuario.updated_at
        })
    return jsonify(result)

@app.route('/usuarios/id', methods=['GET'])
def get_usuario_by_id():
    data = request.get_json()
    usuario = Usuario.query.get_or_404(data['id'])
    return jsonify({
        'id': usuario.id,
        'matricula_siapi': usuario.matricula_siapi,
        'nome': usuario.nome,
        'email': usuario.email,
        'cpf': usuario.cpf,
        'senha': usuario.senha,
        'tipo_id': usuario.tipo_id,
        'is_nutricionista': usuario.is_nutricionista,
        'created_at': usuario.created_at,
        'updated_at': usuario.updated_at
    })

@app.route('/usuarios/matricula', methods=['GET'])
def get_usuario_by_matricula():
    data = request.get_json()
    usuario = Usuario.query.filter_by(matricula_siapi=data['matricula_siapi']).first()
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

@app.route('/usuarios/tipo', methods=['GET'])
def get_usuarios_by_tipo():
    data = request.get_json()
    usuarios = Usuario.query.filter_by(tipo_id=data['tipo_id']).all()
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

@app.route('/tipos/create', methods=['POST'])
def create_tipo():
    data = request.get_json()
    nome = Tipo(nome=data['nome'], descricao=data['descricao'])
    db.session.add(nome)
    db.session.commit()
    return jsonify({'message': 'Tipo created successfully'}), 201

@app.route('/tipos/id/<int:id>', methods=['GET'])
def get_tipo_by_id(id):
    tipo = Tipo.query.get_or_404(id)
    return jsonify({
        'id': tipo.id,
        'nome': tipo.nome,
        'descricao': tipo.descricao
    }), 200

@app.route('/tipos/nome/<string:nome>', methods=['GET'])
def get_tipo_by_nome(nome):
    tipo = Tipo.query.filter_by(nome=nome).first()
    if not tipo:
        return jsonify({'error': 'Tipo not found'}), 404
    return jsonify({
        'id': tipo.id,
        'tipo': tipo.nome,
        'descricao': tipo.descricao
    }), 200

@app.route('/usuario/add_fichas', methods=['POST'])
def add_fichas():
    data = request.get_json()
    user = Usuario.query.get(data['id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        fichas_to_add = int(request.json.get('fichas'))
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid fichas value'}), 400

    user.fichas += fichas_to_add
    db.session.commit()

    return jsonify({'message': f'Added {fichas_to_add} fichas to user {id}', 'fichas': user.fichas}), 200

@app.route('/usuario/deduct_fichas', methods=['POST'])
def deduct_fichas():
    data = request.get_json()
    user = Usuario.query.get(data['id'])
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
    if not session.get('is_nutricionista'):
        return jsonify({'message': 'User is not nutricionista'}), 403

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
