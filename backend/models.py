from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Tipo(db.Model):
    __tablename__ = 'tipos'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(50), nullable=False)
    descricao = db.Column(db.String(255))

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    matricula_siapi = db.Column(db.Integer, unique=True, nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    cpf = db.Column(db.Integer, unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)
    tipo_id = db.Column(db.Integer, db.ForeignKey('tipos.id'), nullable=False)
    is_nutricionista = db.Column(db.Boolean, default=False)
    fichas = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tipo = db.relationship('Tipo', backref='usuarios')
    cardapios = db.relationship('Cardapio', secondary='usuario_cardapio', back_populates='usuarios')

class UsuarioCardapio(db.Model):
    __tablename__ = 'usuario_cardapio'
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), primary_key=True)
    cardapio_id = db.Column(db.Integer, db.ForeignKey('cardapios.id'), primary_key=True)

class Cardapio(db.Model):
    __tablename__ = 'cardapios'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    data = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    usuarios = db.relationship('Usuario', secondary='usuario_cardapio', back_populates='cardapios')
    refeicoes = db.relationship('Refeicao', secondary='cardapio_refeicao', back_populates='cardapios')

class CardapioRefeicao(db.Model):
    __tablename__ = 'cardapio_refeicao'
    cardapio_id = db.Column(db.Integer, db.ForeignKey('cardapios.id'), primary_key=True)
    refeicao_id = db.Column(db.Integer, db.ForeignKey('refeicoes.id'), primary_key=True)

class Refeicao(db.Model):
    __tablename__ = 'refeicoes'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipo = db.Column(db.String(100), nullable=False)
    anotacao = db.Column(db.String(255), nullable=False)

    cardapios = db.relationship('Cardapio', secondary='cardapio_refeicao', back_populates='refeicoes')
    pratos = db.relationship('Prato', secondary='refeicao_prato', back_populates='refeicoes')

class RefeicaoPrato(db.Model):
    __tablename__ = 'refeicao_prato'
    refeicao_id = db.Column(db.Integer, db.ForeignKey('refeicoes.id'), primary_key=True)
    prato_id = db.Column(db.Integer, db.ForeignKey('pratos.id'), primary_key=True)

class Prato(db.Model):
    __tablename__ = 'pratos'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    preferencia_alimentar = db.Column(db.String(100), nullable=False)

    refeicoes = db.relationship('Refeicao', secondary='refeicao_prato', back_populates='pratos')
    ingredientes = db.relationship('Ingrediente', secondary='prato_ingrediente', back_populates='pratos')

class PratoIngrediente(db.Model):
    __tablename__ = 'prato_ingrediente'
    prato_id = db.Column(db.Integer, db.ForeignKey('pratos.id'), primary_key=True)
    ingrediente_id = db.Column(db.Integer, db.ForeignKey('ingredientes.id'), primary_key=True)

class Ingrediente(db.Model):
    __tablename__ = 'ingredientes'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(100), nullable=False)

    pratos = db.relationship('Prato', secondary='prato_ingrediente', back_populates='ingredientes')
