import Hapi from 'hapi';
import Initialization from './modules/Initialization';
import FetchFlightsDetail from './modules/FetchFlightsDetail';

const server = new Hapi.Server({
    host:'localhost',
    port:5000
});

const init = new Initialization();
init.start();

// Endpoint
server.route( {
    method: 'GET',
    path: '/flightsDetails',
    handler: async ( request, h ) => {
        const fetchFlightsDetail = new FetchFlightsDetail();
        const flightsDetailResponse = await fetchFlightsDetail.getFlightsDetails();
        const response = h.response(flightsDetailResponse);
        response.code(flightsDetailResponse.code);
        response.header('Content-Type', 'application/json; charset=utf-8');
        return response;
    }
} );

server.start((err) => {
    if( err ) {
        // Fancy error handling here
        console.error( 'Error was handled!' );
        console.error( err );
    }
    console.log( `Server started at ${ server.info.uri }`);
});
