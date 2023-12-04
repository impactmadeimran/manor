CREATE TABLE IF NOT EXISTS "users" (
	"uuid1" uuid DEFAULT gen_random_uuid(),
	"full_name" varchar(256),
	"email" varchar(256)
);
