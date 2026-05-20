import sqlite3, json, os, sys

def main():
    db_path = os.path.join(os.path.dirname(__file__), 'codegraph.db')
    if not os.path.exists(db_path):
        print(f'Database not found at {db_path}')
        sys.exit(1)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    # Get list of tables
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cur.fetchall()]
    summary = {}
    for table in tables:
        cur.execute(f'PRAGMA table_info({table});')
        cols = [col[1] for col in cur.fetchall()]  # column names
        cur.execute(f'SELECT * FROM {table};')
        rows = cur.fetchall()
        summary[table] = {
            'columns': cols,
            'row_count': len(rows),
            'sample': rows[:5]
        }
    # Simple overview: assume typical tables like nodes, edges, symbols
    print('=== Codegraph Summary ===')
    for tbl, info in summary.items():
        print(f"Table '{tbl}': {info['row_count']} rows, columns: {', '.join(info['columns'])}")
    print('\nSample data (first 5 rows each):')
    for tbl, info in summary.items():
        print(f"\n-- {tbl} --")
        for row in info['sample']:
            print(row)
    conn.close()

if __name__ == '__main__':
    main()
