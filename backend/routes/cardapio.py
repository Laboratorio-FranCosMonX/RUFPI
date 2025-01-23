from flask import Blueprint, request, jsonify, session
from models import Cardapio, Refeicao, Tipo, Usuario, db
from datetime import datetime

cardapio_bp = Blueprint('cardapio', __name__)

@cardapio_bp.route('/cardapios/create', methods=['POST'])
def create_cardapio():
    data = request.get_json()

    user_id = data.get('user_id')
    if not user_id or not isinstance(user_id, int):
        return jsonify({'error': 'Campo "user_id" vazio ou inválido'}), 400
    user = Usuario.query.get_or_404(user_id)

    user_tipo = Tipo.query.get(user.tipo_id)
    if not user_tipo or user_tipo.nome != 'administrador':
        return jsonify({'message': 'Usuário não é administrador'}), 403
    
    if not data.get('data') or not isinstance(data['data'], str):
        return jsonify({'error': 'Data inválida'}), 400
    
    if not data.get('refeicoes') or not isinstance(data['refeicoes'], list):
        return jsonify({'error': 'Campo "refeicoes" deve ser uma lista de IDs'}), 400

    refeicoes = Refeicao.query.filter(Refeicao.id.in_(data['refeicoes'])).all()

    if len(refeicoes) != len(data['refeicoes']):
        return jsonify({'error': 'Algumas refeições não foram encontradas'}), 400

    cardapio = Cardapio(data=datetime.strptime(data['data'], '%d-%m-%Y').date())
    cardapio.refeicoes.extend(refeicoes)

    db.session.add(cardapio)
    db.session.commit()

    return jsonify({
        'message': 'Cardapio criado com sucesso',
        'cardapio': {
            'id': cardapio.id,
            'data': cardapio.data.strftime('%d-%m-%Y'),
            'createdAt': cardapio.created_at,
            'updatedAt': cardapio.updated_at,
            'refeicoes': [
                {
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
                } for refeicao in cardapio.refeicoes
            ]
        }
    }), 201


@cardapio_bp.route('/cardapios/all', methods=['GET'])
def get_cardapios():
    cardapios = Cardapio.query.order_by(Cardapio.updated_at).limit(10).all()
    result = []

    for cardapio in cardapios:
        result.append({
            'id': cardapio.id,
            'data': cardapio.data.strftime('%d-%m-%Y'),
            'createdAt': cardapio.created_at,
            'updatedAt': cardapio.updated_at,
            'refeicoes': [
                {
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
                } for refeicao in cardapio.refeicoes
            ]
        })

    return jsonify(result), 200