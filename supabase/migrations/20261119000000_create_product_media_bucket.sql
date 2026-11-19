-- Public bucket for product images and videos uploaded from the admin area.
-- Public buckets are readable by anyone with the object URL; uploads go through
-- the authenticated server route using the service role key. The project-wide
-- Storage file-size limit on Free plans is 50 MB and overrides this bucket limit.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-media',
  'product-media',
  true,
  104857600,
  array[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo'
  ]::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
