const db = require('./models'),
    csv = require('csv'),
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash')

async function seed() {
    //the problem here is that two imports can run in parallel but in this implementation the second waits for the first
    fs.createReadStream(path.join(__dirname, 'data', 'airports.csv')).pipe(csv.parse({}, function (err, data) {
            db.Airport.bulkCreate(
                _.map(data, function (record, index) {
                    return {
                        'code': record[0],
                        'latitude': record[1],
                        'longitude': record[2]
                    }
                })
            );
        }
    ));

    const R = 6371;
    let lon1, lon2, lat1, lat2, dlon, dlat, a, c;

    fs.createReadStream(path.join(__dirname, 'data', 'flights.csv')).pipe(csv.parse({}, function (err, data) {
            db.Flight.bulkCreate(
                _.map(data, function (record, index) {
                    return {
                        'from': record[0],
                        'to': record[1]
                    }
                })
            ).then(res=>{
                db.Flight.findAll({
                    attributes: ['from', 'to', 'id'],
                    where: {distance: null},
                    include: [
                        {model: db.Airport, as: 'routesFrom', attributes: ['latitude', 'longitude']},
                        {model: db.Airport, as: 'routesTo', attributes: ['latitude', 'longitude']}
                    ]
                }).then(
                    results => {
                        results.forEach(element => {
                            lon1 = element.getDataValue('routesFrom').getDataValue('longitude') * Math.PI / 180;
                            lon2 = element.getDataValue('routesTo').getDataValue('longitude') * Math.PI / 180;
                            lat1 = element.getDataValue('routesFrom').getDataValue('latitude') * Math.PI / 180;
                            lat2 = element.getDataValue('routesTo').getDataValue('latitude') * Math.PI / 180;

                            // Haversine formula
                            dlon = lon2 - lon1;
                            dlat = lat2 - lat1;
                            a = Math.pow(Math.sin(dlat / 2), 2)
                                + Math.cos(lat1) * Math.cos(lat2)
                                * Math.pow(Math.sin(dlon / 2), 2);

                            c = 2 * Math.asin(Math.sqrt(a));

                            db.Flight.update(
                                {distance: c * R},
                                {where: {id: element.getDataValue('id')}}
                            )
                        })
                    }
                )
            });
        }
    ));
}

seed()
