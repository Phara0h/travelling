  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS updated_on timestamp with time zone default current_timestamp