import { knex } from "../db/index.js";

const script: string = `
CREATE OR REPLACE FUNCTION clone_schema(source_schema text, dest_schema text) RETURNS void AS
$BODY$
DECLARE 
  objeto text;
  buffer text;
  src_buffer text;
BEGIN
	RAISE NOTICE 'Copying Prod schema to dev';
	EXECUTE 'DROP SCHEMA IF EXISTS ' || dest_schema || ' cascade';
    EXECUTE 'CREATE SCHEMA if not exists ' || dest_schema ;

    FOR objeto IN
        SELECT table_name FROM information_schema.tables WHERE table_schema = source_schema and table_type = 'BASE TABLE'
    LOOP        
        buffer := dest_schema || '."' || objeto || '"';
		src_buffer := source_schema || '."' || objeto ||'"';

    	EXECUTE 'CREATE TABLE ' || buffer || ' (LIKE ' || src_buffer || ' INCLUDING all)';
        EXECUTE 'INSERT INTO ' || buffer || '(SELECT * FROM ' || src_buffer || ')';
    END LOOP;

END;
$BODY$
LANGUAGE plpgsql VOLATILE;

SELECT clone_schema('public','dev');
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
