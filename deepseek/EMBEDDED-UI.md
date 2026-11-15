# Embedded ATL in DeepSeek Harness

Version 0.6.13 keeps the ATL sidebar destination and the Open Control Plane action on
the plugin details page. The workspace reopens automatically: select ATL (or the Open
action) and the last project re-attaches without retyping the directory — the same
panel id returns when the control plane is still running, and a control plane that
died while hidden is re-spawned under a fresh id. "Change project" shows remembered
workspaces as one-click chips and forgets the current workspace; other repositories
stay reachable from the Projects page at any time. An unsubmitted new-task draft
survives tab switches and reloads.

Idle snapshot traffic is near zero: the control plane pushes a snapshot only when its
content actually changed, and reconnecting panels receive a tiny liveness block
otherwise (a 1,000-task project idles at bytes instead of megabytes per poll).

The browser contribution declares `dsh.client` and exports `./client` as a prebuilt
DeepSeek module-loader factory. Its host contribution registers exact Fetch routes
on DeepSeek Connection. DeepSeek authenticates those routes and admits only owner
Peers. ATL keeps its own CSRF checks, project validation and approval gates.
The panel gateway permits only the selected loopback ATL origin; asset requests
are restricted to packaged assets. No provider worker starts on opening.

The project and task records stay in the selected application. Unloading ATL stops
its UI servers; reopening a project restores its recorded state.

To update the web profile:

```sh
dsh plugin --profile web add "github:depie99/atl-marketplace#path:deepseek"
```

Restart the Harness and check the installed package version is 0.6.13.
