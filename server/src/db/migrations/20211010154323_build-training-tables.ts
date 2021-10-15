import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    knex.schema.hasTable('TrainingModule').then(function(exists) {
        if (!exists) {
          return knex.schema.createTable('TrainingModule', function(t) {
            t.increments('id');
            t.string('name', 100);
          });
        }
    });

    knex.schema.hasTable('Question').then(function(exists) {
        if (!exists) {
          return knex.schema.createTable('Question', function(t) {
            t.increments('id')
            t.integer('module')
            t.foreign('module').references('id').inTable('TrainingModule')
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
            t.foreign('question').references('id').inTable('Question');
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

