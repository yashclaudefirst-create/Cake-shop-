import { CakeSlot, Order } from '../types';

export const SQL_SCHEMA_DDL = `-- 1. Cake Slots Table (Run in PostgreSQL, Cloud SQL, MySQL, or SQLite)
CREATE TABLE IF NOT EXISTS cake_slots (
    id VARCHAR(64) PRIMARY KEY,
    slot_date DATE NOT NULL,
    time_window VARCHAR(64) NOT NULL,
    title VARCHAR(128) NOT NULL,
    max_capacity INT NOT NULL DEFAULT 4,
    booked_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Orders Table Linked to Cake Slots
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    slot_id VARCHAR(64) REFERENCES cake_slots(id) ON DELETE SET NULL,
    customer_name VARCHAR(128) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    cake_flavor VARCHAR(128) NOT NULL,
    cake_size VARCHAR(64) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Received',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

export function generateSlotInsertSQL(slot: CakeSlot): string {
  const safeNotes = slot.notes ? `'${slot.notes.replace(/'/g, "''")}'` : 'NULL';
  return `INSERT INTO cake_slots (id, slot_date, time_window, title, max_capacity, booked_count, is_active, notes)
VALUES ('${slot.id}', '${slot.date}', '${slot.timeWindow}', '${slot.title.replace(/'/g, "''")}', ${slot.maxCapacity}, ${slot.bookedCount}, ${slot.isActive ? 'TRUE' : 'FALSE'}, ${safeNotes});`;
}

export function generateAllSlotsSQL(slots: CakeSlot[]): string {
  if (slots.length === 0) return '-- No slots available to export';
  return slots.map(generateSlotInsertSQL).join('\n\n');
}

export function generateSlotBookingSQL(slotId: string, order: Order): string {
  return `-- 1. Increment booked count in cake_slots
UPDATE cake_slots 
SET booked_count = booked_count + 1 
WHERE id = '${slotId}';

-- 2. Insert order record
INSERT INTO orders (id, slot_id, customer_name, customer_phone, cake_flavor, cake_size, total_price, status)
VALUES ('${order.id}', '${slotId}', '${order.customer.name.replace(/'/g, "''")}', '${order.customer.phone}', '${order.customization.baseFlavor.replace(/'/g, "''")}', '${order.customization.size.replace(/'/g, "''")}', ${order.totalPrice}, 'Received');`;
}
