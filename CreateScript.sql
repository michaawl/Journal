-- ############## Create Users ##############
CREATE TABLE dbo.Users (
    user_id BIGINT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    username VARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt BINARY(16) NOT NULL,
    created_at DATETIME2(7) NOT NULL
);

-- ############## Create JournalEntries ##############
CREATE TABLE dbo.JournalEntries (
    entry_id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    user_id BIGINT NOT NULL,
    entry_date DATE NOT NULL,
    entry_title VARCHAR(255) NOT NULL,
    entry_content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
);

-- ############## Create ReflectionQuestions ##############
CREATE TABLE dbo.ReflectionQuestions (
    question_id BIGINT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    user_id BIGINT NOT NULL,
    question_text NVARCHAR(500) NOT NULL,
    schedule_type NVARCHAR(50) NOT NULL,
    schedule_value DATE NULL,
    active BIT NOT NULL DEFAULT 1,
);

-- ############## Create ReflectionAnswers ##############
CREATE TABLE dbo.ReflectionAnswers (
    answer_id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    question_id INT NOT NULL,
    user_id INT NOT NULL,
    answer_content NVARCHAR(MAX) NOT NULL,
    answer_date DATETIME NOT NULL,
    is_completed BIT NOT NULL,
);


-- ############## Insert local user ##############
INSERT INTO dbo.Users (username, email, password_hash, salt, created_at)
VALUES ('local', 'localhost', 'nohash', 0x123456789, SYSDATETIME());