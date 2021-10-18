const db = require('../models')

class FlightsController {
    async getRoute(req, res) {
        const flight_from = req.query.from.toUpperCase();
        const flight_to = req.query.to.toUpperCase();
        if (!(flight_from && flight_to)) {
            res.status(404).send("Please specify parameters 'from' and 'to' in a query.")
        }
        const ap1 = await db.Airport.findOne({
            where: {code: flight_from},
            attributes: ['latitude']
        }).then(lat => lat !== null)
        const ap2 = await db.Airport.findOne({
            where: {code: flight_to},
            attributes: ['latitude']
        }).then(lat => lat !== null)
        if (ap1 && ap2) {
            const path = await djikstra(flight_from, flight_to)
            res.send(path)
        } else {
            res.status(404).send("Airports not found. Check spelling. Airport code should be 3 letter IATA code like 'NYC'")
        }
    }
}

async function djikstra(start, finish) {
    const costs = {};
    costs[start] = 0.1;
    costs[finish] = Infinity;
    const parents = {};
    parents[finish] = null;
    const processed = [];
    const switches = [];
    switches[start] = 0;

    let node = lowestCostNode(costs, processed);
    while (node) {
        let cost = costs[node];
        let children = []
        // console.log(node)
        // console.log(costs[node])
        await db.Flight.findAll(
            {
                attributes: ['from', 'to', 'distance'],
                where: {from: node},
                order: [['distance', 'ASC']]
            }
        ).then(
            results => {
                results.forEach(element => {
                    children[element.getDataValue('to')] = element.getDataValue('distance')
                })
            }
        )
        if (switches[node] < 4) {
            for (let n in children) {
                let newCost = cost + children[n];
                if (!costs[n]) {
                    costs[n] = newCost;
                    parents[n] = node;
                    switches[n] = switches[node] + 1;
                }
                if (costs[n] > newCost) {
                    costs[n] = newCost;
                    parents[n] = node;
                    switches[n] = switches[node] + 1;
                }
            }
        }
        processed.push(node);
        node = lowestCostNode(costs, processed);
        if (finish == node) {
            break;
        }
    }

    let optimalPath = [finish];
    let optimalSwitches = {};
    let parent = parents[finish];
    while (parent) {
        optimalSwitches[parent] = switches[parent];
        optimalPath.push(parent);
        parent = parents[parent];
    }
    optimalPath.reverse();
    return optimalPath.join('->') + " Distance: " + Math.round(costs[finish]) + "km"
}

//cheapest node that hasn't been processed
const lowestCostNode = (costs, processed) => {
    return Object.keys(costs).reduce((lowest, node) => {
        if (lowest === null || costs[node] < costs[lowest]) {
            if (!processed.includes(node)) {
                lowest = node;
            }
        }
        return lowest;
    }, null);
};

module.exports = new FlightsController()
