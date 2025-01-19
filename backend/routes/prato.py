from flask import Blueprint, request, jsonify
from models import Prato, db

prato_bp = Blueprint('prato', __name__)

@prato_bp.route('/pratos', methods=['POST'])
def create_prato():
    data = request.get_json()
    prato = Prato(nome=data['nome'])
    db.session.add(prato)
    db.session.commit()
    return jsonify({'message': 'Prato created successfully'}), 201

@prato_bp.route('/pratos', methods=['GET'])
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