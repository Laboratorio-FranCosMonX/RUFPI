# RUFPI Backend API

Esta é uma API em Flask simples que fornece endpoints para gerenciar os dados do sistema RUFPI.

## Configuração Inicial

### Requisitos
- Python 3.8 ou superior
- Flask
- Flask-SQLAlchemy
- Flask-CORS
- Werkzeug

### Setup
- (Assumindo que esteja na pasta raiz: RUFPI)
1. Crie o ambiente virtual:
   ```bash
   python -m venv venv
   ```

2. Ative o ambiente virtual:
   ```bash
   .\venv\Scripts\activate
   ```

3. Instale as dependências:
   ```bash
   pip install -r .\backend\requirements.txt
   ```

4. Inicie o servidor:
   ```bash
   python .\backend\app.py
   ```

### Quando terminar
1. Desative o servidor:
   ```bash
   CTRL+C
   ```

2. Desative o ambiente virtual:
   ```bash
   deactivate
   ```