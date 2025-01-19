from flask import Blueprint, request, jsonify, session
from models import Usuario
from werkzeug.security import check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Usuario.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.senha, data['senha']):
        session['user_id'] = user.id
        session['is_nutricionista'] = user.is_nutricionista
        return jsonify({
            'message': 'Login successful',
            'id': user.id,
            'nome': user.nome
        }), 200
    return jsonify({'error': 'Invalid credentials'}), 400

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'User logged out successfully'}), 200