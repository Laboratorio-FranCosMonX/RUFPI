from flask import Blueprint, request, jsonify
from models import Tipo, db

tipo_bp = Blueprint('tipo', __name__)

@tipo_bp.route('/tipos/create', methods=['POST'])
def create_tipo():
    data = request.get_json()
    nome = Tipo(nome=data['nome'], descricao=data['descricao'])
    db.session.add(nome)
    db.session.commit()
    return jsonify({'message': 'Tipo created successfully'}), 201

@tipo_bp.route('/tipos/all', methods=['GET'])
def get_all_tipos():
    tipos = Tipo.query.all()
    if not tipos:
        return jsonify({'error': 'No tipos found'}), 404
    return jsonify([{
        'id': tipo.id,
        'nome': tipo.nome,
        'descricao': tipo.descricao
    } for tipo in tipos]), 200

@tipo_bp.route('/tipos/id/<int:id>', methods=['GET'])
def get_tipo_by_id(id):
    tipo = Tipo.query.get_or_404(id)
    return jsonify({
        'id': tipo.id,
        'nome': tipo.nome,
        'descricao': tipo.descricao
    }), 200

@tipo_bp.route('/tipos/nome/<string:nome>', methods=['GET'])
def get_tipo_by_nome(nome):
    tipo = Tipo.query.filter_by(nome=nome).first()
    if not tipo:
        return jsonify({'error': 'Tipo not found'}), 404
    return jsonify({
        'id': tipo.id,
        'tipo': tipo.nome,
        'descricao': tipo.descricao
    }), 200