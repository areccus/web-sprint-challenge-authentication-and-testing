exports.seed = function(knex) {
    return knex('users').insert({
        username: 'foo',
        password: '1234'
    })
}