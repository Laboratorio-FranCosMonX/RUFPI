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

class Cardapio(db.Model):
    __tablename__ = 'cardapios'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    data = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Refeicao(db.Model):
    __tablename__ = 'refeicoes'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipo = db.Column(db.String(100), nullable=False)
    anotacao = db.Column(db.String(255), nullable=False)

class Prato(db.Model):
    __tablename__ = 'pratos'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    preferencia_alimentar = db.Column(db.String(100), nullable=False)

class Ingrediente(db.Model):
    __tablename__ = 'ingredientes'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(100), nullable=False)
