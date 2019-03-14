import ConfigWeb3 from './ConfigWeb3';

class Initialization {
    constructor () {
        this.web3Object = null;
    }

    async start () {
        try {
            console.log('Start initialization');
            const configWeb3Object = new ConfigWeb3();
            this.web3Object = await configWeb3Object.getWeb3();
            // Authorize App contract address to call data contract
            await this._authorizeAppContractCaller();
            // Register airline2 and submit fund
            await this._registerAirlines(this.web3Object.airline2, this.web3Object.airline2Name, this.web3Object.airline1);
            await this._submitFundAirline(this.web3Object.airline2, this.web3Object.airline2Name, this.web3Object.submitionFundAirline);
            // Register airline3 and submit fund
            await this._registerAirlines(this.web3Object.airline3, this.web3Object.airline3Name, this.web3Object.airline1);
            await this._submitFundAirline(this.web3Object.airline3, this.web3Object.airline3Name, this.web3Object.submitionFundAirline);
            // Register flight1 under airline2
            await this._registerFlight(
                this.web3Object.airline2, 
                this.web3Object.airline2Name, 
                this.web3Object.flight1Airline2Code, 
                this.web3Object.flight1Airline2CodeDeparture,
                this.web3Object.flight1Airline2CodeArrival);
            // Register flight2 under airline2
            await this._registerFlight(
                this.web3Object.airline2, 
                this.web3Object.airline2Name, 
                this.web3Object.flight2Airline2Code, 
                this.web3Object.flight2Airline2CodeDeparture,
                this.web3Object.flight2Airline2CodeArrival);
            // Register flight1 under airline3
            await this._registerFlight(
                this.web3Object.airline3, 
                this.web3Object.airline3Name, 
                this.web3Object.flight1Airline3Code, 
                this.web3Object.flight1Airline3CodeDeparture,
                this.web3Object.flight1Airline3CodeArrival);
            // Register flight2 under airline3
            await this._registerFlight(
                this.web3Object.airline3, 
                this.web3Object.airline3Name, 
                this.web3Object.flight2Airline3Code, 
                this.web3Object.flight2Airline3CodeDeparture,
                this.web3Object.flight2Airline3CodeArrival);
            // Register oracles
            const fee = await this._getOracleRegistrationFee();
            for (let account of this.web3Object.accounts) {
                await this._registerOracles(account, fee);
            }
            console.log('Server successfully initialize. Waiting for request from client side ...');
        } catch (error) {
            console.log('Ganache network of smart contracts address missmatch. Error: ' + error);
        }
    }

    async _authorizeAppContractCaller () {
        await this.web3Object.flightSuretyDataContract.methods
        .authorizeContractCaller(this.web3Object.flightSuretyAppContractAddress)
        .send({
            from: this.web3Object.owner,
            gas: this.web3Object.gas
        })
        .then((result) =>{
            console.log(`Data contract function ${result.events.AuthorizeContractCaller.event} authorize the app contract address ${result.events.AuthorizeContractCaller.returnValues.authorizedCaller}`);
        })
        .catch((error) =>{
            console.log(`Error by _authorizeAppContractCaller ${error}`);
        });
    }

    async _registerAirlines (airlineAddress, airlineName, airlineOriginAddress) {
        console.log(`Registering airline ${airlineName}`);
        await this.web3Object.flightSuretyAppContract.methods
        .registerAirline(
            airlineAddress,
            airlineName
        )
        .send({
            from: airlineOriginAddress,
            gas: this.web3Object.gas
        })
        .then(result =>{
            //console.log(result);
            console.log(`App contract function ${result.events.AirlineRegistration.event} successfully register new airline ${airlineName}`);
        })
        .catch((error) =>{
            // Uncomment for debugging
            //console.log(`Error by _registerAirlines ${error}`);
            console.log(`Airline ${airlineName} already registered`);
        });
    }

    async _submitFundAirline (airlineAddress, airlineName, fundAmount) {
        console.log(`Submitting fund for airline ${airlineName}`);
        await this.web3Object.flightSuretyAppContract.methods
        .submitFundAirline()
        .send({
            from: airlineAddress,
            value: fundAmount,
            gas: this.web3Object.gas
        })
        .then((result) =>{
            //console.log(result);
            console.log(`App contract function ${result.events.AirlineSubmittedFund.event} successfully submit fund for airline ${airlineName}`);
        })
        .catch((error) =>{
            // Uncomment for debugging
            //console.log(`Error by _submitFundAirline ${error}`);
            console.log(`Airline ${airlineName} already registered`);
        });
    }

    async _registerFlight (airlineAddress, airlineName, flightcode, departure, arrival) {
        const timestamp = Math.floor(Date.now() / 1000);
        console.log(`Submitting fund for airline ${airlineName}`);
        await this.web3Object.flightSuretyAppContract.methods
        .registerFlight(
            this.web3Object.web3.utils.asciiToHex(flightcode),
            timestamp,
            this.web3Object.web3.utils.asciiToHex(departure),
            this.web3Object.web3.utils.asciiToHex(arrival)
        )
        .send({
            from: airlineAddress,
            gas: this.web3Object.gas
        })
        .then((result) =>{
            //console.log(result.events.FlightRegistered.returnValues);
            console.log(`App contract function ${result.events.FlightRegistered.event} successfully register flight ${flightcode} from ${departure} to ${arrival} for airline ${airlineName}`);
        })
        .catch((error) =>{
            // Uncomment for debugging
            //console.log(`Error by _registerFlight ${error}`);
            console.log(`Flight ${flightcode} from ${departure} to ${arrival} already registered for airline ${airlineName}`);
        });
    }

    async _getOracleRegistrationFee () {
        let fee;
        await this.web3Object.flightSuretyAppContract.methods
        .REGISTRATION_FEE
        .call({
            from: this.web3Object.owner
        })
        .then((result) =>{
            //console.log(result);
            fee = result;
        })
        .catch((error) =>{
            // Uncomment for debugging
            //console.log(`Error by _registerFlight ${error}`);
        });
        return fee;
    }

    async _registerOracles (accountAddress, fee) {
        console.log(`Registering oracle account ${accountAddress}`);
        await this.web3Object.flightSuretyAppContract.methods
        .registerOracle(
        )
        .send({
            from: accountAddress,
            value: fee,
            gas: this.web3Object.gas
        })
        .then(async (result) =>{
            //console.log(result);
            await this._fetchOracleIndex(accountAddress);
        })    
        .catch((error) =>{
            // Uncomment for debugging
            console.log(`Error by _registerOracles ${error}`);
        });
    }

    async _fetchOracleIndex(accountAddress) {
        await this.web3Object.flightSuretyAppContract.methods
        .getMyIndexes()
        .call({
            from: accountAddress
        })
        .then((result) =>{
            //console.log(result);
            console.log(`Oracle Registered ${accountAddress} indexes: ${result[0]}, ${result[1]}, ${result[2]}`);
        })
        .catch((error) =>{
            // Uncomment for debugging
            //console.log(`Error by _fetchRegisteredFlightCodes ${error}`);
        });
    }
}

export default Initialization;
