-- Migration นี้ใช้สำหรับ local dev เท่านั้น
-- ปิด RLS ทุกตารางเพื่อให้ sb_secret_ key ดึงข้อมูลได้
-- ห้าม push ขึ้น production

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY;';
  END LOOP;
END $$;