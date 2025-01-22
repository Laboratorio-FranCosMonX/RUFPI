from flask import Blueprint, request, jsonify
from models import Usuario, Tipo, db
from utils import validate_cpf, validate_email
from werkzeug.security import generate_password_hash, check_password_hash

usuario_bp = Blueprint('usuario', __name__)

@usuario_bp.route('/usuarios/create', methods=['POST'])
def create_usuario():
    data = request.get_json()
    
    if not isinstance(data.get('matricula_siapi'), int):
        return jsonify({'error': 'Campo "matricula_siapi" deve ser um número inteiro'}), 400

    if not data.get('nome'):
        return jsonify({'error': 'Nome inválido'}), 400

    email = data.get('email')
    if not email or not validate_email(email):
        return jsonify({'error': 'Email inválido'}), 400
    existing_user = Usuario.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email já cadastrado'}), 400

    cpf = data.get('cpf')
    if not cpf or not validate_cpf(cpf):
        return jsonify({'error': 'CPF inválido'}), 400
    existing_user_cpf = Usuario.query.filter_by(cpf=cpf).first()
    if existing_user_cpf:
        return jsonify({'error': 'CPF já cadastrado'}), 400

    senha = data.get('senha')
    if not senha or len(senha) < 6:
        return jsonify({'error': 'Senha deve ter pelo menos 6 caracteres'}), 400

    tipo = Tipo.query.filter_by(id=data['tipo_id']).first()
    if not tipo:
        return jsonify({'message': 'Tipo inválido'}), 400

    is_nutricionista = data.get('is_nutricionista', False)
    if not isinstance(is_nutricionista, bool):
        return jsonify({'error': 'Campo "is_nutricionista" deve ser um valor booleano'}), 400

    usuario = Usuario(
        matricula_siapi=data['matricula_siapi'],
        nome=data['nome'],
        email=data['email'],
        cpf=data['cpf'],
        senha=generate_password_hash(data['senha']),
        tipo_id=tipo.id,
        is_nutricionista=data.get('is_nutricionista', False),
        fichas=0
    )

    db.session.add(usuario)
    db.session.commit()
    return jsonify({'message': 'Usuario criado com sucesso'}), 201

@usuario_bp.route('/usuarios/<int:id>/perfil', methods=['PATCH'])
def update_usuario_perfil(id):
    data = request.get_json()

    usuario = Usuario.query.get_or_404(id)

    if not data or ('nome' not in data and 'is_nutricionista' not in data):
        return jsonify({'error': 'É necessário preencher ao menos um dos campos: nome ou is_nutricionista'}), 400

    if 'nome' in data:
        nome = data.get('nome')
        if not nome or not isinstance(nome, str):
            return jsonify({'error': 'Nome inválido'}), 400
        usuario.nome = nome

    if 'is_nutricionista' in data:
        is_nutricionista = data.get('is_nutricionista')
        if not isinstance(is_nutricionista, bool):
            return jsonify({'error': 'Campo "is_nutricionista" deve ser um valor booleano'}), 400
        usuario.is_nutricionista = is_nutricionista

    db.session.commit()

    return jsonify({
        'message': 'Perfil do usuário atualizado com sucesso',
        'usuario': {
            'id': usuario.id,
            'nome': usuario.nome,
            'is_nutricionista': usuario.is_nutricionista
        }
    }), 200

@usuario_bp.route('/usuario/<int:id>/password', methods=['PATCH'])
def update_password(id):
    data = request.get_json()

    if not data or 'senha_atual' not in data or 'nova_senha' not in data:
        return jsonify({'error': 'Campos "senha_atual" e "nova_senha" são obrigatórios'}), 400

    senha_atual = data['senha_atual']
    nova_senha = data['nova_senha']

    if senha_atual == nova_senha:
        return jsonify({'error': 'A nova senha deve ser diferente da senha atual'}), 400

    usuario = Usuario.query.get(id)
    if not usuario:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    if not check_password_hash(usuario.senha, senha_atual):
        return jsonify({'error': 'A senha atual está incorreta'}), 403

    usuario.senha = generate_password_hash(nova_senha)
    db.session.commit()

    return jsonify({'message': 'Senha atualizada com sucesso'}), 200

@usuario_bp.route('/usuarios/update', methods=['PUT'])
def update_usuario():
    data = request.get_json()
    if 'id' not in data:
        return jsonify({'error': 'É necessário informar o ID do usuário a ser alterado'}), 400
    usuario = Usuario.query.get_or_404(data['id'])

    if 'matricula_siapi' in data:
        if not isinstance(data['matricula_siapi'], int):
            return jsonify({'error': 'Campo "matricula_siapi" deve ser um número inteiro'}), 400
        usuario.matricula_siapi = data['matricula_siapi']

    if 'nome' in data:
        if not data['nome']:
            return jsonify({'error': 'Nome inválido'}), 400
        usuario.nome = data['nome']

    if 'email' in data:
        email = data['email']
        if not email or not validate_email(email):
            return jsonify({'error': 'Email inválido'}), 400
        existing_user = Usuario.query.filter_by(email=email).first()
        if existing_user and existing_user.id != usuario.id:
            return jsonify({'error': 'Email já cadastrado'}), 400
        usuario.email = email

    if 'cpf' in data:
        cpf = data['cpf']
        if not cpf or not validate_cpf(cpf):
            return jsonify({'error': 'CPF inválido'}), 400
        existing_user_cpf = Usuario.query.filter_by(cpf=cpf).first()
        if existing_user_cpf and existing_user_cpf.id != usuario.id:
            return jsonify({'error': 'CPF já cadastrado'}), 400
        usuario.cpf = cpf

    if 'senha' in data:
        senha = data['senha']
        if not senha or len(senha) < 6:
            return jsonify({'error': 'Senha deve ter pelo menos 6 caracteres'}), 400
        usuario.senha = generate_password_hash(senha)

    if 'tipo_id' in data:
        tipo = Tipo.query.filter_by(id=data['tipo_id']).first()
        if not tipo:
            return jsonify({'error': 'Tipo inválido'}), 400
        usuario.tipo_id = data['tipo_id']

    if 'is_nutricionista' in data:
        is_nutricionista = data['is_nutricionista']
        if not isinstance(is_nutricionista, bool):
            return jsonify({'error': 'Campo "is_nutricionista" deve ser um valor booleano'}), 400
        usuario.is_nutricionista = is_nutricionista

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
