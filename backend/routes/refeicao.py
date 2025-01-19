from flask import Blueprint, request, jsonify
from models import Refeicao, db

refeicao_bp = Blueprint('refeicao', __name__)

@refeicao_bp.route('/refeicoes/create', methods=['POST'])
def create_refeicao():
    data = request.get_json()
    if not data or 'tipo' not in data or 'anotacao' not in data:
        return jsonify({'error': 'Invalid input'}), 400

    new_refeicao = Refeicao(tipo=data['tipo'], anotacao=data['anotacao'])
    db.session.add(new_refeicao)
    db.session.commit()
    
    return jsonify({
        'message': 'Refeicao created successfully',
        'id': new_refeicao.id,
        'tipo': new_refeicao.tipo,
        'anotacao': new_refeicao.anotacao
    }), 201

@refeicao_bp.route('/refeicoes/all', methods=['GET'])
def get_refeicoes():
    refeicoes = Refeicao.query.all()
    result = []
    for refeicao in refeicoes:
        result.append({
            'id': refeicao.id,
            'tipo': refeicao.tipo,
            'anotacao': refeicao.anotacao
        })
    return jsonify(result), 200

@refeicao_bp.route('/refeicoes/id', methods=['GET'])
def get_refeicao_by_id():
    data = request.get_json()
    if not data or 'id' not in data:
        return jsonify({'error': 'Invalid input'}), 400

    refeicao = Refeicao.query.get(data['id'])
    if not refeicao:
        return jsonify({'error': 'Refeicao not found'}), 404

    return jsonify({
        'id': refeicao.id,
        'tipo': refeicao.tipo,
        'anotacao': refeicao.anotacao
    }), 200