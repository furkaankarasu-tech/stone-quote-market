-- Run once in the Supabase SQL Editor before accepting company documents.
-- Verification documents are private; only their owner may upload or read them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'mb-company-documents-private',
  'mb-company-documents-private',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "mb_company_document_owner_insert" on storage.objects;
create policy "mb_company_document_owner_insert"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'mb-company-documents-private'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and (storage.foldername(name))[2] in ('company-document', 'additional-document')
);

drop policy if exists "mb_company_document_owner_select" on storage.objects;
create policy "mb_company_document_owner_select"
on storage.objects for select to authenticated
using (
  bucket_id = 'mb-company-documents-private'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
