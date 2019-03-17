import Hapi from 'hapi';
import Initialization from './modules/Initialization';
import FetchFlightsDetails from './modules/FetchFlightsDetails';
import Oracles from './modules/Oracles';

const server = new Hapi.Server({
    host:'localhost',
    port:5000,
    routes: { 
        cors: true
    }
});

const init = new Initialization();
init.start();

// Endpoint fetch registered flights details
server.route({
    method: 'GET',
    path: '/flightsDetails',
    handler: async (request, h) => {
        const fetchFlightsDetails = new FetchFlightsDetails();
        const flightsDetailResponse = await fetchFlightsDetails.getFlightsDetails();
        const response = h.response(flightsDetailResponse);
        response.code(flightsDetailResponse.code);
        response.header('Content-Type', 'application/json; charset=utf-8');
        return response;
    }
});

// Endpoint fetch registered insurances details by passenger
server.route({
    method: 'GET',
    path: '/oracles-trigger:{flightCode},{status}',
    handler: async (request, h) => {
        const oracles = new Oracles();
        const oraclesResponse = await oracles.run(request.params.flightCode, request.params.status);
        const response = h.response(oraclesResponse);
        response.code(oraclesResponse.code);
        response.header('Content-Type', 'application/json; charset=utf-8');
        return response;
    }
});

server.start((err) => {
    if( err ) {
        // Fancy error handling here
        console.error( 'Error was handled!' );
        console.error( err );
    }
    console.log( `Server started at ${ server.info.uri }`);
});
