# terminalcontrolservices

// All the terminal control services are grouped inside this component
// Terminal control exists out of multiple sub-components: YardView, CargoSystem, MasterData, etc..)

// Each sub-component is imported in the main module and can be accessed using the corresponding public property   
// TerminalControlServices.YardViewServices
// TerminalControlServices.CargoSystemServices
// TerminalControlServices.MasterDataServices

// Each sub-component imports the individual web service components which contain the actual service methods (this is the lowest level)
// TerminalControlServices.YardViewServices.YVObjectServices
// TerminalControlServices.YardViewServices.YVTerminalOccupationServices
// TerminalControlServices.YardViewServices.YVRenderSettingServices

// Example on how to use this service
// TerminalControlServices.YardViewServices.YVObjectServices.GetObjectsByArguments1("607ef0cc-a472-4aeb-8658-390b8dfd52b4", [], [], [], "", false).then((response: { data: any }) => {console.log(response.data);});
// TerminalControlServices.YardViewServices.YVRenderSettingServices.GetRenderSettings("607ef0cc-a472-4aeb-8658-390b8dfd52b4").then((response: { data: any }) => {console.log(response.data);});

## Project setup
```
npm install terminalcontrolservices 
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


