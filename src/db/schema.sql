-- ========================================================
-- Krish Dreamy Delight - Database Schema (SQL-Ready)
-- Compatible with PostgreSQL, MySQL, and SQLite
-- ========================================================

-- 1. Cake Slots Table (For Managing Daily/Weekly Baking Capacities)
CREATE TABLE IF NOT EXISTS cake_slots (
    id VARCHAR(64) PRIMARY KEY,
    slot_date DATE NOT NULL,
    time_window VARCHAR(64) NOT NULL, -- e.g. '10:00 AM - 01:00 PM'
    title VARCHAR(128) NOT NULL,      -- e.g. 'Morning Fresh Bake Slot'
    max_capacity INT NOT NULL DEFAULT 4, -- Maximum cakes kitchen can bake
    booked_count INT NOT NULL DEFAULT 0, -- Current confirmed orders
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for speedy queries on upcoming slots
CREATE INDEX IF NOT EXISTS idx_cake_slots_date ON cake_slots(slot_date);
CREATE INDEX IF NOT EXISTS idx_cake_slots_active ON cake_slots(is_active);

-- 2. Orders Table (Linked to Cake Slots)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    slot_id VARCHAR(64) REFERENCES cake_slots(id) ON DELETE SET NULL,
    customer_name VARCHAR(128) NOT NULL,
    customer_email VARCHAR(128),
    customer_phone VARCHAR(32) NOT NULL,
    delivery_type VARCHAR(16) NOT NULL DEFAULT 'pickup', -- 'delivery' or 'pickup'
    delivery_address TEXT,
    cake_category VARCHAR(32) NOT NULL DEFAULT 'cake',
    cake_flavor VARCHAR(128) NOT NULL,
    cake_size VARCHAR(64) NOT NULL,
    cake_shape VARCHAR(64) DEFAULT 'Classic Round',
    dietary_pref VARCHAR(64) DEFAULT 'Standard',
    filling VARCHAR(64),
    sweetness VARCHAR(64),
    frosting VARCHAR(64),
    toppings TEXT[], -- Or JSON array in MySQL/SQLite
    message_on_cake VARCHAR(128),
    special_instructions TEXT,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Received', -- 'Received', 'Baking', 'Ready', 'Completed', 'Cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Customer Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    author VARCHAR(128) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    review_date DATE NOT NULL,
    cake_name VARCHAR(128),
    avatar_url TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Initial Seed Cake Slots
INSERT INTO cake_slots (id, slot_date, time_window, title, max_capacity, booked_count, is_active, notes)
VALUES 
    ('slot-2026-11-14-morning', '2026-11-14', '10:00 AM - 01:00 PM', 'Morning Fresh Bake Slot', 4, 1, TRUE, 'Fresh morning bake with organic dairy'),
    ('slot-2026-11-14-evening', '2026-11-14', '04:00 PM - 07:00 PM', 'Evening Celebration Slot', 5, 2, TRUE, 'Warm evening dispatch for parties'),
    ('slot-2026-11-15-morning', '2026-11-15', '10:00 AM - 01:00 PM', 'Sunday Morning Rush', 6, 2, TRUE, 'Weekend signature cakes'),
    ('slot-2026-11-15-evening', '2026-11-15', '04:00 PM - 07:00 PM', 'Sunday Evening Twilight', 4, 0, TRUE, 'Twilight batch for birthday celebrations')
ON CONFLICT (id) DO NOTHING;

-- 5. Useful Query Examples:

-- Query A: Get all active, available slots with remaining capacity
-- SELECT id, slot_date, time_window, title, (max_capacity - booked_count) AS remaining_capacity 
-- FROM cake_slots 
-- WHERE is_active = TRUE AND (max_capacity - booked_count) > 0 AND slot_date >= CURRENT_DATE
-- ORDER BY slot_date ASC, time_window ASC;

-- Query B: Book a new cake slot (atomically increment booked_count)
-- UPDATE cake_slots 
-- SET booked_count = booked_count + 1 
-- WHERE id = 'slot-2026-11-14-morning' AND booked_count < max_capacity;
