import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    knex.schema.hasTable('TrainingModule').then(function(exists) {
        if (!exists) {
          return knex.schema.createTable('TrainingModule', function(t) {
            t.increments('id').primary();
            t.string('name', 100);
          });
        }
    });

    knex.schema.hasTable('Question').then(function(exists) {
        if (!exists) {
          return knex.schema.createTable('Question', function(t) {
            t.increments('id').primary()
            t.integer('module')
            .references('TrainingModule.id')
            .onDelete('CASCADE') // If module is deleted, delete question as well
            t.enu('questionType', ['MULTIPLE_CHOICE', 'CHECKBOXES'])
            t.text('text')
          });
        }
    });

    knex.schema.hasTable('QuestionOption').then(function(exists) {
        if (!exists) {
          return knex.schema.createTable('QuestionOption', function(t) {
            t.increments('id');
            t.integer('question')
            .references('Question.id')
            .onDelete('CASCADE') // If question is deleted, delete option as well
            t.text('text');
            t.boolean('correct');
          });
        }
    });

}


export async function down(knex: Knex): Promise<void> {

    knex.schema.hasTable('TrainingModule').then(function(exists) {
        if (exists) {
          return knex.schema.dropTable('TrainingModule');
        }
    });

    knex.schema.hasTable('Question').then(function(exists) {
        if (exists) {
          return knex.schema.dropTable('Question');
        }
    });

    knex.schema.hasTable('QuestionOption').then(function(exists) {
        if (exists) {
          return knex.schema.dropTable('QuestionOption');
        }
    });

}

