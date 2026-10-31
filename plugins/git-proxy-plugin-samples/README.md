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

### Try it out 

1. Run `npm run build` in this directory and install the package next to GitProxy (see the [plugin documentation](https://git-proxy.finos.org/docs/development/plugins)).
2. Add the plugin to `proxy.config.json`:

```json
{
   "plugins": ["@finos/git-proxy-plugin-samples/externalServiceIntegration"]
}
```

3. Optionally, create an executable `hooks/pre-receive.sh` file relative to the directory where GitProxy is started. Make the hook exit with `0` so that pushes skip the manual approval phase. Combined with the `ExternalServiceIntegration` sample, pushes approved by the DLP are automatically approved, rejected ones are automatically rejected.

```bash
mkdir -p hooks
printf '#!/bin/sh\nexit 0\n' > hooks/pre-receive.sh
chmod +x hooks/pre-receive.sh
```

4. Start GitProxy and make a push. See the `[MockDLP]` and `[ExternalServiceIntegration]` output in the server logs. Mock scans log their result and delay ahead of time so GitProxy behaviour is easier to understand.

## Contributing

Please refer to the [CONTRIBUTING.md](https://git-proxy.finos.org/docs/development/contributing) file for information on how to contribute to the GitProxy project.
