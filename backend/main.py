from fastapi import FastAPI
import psycopg2
import os

app = FastAPI()

# Exemplo de conexão com PostgreSQL
DATABASE_URL = os.getenv(
    'DATABASE_URL', 'postgresql://usuario:senha@localhost:5432/seubanco')


@app.get('/')
def read_root():
    return {"message": "Backend FastAPI rodando!"}


@app.get('/db-status')
def db_status():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.close()
        return {"status": "Conexão com PostgreSQL bem-sucedida!"}
    except Exception as e:
        return {"status": f"Erro ao conectar: {e}"}
