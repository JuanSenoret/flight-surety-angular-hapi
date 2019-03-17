import ConfigWeb3 from './ConfigWeb3';

class Oracles {
    constructor () {
        this.web3Object = null;
        this.response = {
            data: null,
            error: '',
            message: '',
            code: 200
        };
        this.submitIndexRequest = 0;
        this.timestamp = Math.floor(Date.now() / 1000);
        this.isInformationVerified = false;
    }

    async run(flightCode, status) {
        try {
            // Init the web3 instance
            const configWeb3Object = new ConfigWeb3();
            this.web3Object = await configWeb3Object.getWeb3();
            const flightDetail = await this._fetchFlightDetailByCode(flightCode);
            const isSubmitRequestSuccess = await this._submitOraclesRequest(flightDetail[4], flightCode);
            if (isSubmitRequestSuccess) {
                console.log(`Airline ${flightDetail[1]} Flight code ${flightCode} status ${status}`);
                // Submit response for each registered oracle
                for (let account of this.web3Object.accounts) {
                    await this._submitResponseOracle(account, flightDetail[4], flightCode, status);
                }
                this.response.data = {informationVerified: this.isInformationVerified};
                this.response.code = 200;
            } else {
                this.response.error = error;
                this.response.message = 'Error while submitting oracles request for flight';
                this.response.code = 400;
            }
            
        } catch (error) {
            this.response.error = error;
            this.response.message = 'Error while fetching flights details from smart contract';
            this.response.code = 400;
        }
        return this.response;
    }

    async _fetchFlightDetailByCode(flightCode) {
        console.log(`Fetching flight details by code ${flightCode}`);
        let flightDetails = null;
        await this.web3Object.flightSuretyAppContract.methods
        .fetchFlightInfoByCode(this.web3Object.web3.utils.asciiToHex(flightCode))
        .call({
            from: this.web3Object.owner
        })
        .then((result) =>{
            //console.log(result);
            flightDetails = result;
        })
        .catch((error) =>{
            // Uncomment for debugging
            //console.log(`Error by _fetchFlightDetailByCode ${error}`);
        });
        return flightDetails;
    }

    async _submitOraclesRequest(airlineAddress, flightCode) {
        console.log(`Submiting oracles request flight ${flightCode} time stamp ${this.timestamp}`);
        let isSuccess = false;
        await this.web3Object.flightSuretyAppContract.methods
        .fetchFlightStatus(
            airlineAddress,
            this.web3Object.web3.utils.asciiToHex(flightCode),
            this.timestamp
        )
        .send({
            from: this.web3Object.owner
        })
        .then((result) =>{
            //console.log(result.events.OracleRequest.returnValues.index);
            isSuccess = true;
            this.submitIndexRequest = result.events.OracleRequest.returnValues.index;
        })
        .catch((error) =>{
            // Uncomment for debugging
            //console.log(`Error by _submitOraclesRequest ${error}`);
            isSuccess = false;
        });
        return isSuccess;
    }

    async _submitResponseOracle(account, airlineAddress, flightCode, status) {
        console.log(`Submiting oracles (${account}) response for flight ${flightCode} status ${status} stamp ${this.timestamp}`);
        const oracleIndexes = await this._getOracleIndex(account);
        for (let index of oracleIndexes) {
            await this.web3Object.flightSuretyAppContract.methods
            .submitOracleResponse(
                index,
                airlineAddress,
                this.web3Object.web3.utils.asciiToHex(flightCode),
                this.timestamp,
                Number(status)
            )
            .send({
                from: account
            })
            .then((result) =>{
                if (result.events.OracleReport) {
                    console.log(`SUCCESS: Oracle address ${account} | index: ${index}`);
                    if (result.events.FlightStatusInfo) {
                        console.log(`SUCCESS: Information verified`);
                        this.isInformationVerified = true;
                    }
                }
                // Uncomment for debugging
                //console.log(result);
            })
            .catch((error) =>{
                // Uncomment for debugging
                //console.log(`Error by _submitResponseOracle ${error}`);
                //console.log(`\nIndex Oracle response not match with index request: Oracle address ${account} | index: ${index} request index ${this.submitIndexRequest} | flight ${flightCode}`);
            });
        }
    }

    async _getOracleIndex(account) {
        let oracleIndexes = [];
        await this.web3Object.flightSuretyAppContract.methods
        .getMyIndexes()
        .call({
            from: account
        })
        .then((result) =>{
           // console.log(result);
            oracleIndexes = result;
        })
        .catch((error) =>{
            // Uncomment for debugging
            //console.log(`Error by _fetchFlightDetailByCode ${error}`);
        });
        return oracleIndexes;
    }
}

export default Oracles;
