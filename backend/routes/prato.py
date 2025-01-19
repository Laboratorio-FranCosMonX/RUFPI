from flask import Blueprint, request, jsonify
from models import Prato, Ingrediente, db

prato_bp = Blueprint('prato', __name__)

@prato_bp.route('/pratos/create', methods=['POST'])
def create_prato():
    data = request.get_json()
    
    if not data.get('preferencia_alimentar') or not isinstance(data['preferencia_alimentar'], str):
        return jsonify({'error': 'Preferência alimentar inválida'}), 400
    
    if not data.get('ingredientes') or not isinstance(data['ingredientes'], list):
        return jsonify({'error': 'Ingredientes devem ser uma lista de IDs'}), 400

    ingredientes = Ingrediente.query.filter(Ingrediente.id.in_(data['ingredientes'])).all()

    if len(ingredientes) != len(data['ingredientes']):
        return jsonify({'error': 'Alguns ingredientes não foram encontrados'}), 400

    prato = Prato(preferencia_alimentar=data['preferencia_alimentar'])

    prato.ingredientes.extend(ingredientes)

    db.session.add(prato)
    db.session.commit()

    return jsonify({
        'message': 'Prato criado com sucesso',
        'prato': {
            'id': prato.id,
            'preferencia_alimentar': prato.preferencia_alimentar,
            'ingredientes': [{'id': ingrediente.id, 'nome': ingrediente.nome} for ingrediente in prato.ingredientes]
        }
    }), 201

@prato_bp.route('/pratos/all', methods=['GET'])
def get_pratos():
    pratos = Prato.query.order_by(Prato.nome).all()
    result = []
    for prato in pratos:
        result.append({
            'id': prato.id,
            'nome': prato.nome,
            'created_at': prato.created_at,
            'updated_at': prato.updated_at
        })
    return jsonify(result)