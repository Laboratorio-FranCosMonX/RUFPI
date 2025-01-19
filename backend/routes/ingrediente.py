from flask import Blueprint, request, jsonify
from models import Ingrediente, db

ingrediente_bp = Blueprint('ingrediente', __name__)

@ingrediente_bp.route('/ingredientes/create', methods=['POST'])
def create_ingrediente():
    data = request.get_json()
    ingrediente = Ingrediente(nome=data['nome'])
    db.session.add(ingrediente)
    db.session.commit()
    return jsonify({'message': 'Ingrediente created successfully'}), 201

@ingrediente_bp.route('/ingredientes/all', methods=['GET'])
def get_ingredientes():
    ingredientes = Ingrediente.query.order_by(Ingrediente.nome).all()
    result = []
    for ingrediente in ingredientes:
        result.append({
            'id': ingrediente.id,
            'nome': ingrediente.nome
        })
    return jsonify(result)