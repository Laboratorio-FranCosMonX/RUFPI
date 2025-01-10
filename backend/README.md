# RUFPI Backend API

Esta é uma API em Flask simples que fornece endpoints para gerenciar os dados do sistema RUFPI.

## Configuração Inicial

### Requisitos
- Python 3.8 ou superior
- Flask
- Flask-SQLAlchemy

### Instalação
1. Instale as dependências:
   ```bash
   pip install flask
   pip install flask-sqlalchemy
   ```

2. Inicie o servidor:
   ```bash
   python app.py
   ```

## Endpoints

### 1. Tipos

#### Criar um Tipo
- **URL**: `/tipos`
- **Método**: `POST`
- **Corpo da requisição**:
  ```json
  {
      "tipo": "string",
      "descricao": "string"
  }
  ```
- **Resposta**:
  ```json
  {
      "message": "Tipo created successfully"
  }
  ```

### 2. Usuários

#### Obter Usuários
- **URL**: `/usuarios`
- **Método**: `GET`
- **Resposta**:
  ```json
  [
      {
          "id": 1,
          "matricula_siapi": 12345,
          "nome": "Nome",
          "email": "email@example.com",
          "cpf": 12345678900,
          "senha": "hashed_password",
          "tipo": "Tipo",
          "is_nutricionista": false,
          "created_at": "2025-01-01T00:00:00",
          "updated_at": "2025-01-01T00:00:00"
      }
  ]
  ```

#### **Obter Usuário por ID**
- **URL:** `/usuarios/<int:id>`
- **Método:** `GET`
- **Resposta:**
  ```json
  {
    "id": 1,
    "matricula_siapi": 123456,
    "nome": "João Silva",
    "email": "joao.silva@exemplo.com",
    "cpf": 987654321,
    "senha": "senha_hash",
    "tipo": "Administrador",
    "is_nutricionista": false,
    "created_at": "2025-01-10T12:00:00",
    "updated_at": "2025-01-10T12:00:00"
  }

#### Criar um Usuário
- **URL**: `/usuarios`
- **Método**: `POST`
- **Corpo da requisição**:
  ```json
  {
      "matricula_siapi": 12345,
      "nome": "Nome",
      "email": "email@example.com",
      "cpf": 12345678900,
      "senha": "senha123",
      "tipo": "Tipo",
      "is_nutricionista": false
  }
  ```
- **Resposta**:
  ```json
  {
      "message": "Usuario created successfully"
  }
  ```

#### Adicionar Fichas
- **URL**: `/usuario/<id>/add_fichas`
- **Método**: `POST`
- **Corpo da requisição**:
  ```json
  {
      "fichas": 10
  }
  ```
- **Resposta**:
  ```json
  {
      "message": "Added 10 fichas to user 1",
      "fichas": 10
  }
  ```

#### Debitar Fichas
- **URL**: `/usuario/<id>/deduct_fichas`
- **Método**: `POST`
- **Corpo da requisição**:
  ```json
  {
      "fichas": 5
  }
  ```
- **Resposta**:
  ```json
  {
      "message": "Deducted 5 fichas from user 1",
      "fichas": 5
  }
  ```