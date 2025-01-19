from flask import Blueprint, request, jsonify, session
from models import Cardapio, Refeicao, Prato, Ingrediente, db
from datetime import datetime

cardapio_bp = Blueprint('cardapio', __name__)

@cardapio_bp.route('/cardapios/create', methods=['POST'])
def create_cardapio():
    if not session.get('is_nutricionista'):
        return jsonify({'message': 'User is not nutricionista'}), 403

    data = request.get_json()

    if 'data' not in data:
        return jsonify({'error': 'Missing data field'}), 400
    
    cardapio = Cardapio(
        data=datetime.strptime(data['data'], '%d-%m-%Y').date()
    )
    db.session.add(cardapio)
    db.session.commit()
    return jsonify({'message': 'Cardapio created successfully'}), 201

@cardapio_bp.route('/cardapios/all', methods=['GET'])
def get_cardapios():
    cardapios = Cardapio.query.order_by(Cardapio.updated_at).limit(10).all()
    result = []
    for cardapio in cardapios:
        result.append({
            'id': cardapio.id,
            'data': cardapio.data,
            'created_at': cardapio.created_at,
            'updated_at': cardapio.updated_at
        })
    return jsonify(result)

""" 
@cardapio_bp.route('/cardapios/all', methods=['GET'])
def get_cardapios():
    cardapios = Cardapio.query.all()
    result = []
    for cardapio in cardapios:
        refeicoes = Refeicao.query.all()
        result_refeicoes = []
        for refeicao in refeicoes:
            pratos = Prato.query.all()
            result_pratos = []
            for prato in pratos:
                igredientes = Ingrediente.query.all()
                result_igredientes = []
                for igrediente in igredientes:
                    result_igredientes.append({
                        'id': igrediente.id,
                        'nome': igrediente.nome
                    })
                result_pratos.append(result_igredientes)
            result_refeicoes.append(result_pratos)
        result.append({
            'id': cardapio.id,
            'descricao': cardapio.descricao,
            'data': cardapio.data,
            'anotacao': cardapio.anotacao,
            'prato': result_refeicoes,
            'created_at': cardapio.created_at,
            'updated_at': cardapio.updated_at
        })
    return jsonify(result) """