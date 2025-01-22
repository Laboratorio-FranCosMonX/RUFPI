from flask import Blueprint, request, jsonify
from models import Refeicao, Prato, db

refeicao_bp = Blueprint('refeicao', __name__)

@refeicao_bp.route('/refeicoes/create', methods=['POST'])
def create_refeicao():
    data = request.get_json()

    if not data.get('tipo') or not isinstance(data['tipo'], str):
        return jsonify({'error': 'Tipo inválido'}), 400

    if not data.get('anotacao') or not isinstance(data['anotacao'], str):
        return jsonify({'error': 'Anotação inválida'}), 400

    if not data.get('pratos') or not isinstance(data['pratos'], list):
        return jsonify({'error': 'Campo "pratos" deve ser uma lista de IDs'}), 400

    pratos = Prato.query.filter(Prato.id.in_(data['pratos'])).all()

    if len(pratos) != len(data['pratos']):
        return jsonify({'error': 'Alguns pratos não foram encontrados'}), 400

    refeicao = Refeicao(tipo=data['tipo'], anotacao=data['anotacao'])
    refeicao.pratos.extend(pratos)

    db.session.add(refeicao)
    db.session.commit()

    return jsonify({
        'message': 'Refeição criada com sucesso',
        'refeicao': {
            'id': refeicao.id,
            'tipo': refeicao.tipo,
            'anotacao': refeicao.anotacao,
            'pratos': [
                {
                    'id': prato.id,
                    'preferencia_alimentar': prato.preferencia_alimentar,
                    'ingredientes': [
                        {'id': ingrediente.id, 'nome': ingrediente.nome} for ingrediente in prato.ingredientes
                    ]
                } for prato in refeicao.pratos
            ]
        }
    }), 201

@refeicao_bp.route('/refeicoes/all', methods=['GET'])
def get_refeicoes():
    refeicoes = Refeicao.query.all()
    result = []

    for refeicao in refeicoes:
        result.append({
            'id': refeicao.id,
            'tipo': refeicao.tipo,
            'anotacao': refeicao.anotacao,
            'pratos': [
                {
                    'id': prato.id,
                    'preferencia_alimentar': prato.preferencia_alimentar,
                    'ingredientes': [
                        {'id': ingrediente.id, 'nome': ingrediente.nome} for ingrediente in prato.ingredientes
                    ]
                } for prato in refeicao.pratos
            ]
        })

    return jsonify(result), 200


@refeicao_bp.route('/refeicoes/id', methods=['GET'])
def get_refeicao_by_id():
    data = request.get_json()

    if not data or 'id' not in data:
        return jsonify({'error': 'Entrada inválida'}), 400

    refeicao = Refeicao.query.get(data['id'])
    if not refeicao:
        return jsonify({'error': 'Refeição não encontrada'}), 404

    return jsonify({
        'id': refeicao.id,
        'tipo': refeicao.tipo,
        'anotacao': refeicao.anotacao,
        'pratos': [
            {
                'id': prato.id,
                'preferencia_alimentar': prato.preferencia_alimentar,
                'ingredientes': [
                    {'id': ingrediente.id, 'nome': ingrediente.nome} for ingrediente in prato.ingredientes
                ]
            } for prato in refeicao.pratos
        ]
    }), 200