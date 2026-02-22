"""
RAG Messenger — авторизация: регистрация, вход, выход, профиль.
"""
import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p2751751_quantum_rush')
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
}

COLORS = ['#5865f2', '#57f287', '#faa61a', '#ed4245', '#9b59b6', '#1abc9c', '#e67e22', '#3498db']


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_user_by_token(cur, token: str):
    cur.execute(
        f"SELECT u.id, u.username, u.display_name, u.avatar_color, u.avatar_letter, u.is_admin, u.is_online "
        f"FROM {SCHEMA}.sessions s JOIN {SCHEMA}.users u ON s.user_id = u.id "
        f"WHERE s.token = %s AND s.expires_at > NOW()",
        (token,)
    )
    row = cur.fetchone()
    if not row:
        return None
    return {'id': row[0], 'username': row[1], 'display_name': row[2],
            'avatar_color': row[3], 'avatar_letter': row[4], 'is_admin': row[5], 'is_online': row[6]}


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    token = event.get('headers', {}).get('X-Session-Token', '')
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    conn = get_conn()
    cur = conn.cursor()

    try:
        # POST /register
        if method == 'POST' and '/register' in path:
            username = (body.get('username') or '').strip().lstrip('@').lower()
            display_name = body.get('display_name') or username
            phone = body.get('phone') or None
            email = (body.get('email') or '').strip().lower() or None
            password = body.get('password') or ''

            if not username or not password:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'username и password обязательны'})}
            if len(password) < 6:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Пароль минимум 6 символов'})}

            letter = username[0].upper()
            color = COLORS[sum(ord(c) for c in username) % len(COLORS)]
            pwd_hash = hash_password(password)

            cur.execute(
                f"INSERT INTO {SCHEMA}.users (username, display_name, phone, email, password_hash, avatar_color, avatar_letter) "
                f"VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (username, display_name, phone, email, pwd_hash, color, letter)
            )
            user_id = cur.fetchone()[0]

            # seed channels if first user
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.channels")
            if cur.fetchone()[0] == 0:
                for ch in [('общий', 'general', 'Общий канал'), ('новости', 'news', 'Новости RAG'),
                           ('медиа', 'media', 'Фото и видео'), ('связь-с-админом', 'admin', 'Связь с администратором')]:
                    cur.execute(f"INSERT INTO {SCHEMA}.channels (name, slug, description, created_by) VALUES (%s, %s, %s, %s)", (*ch, user_id))

            token_val = secrets.token_hex(32)
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)", (user_id, token_val))
            conn.commit()

            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
                'token': token_val,
                'user': {'id': user_id, 'username': username, 'display_name': display_name,
                         'avatar_color': color, 'avatar_letter': letter, 'is_admin': False}
            })}

        # POST /login
        if method == 'POST' and '/login' in path:
            login = (body.get('login') or '').strip().lower().lstrip('@')
            password = body.get('password') or ''
            pwd_hash = hash_password(password)

            cur.execute(
                f"SELECT id, username, display_name, avatar_color, avatar_letter, is_admin FROM {SCHEMA}.users "
                f"WHERE (username = %s OR phone = %s OR email = %s) AND password_hash = %s",
                (login, login, login, pwd_hash)
            )
            row = cur.fetchone()
            if not row:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Неверный логин или пароль'})}

            user_id, username, display_name, color, letter, is_admin = row
            token_val = secrets.token_hex(32)
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)", (user_id, token_val))
            cur.execute(f"UPDATE {SCHEMA}.users SET is_online = TRUE WHERE id = %s", (user_id,))
            conn.commit()

            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({
                'token': token_val,
                'user': {'id': user_id, 'username': username, 'display_name': display_name,
                         'avatar_color': color, 'avatar_letter': letter, 'is_admin': is_admin}
            })}

        # POST /logout
        if method == 'POST' and '/logout' in path:
            if token:
                cur.execute(f"SELECT user_id FROM {SCHEMA}.sessions WHERE token = %s", (token,))
                row = cur.fetchone()
                if row:
                    cur.execute(f"UPDATE {SCHEMA}.users SET is_online = FALSE WHERE id = %s", (row[0],))
                cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at = NOW() WHERE token = %s", (token,))
                conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        # GET /me
        if method == 'GET' and '/me' in path:
            user = get_user_by_token(cur, token)
            if not user:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'user': user})}

        # GET /users - список онлайн
        if method == 'GET' and '/users' in path:
            cur.execute(f"SELECT id, username, display_name, avatar_color, avatar_letter, is_admin, is_online FROM {SCHEMA}.users ORDER BY is_online DESC, created_at LIMIT 50")
            rows = cur.fetchall()
            users = [{'id': r[0], 'username': r[1], 'display_name': r[2], 'avatar_color': r[3],
                      'avatar_letter': r[4], 'is_admin': r[5], 'is_online': r[6]} for r in rows]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'users': users})}

        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}

    finally:
        cur.close()
        conn.close()
