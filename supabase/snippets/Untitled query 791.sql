GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.roles TO anon, authenticated;
NOTIFY pgrst, 'reload schema';