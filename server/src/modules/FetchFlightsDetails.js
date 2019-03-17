import ConfigWeb3 from './ConfigWeb3';

class FetchFlightsDetail {
    constructor () {
        this.web3Object = null;
        this.response = {
            data: null,
            error: '',
            message: '',
            code: 200
        };
    }

    async getFlightsDetails() {
        try {
            // Init the web3 instance
            const configWeb3Object = new ConfigWeb3();
            this.web3Object = await configWeb3Object.getWeb3();
            const flightsDetails = [];
            // Fetch registered flight codes
            const registeredFlightcodes = await this._fetchRegisteredFlightCodes();
            if(registeredFlightcodes) {
                if(registeredFlightcodes.length > 0) {
                    //console.log(registeredFlightcodes);
                    for (let item of registeredFlightcodes) {
                        const flightDetails = await this._fetchFlightDetailByCode(item);
                        flightsDetails.push({
                            flightCode: this.web3Object.web3.utils.toUtf8(flightDetails[0]),
                            airlineName: flightDetails[1],
                            departure: this.web3Object.web3.utils.toUtf8(flightDetails[2]),
                            arrival: this.web3Object.web3.utils.toUtf8(flightDetails[3])
                        });
                    }
                    this.response.data = flightsDetails;
                } else {
                    this.response.data = [];
                    this.response.message = 'No flights registered in smart contract';
                }
                this.response.code = 200;
            } else {
                this.response.message = 'Error while fetching flights details from smart contract';
                this.response.code = 400;
            }
        } catch (error) {
            this.response.error = error;
            this.response.message = 'Error while fetching flights details from smart contract';
            this.response.code = 400;
        }
        return this.response;
    }

    async _fetchRegisteredFlightCodes() {
        console.log(`Fetching flight codes`);
        let flightCodes = null;
        await this.web3Object.flightSuretyAppContract.methods
        .fetchFlightsCodes()
        .call({
            from: this.web3Object.owner
        })
        .then((result) =>{
            //console.log(result);
            flightCodes = result;
        })
        .catch((error) =>{
            // Uncomment for debugging
            //console.log(`Error by _fetchRegisteredFlightCodes ${error}`);
        });
        return flightCodes;
    }

    async _fetchFlightDetailByCode(flightCode) {
        console.log(`Fetching flight details by code${this.web3Object.web3.utils.toUtf8(flightCode)}`);
        let flightDetails = null;
        await this.web3Object.flightSuretyAppContract.methods
        .fetchFlightInfoByCode(flightCode)
        .call({
            from: this.web3Object.owner
        })
        .then((result) =>{
            console.log(result);
            flightDetails = result;
        })
        .catch((error) =>{
            // Uncomment for debugging
            console.log(`Error by _fetchFlightDetailByCode ${error}`);
        });
        return flightDetails;
    }
}

export default FetchFlightsDetail;
