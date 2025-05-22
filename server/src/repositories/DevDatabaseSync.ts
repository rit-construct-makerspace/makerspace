import { knex } from "../db/index.js";

const script: string = `
create or replace function create_table_like(source_table text, new_table text)
returns void language plpgsql
as $$
declare
    rec record;
begin
--	RAISE NOTICE format('Creating table %s', new_table);
--	RAISE NOTICE ('creating table' || source_table || ' to ' || new_table);
    execute format(
        'create table %s (like %s including all)',
        new_table, source_table);
    for rec in
        select oid, conname
        from pg_constraint
        where contype = 'f'
        and conrelid = source_table::regclass
    loop
		RAISE NOTICE 'Cpmstaraint';

        execute format(
            'alter table %s add constraint %s %s',
            new_table,
            replace(rec.conname, source_table, new_table),
            pg_get_constraintdef(rec.oid));
    end loop;
end $$;

create or replace function clone_schema(source_schema text, dest_schema text) RETURNS void AS
$BODY$
declare
  objeto text;
  buffer text;
  src_buffer text;
begin
	raise notice 'Copying Prod schema to dev';
	execute 'DROP SCHEMA IF EXISTS ' || dest_schema || ' cascade';
    execute 'CREATE SCHEMA if not exists ' || dest_schema ;

    for objeto in
        select table_name from information_schema.tables where table_schema = source_schema and table_type = 'BASE TABLE'
    loop
        buffer := dest_schema || '."' || objeto || '"';
		src_buffer := source_schema || '."' || objeto ||'"';

    	perform create_table_like(src_buffer, buffer);
    end loop;
	raise notice 'Finished';

end;
$BODY$
language plpgsql volatile;

select clone_schema('public','dev');
`


export async function copyProdDBToDev() {
    if (process.env.RUN_DATABASE_SYNC_TO_DEV == null || process.env.RUN_DATABASE_SYNC_TO_DEV !== 'true') {
        console.log(`Not syncing DB: RUN_DATABASE_SYNC_TO_DEV=${process.env.RUN_DATABASE_SYNC_TO_DEV}`)
        return;
    }
    console.log("Copying production data to dev");
    try {
        await knex.raw(script);
    } catch (e) {
        console.error(`Failed to sync prod DB to dev: ${e}`);
    }
}
