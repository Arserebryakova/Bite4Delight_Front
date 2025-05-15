-- Создание таблицы reviews в базе PostgreSQL

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    place TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 0 AND 10),
    status TEXT NOT NULL DEFAULT 'На модерации',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
