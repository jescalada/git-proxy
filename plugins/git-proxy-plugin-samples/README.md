# GitProxy plugins & samples

GitProxy supports extensibility in the form of plugins. These plugins are specified via [configuration](https://git-proxy.finos.org/docs/category/configuration) as NPM packages or JavaScript code on disk. For each plugin configured, GitProxy will attempt to load each package or file as a standard [Node module](https://nodejs.org/api/modules.html). Plugin authors will create instances of the extension classes exposed by GitProxy and use these objects to implement custom functionality.

For detailed documentation, please refer to the [GitProxy development resources on the project's site](https://git-proxy.finos.org/docs/development/plugins)

## Included plugins

These plugins are maintained by the core GitProxy team. As a future roadmap item, organizations can choose to omit
certain features of GitProxy by simply removing the dependency from a deployed version of the application.

- `git-proxy-plugin-samples`: "hello world" examples of the GitProxy plugin system

## How to integrate external services

Our `ExternalServiceIntegration` plugin (`@finos/git-proxy-plugin-samples/externalServiceIntegration`) shows how to integrate a GitProxy plugin with an external service, and keep the `git push` connection open while waiting for the service to complete. It also demonstrates how to handle client disconnection.

In this example, we're using a mock Data Loss Prevention (DLP) service.

### Components

- `externalServiceIntegration.ts` is the actual `PushActionPlugin`. It sends the diff to the mock DLP service, waits for the verdict, and finally lets the push continue (or blocks it).
  - `submitScan` calls the mock service. Replace this with a call to your actual external service
  - `waitForResult` waits for the result to come back, and also checks for client disconnection via `isClientDisconnected`. Replace the `DlpScan` parameter with the relevant object handle (i.e. a `Job` or `Scan` object) for the actual service

- `mockDlpService.ts` is a fake DLP service. It doesn't depend on GitProxy: it takes each scan and answers it with a random verdict after a random delay. Replace this with a client for your real service.
  - The verdict is randomized and the delay is too: some scans take a few seconds (2-30 seconds) while others take much longer (1-10 minutes).
  - Since the default timeout is 5 minutes, some scans will time out. `ExternalServiceIntegration` handles this in `result.status === 'timeout'`. The push is rejected but the scan continues in the external service. The user is prompted to push again in order to reattach the scan
  - If the DLP approves the scan, the push continues through the remaining chain steps. If rejected, the push is blocked with a random reason from `REJECTION_REASONS`
  - If the client disconnects while waiting, the scan continues and it will be reattached in the next `git push`

Note that `ExternalServiceIntegration` runs in the `AFTER_DIFF` phase of the branch push chain.


## Contributing

Please refer to the [CONTRIBUTING.md](https://git-proxy.finos.org/docs/development/contributing) file for information on how to contribute to the GitProxy project.
