-- Add missing columns to tasks table if they don't exist
DO $$
BEGIN
    -- Check if priority column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tasks' AND column_name = 'priority') THEN
        ALTER TABLE tasks ADD COLUMN priority varchar NOT NULL 
        CHECK (priority in ('low', 'medium', 'high')) DEFAULT 'medium';
    END IF;

    -- Check if status column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tasks' AND column_name = 'status') THEN
        ALTER TABLE tasks ADD COLUMN status varchar NOT NULL 
        CHECK (status in ('todo', 'in_progress', 'completed')) DEFAULT 'todo';
    END IF;

    -- Check if due_date column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tasks' AND column_name = 'due_date') THEN
        ALTER TABLE tasks ADD COLUMN due_date timestamptz NULL;
    END IF;
    
    -- Check if team_id column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tasks' AND column_name = 'team_id') THEN
        ALTER TABLE tasks ADD COLUMN team_id uuid NULL;
    END IF;
END $$; 