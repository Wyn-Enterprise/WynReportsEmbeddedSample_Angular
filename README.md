# WynReportsEmbeddedSample_Angular

This sample demonstrates the use of GrapeCity Wyn Reports Designer & Viewer connected to the Wyn portal.

## System requirements

This sample requires:
 * [Node.js](https://nodejs.org/en/download/) 10.14.0 or newer
 * [Wyn Enterprise](https://wyn.grapecity.com/demos/request/trial) 5.0.00236.0 or newer
## Build and run the sample

### Description

We download the given packages and update reporting sample packages. After we compile the sample and run it.

### Steps

1. Execute `run-npm.cmd`
2. Open http://localhost:3000 by browser

or manually npm

1. Open cmd.exe and go to the root of the directory WynDesignerSample
2. Enter `npm install`
3. Enter `npm update @grapecity/wyn-report-viewer --latest`
4. Enter `npm update @grapecity/wyn-report-designer --latest`
5. Enter `npm run dev`
6. Open http://localhost:3000 by browser

### Wyn Enterprise System Configurations for API usage
1. In the Administrator Portal after installing Wyn Enterprise, open the System Configuration Page. 
2. Set http://localhost:3000 (or the host application URL) in the "Allowed CORS Origins" section. 
3. Set 'content-disposition' and 'location' in the "Exposed Headers" section. 

After configuration, the System configuration page should look like the image below: 
![](WynEnterprise-SystemConfigPage.png)

### About semantic versioning

package.json
```
"package-name": "~x.y.z"
```

- x - major releases
- y - minor releases
- z - patch releases
- ~ - updating packages as instructed will update to the latest patch

### Documentation

- [Developer Documentation](https://wyn.grapecity.com/docs/dev-docs/)
- [Embedding Wyn Report Viewer and Designer Using Div Tags](https://wyn.grapecity.com/docs/dev-docs/Embedding-Wyn/Embedding-Designer-Viewer-Using-Div)
