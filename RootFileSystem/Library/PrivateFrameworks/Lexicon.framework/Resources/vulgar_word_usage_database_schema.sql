CREATE TABLE IF NOT EXISTS properties (
    ROWID INTEGER PRIMARY KEY,
    key,
    value,
    UNIQUE (key)
);

CREATE TABLE IF NOT EXISTS vword_usage (
    ROWID INTEGER PRIMARY KEY AUTOINCREMENT,
    app                          TEXT, -- app identifier
    recipient                    TEXT, -- recipient identifier
    vword                        TEXT, -- vulgar word
    word_reading                 TEXT, -- the reading form of a word (relevant for Japanese)
    usage_count                  INTEGER DEFAULT 0,

    journaled
);

CREATE TABLE IF NOT EXISTS new_vword_usage (
    ROWID INTEGER PRIMARY KEY AUTOINCREMENT,
    app                          TEXT, -- app identifier
    recipient                    TEXT, -- recipient identifier
    vword                        TEXT, -- vulgar word
    word_reading                 TEXT, -- the reading form of a word (relevant for Japanese)
    usage_count                  INTEGER DEFAULT 0,
    last_use_timestamp           REAL DEFAULT 0, -- last use timestamp (seconds since the reference date)

    journaled
);

INSERT INTO new_vword_usage (app, recipient, vword, word_reading, usage_count) SELECT app, recipient, vword, word_reading, usage_count FROM vword_usage;

DROP TABLE vword_usage;

ALTER TABLE new_vword_usage RENAME TO vword_usage;

CREATE UNIQUE INDEX app_recipient_vword_word_reading_idx ON vword_usage(app, recipient, vword, word_reading);
