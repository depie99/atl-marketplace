# ATL for DeepSeek 0.6.11

ATL now opens inside DeepSeek Harness. Select ATL in the sidebar, or select
Open Control Plane on the plugin details page. Enter the absolute project
directory to use Tasks, Plan Studio and the rest of the workspace in the main
Harness panel. No provider workers start when opening a project.

The update adds a prebuilt `dsh.client` browser contribution and authenticated,
owner-only Connection routes. Requests retain ATL project validation, CSRF checks
and approval gates. The client asset is covered by the release integrity manifest.
It also fixes plugin navigation icon size and theme-aware file controls.

Verified on DeepSeek Harness 0.2.2-rc.1 with Node.js 24:

- Actual sidebar entry opens the embedded Control Plane.
- Actual plugin details Open action opens the same panel.
- Plan Studio renders and accepts an objective in the embedded frame.
- A task created in the actual Harness panel persists in ATL project state.
- Unauthenticated requests to the new host API are refused.
- No browser page errors during these paths.

The extracted installable archive also passed the browser contract fixture at
480px and 1280px, including navigation, task persistence, host theme synchronization,
expired panel rejection and rejection of external request paths. Other DeepSeek
releases and unattended provider execution were not exercised in this release check.

Update the web profile, then restart the Harness:

```sh
dsh plugin --profile web add "github:depie99/atl-marketplace#path:deepseek"
```

Check that Plugins shows `@depie99/atl-plugin` version 0.6.11. The other harness
bundles remain at 0.6.10. To roll back DeepSeek, reinstall the `deepseek` package
from the preceding marketplace commit. Project state stays in the application.
