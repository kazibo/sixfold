'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Airports", deps: []
 * createTable "Flights", deps: [Airports, Airports]
 *
 **/

var info = {
    "revision": 1,
    "name": "initial",
    "created": "2021-10-17T23:00:49.086Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "Airports",
            {
                "code": {
                    "type": Sequelize.STRING(3),
                    "field": "code",
                    "primaryKey": true
                },
                "latitude": {
                    "type": Sequelize.FLOAT,
                    "field": "latitude"
                },
                "longitude": {
                    "type": Sequelize.FLOAT,
                    "field": "longitude"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Flights",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "distance": {
                    "type": Sequelize.FLOAT,
                    "field": "distance"
                },
                "ground": {
                    "type": Sequelize.BOOLEAN,
                    "field": "ground",
                    "defaultValue": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                },
                "from": {
                    "type": Sequelize.STRING(3),
                    "field": "from",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Airports",
                        "key": "code"
                    },
                    "allowNull": true
                },
                "to": {
                    "type": Sequelize.STRING(3),
                    "field": "to",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Airports",
                        "key": "code"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
