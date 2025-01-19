from flask import Blueprint, request, jsonify
from models import Usuario, Tipo, db

usuario_bp = Blueprint('usuario', __name__)

@usuario_bp.route('/usuarios/create', methods=['POST'])
def create_usuario():
    data = request.get_json()
    tipo = Tipo.query.filter_by(id=data['tipo_id']).first()
    if not tipo:
        return jsonify({'message': 'Tipo not found'}), 400
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

@usuario_bp.route('/usuarios/update', methods=['PUT'])
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
            return jsonify({'message': 'Tipo not found'}), 400
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

@usuario_bp.route('/usuarios/all', methods=['GET'])
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

@usuario_bp.route('/usuarios/<int:id>', methods=['GET'])
def get_usuario_by_id(id):
    usuario = Usuario.query.get_or_404(id)
    tipo = Tipo.query.get_or_404(usuario.tipo_id)
    return jsonify({
        'id': usuario.id,
        'matricula_siapi': usuario.matricula_siapi,
        'nome': usuario.nome,
        'email': usuario.email,
        'cpf': usuario.cpf,
        'senha': usuario.senha,
        'tipo': {
            'id': tipo.id,
            'nome': tipo.nome,
            'descricao': tipo.descricao
        },
        'is_nutricionista': usuario.is_nutricionista,
        'created_at': usuario.created_at,
        'updated_at': usuario.updated_at
    })

@usuario_bp.route('/usuarios/matricula', methods=['GET'])
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

@usuario_bp.route('/usuarios/tipo', methods=['GET'])
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
    
@usuario_bp.route('/usuario/add_fichas', methods=['POST'])
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

@usuario_bp.route('/usuario/deduct_fichas', methods=['POST'])
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
