In order for this to work:
1) Install node + postgresql
2) Create database with superuser
3) Change `config/default.json` and `config/config.json`
4) Run `npx sequelize-cli db:migrate`
5) Run seeders `node seed`
6) `npm run server`

Example:
http://localhost:5000/api/find_flights?from=TLL&to=TVC

Response:`TLL->ARN->ORD->TVC`

Source:
- Documentation of used npm modules
- StackOverflow
- Haversine formula for distance calculation https://www.geeksforgeeks.org/program-distance-two-points-earth/
- Djikstra alghorhytm for route calculation https://hackernoon.com/how-to-implement-dijkstras-algorithm-in-javascript-abdfd1702d04
- https://ourairports.com/data/ for data
