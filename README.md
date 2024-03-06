# Solid Application Interoperability (TypeScript)

[![CI](https://github.com/janeirodigital/sai-js/actions/workflows/ci.yml/badge.svg)](https://github.com/janeirodigital/sai-js/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/janeirodigital/sai-js/branch/main/graph/badge.svg)](https://codecov.io/gh/janeirodigital/sai-js/tree/main)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/solid/data-interoperability-panel)
[![MIT license](https://img.shields.io/github/license/janeirodigital/sai-js)](https://github.com/janeirodigital/sai-js/blob/main/LICENSE)

Modules implementing [Solid Application Interoperability Specification](https://solid.github.io/data-interoperability-panel/specification/)

## Intended dependents

|                           | package                                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Solid Applications        | [`@janeirodigital/interop-application`](https://github.com/janeirodigital/sai-js/tree/main/packages/application)                 |
| Solid Authorization Agent | [`@janeirodigital/interop-authorization-agent`](https://github.com/janeirodigital/sai-js/tree/main/packages/authorization-agent) |

## Getting Started

### Adding your Solid app to SAI
Most existing Solid apps ask the user to authenticate with Solid OIDC and then expects to get access to the user's storage.
To add such an app to SAI you need to do a number of things.

#### Make sure your app has a client ID Document
The Solid OIDC spec [requires](https://solidproject.org/TR/oidc#clientids-document) Solid apps to have a dereferenceable client ID document.
When running the [development setup](#development) of this repo, you will be able to see the client ID document of [the Vuejectron app](http://localhost:3000)
on [http://localhost:3000/acme/projectron/vue](http://localhost:3000/acme/projectron/vue) [1]. That one looks like this:
```json
{
  "@context": [
    "https://www.w3.org/ns/solid/oidc-context.jsonld",
    {
      "interop": "http://www.w3.org/ns/solid/interop#"
    }
  ]  ,
  "client_id": "http://localhost:3000/acme/projectron/vue",
  "client_name": "Vuejectron",
  "logo_uri": "https://robohash.org/https://vuejectron.example/?set=set3",
  "redirect_uris": ["http://localhost:4500/redirect"],
  "grant_types" : ["refresh_token","authorization_code"],
  "interop:hasAccessNeedGroup": "http://localhost:3000/acme/projectron/access-needs#need-group-pm",
  "interop:hasAuthorizationCallbackEndpoint": "http://localhost:4500"
}
```
See [this PR](https://github.com/jaxoncreed/ldo-react-tutorial-1/pull/4/files#diff-99d5cfc323b4bb19aa60c9d5b031b00ac640c2f140b5b3412ff58b4f11c05fce)
for an example of how to add a Client ID Document to the LDO React Tutorial app.

### Add an Authorize button
Instead of the "Log in with your Web ID" button that we have gotten used to in Solid apps over the years, SAI-enabled apps have an 'Authorize' button.
Your app may want to access the user's pod from the browser and/or from the server. Both need to be authorized, and the app also still needs the proof
of possession for user authentication which Solid-OIDC requires. The user therefore needs to go through two or three dances instead of one:
* authenticate
* authorize frontend
* authorize backend

See https://github.com/janeirodigital/sai-js/tree/main/packages/application for an example.

### Specify the Data Needs of your App
See https://github.com/janeirodigital/sai-js/blob/main/packages/css-storage-fixture/acme/projectron/access-needs%24.ttl for an example

### Register your data in the user's pod
Before a user will be able to use your app, they need to have at least one data registry using your shapetree on their pod. [2]
See https://github.com/janeirodigital/sai-js/blob/main/packages/css-storage-fixture/alice-work/dataRegistry/tasks/.meta for an example.

### Test it
Now you should be able to run your app alongside the development setup of this repo, and try it out!

[1] [FIXME: #78](https://github.com/janeirodigital/sai-js/issues/78)
[2] [FIXME: #80](https://github.com/janeirodigital/sai-js/issues/80)

## Development

### Docker

Default setup assumes `docker` command available, and runs it as non-root user.
It only uses [official redis image](https://hub.docker.com/_/redis) for the authorization agent service.

### Node, corepack and pnpm

Requires node.js 20 or higher with corepack ([Volta](https://volta.sh/) may help with managing node versions).
Uses pnpm as package manager.

```bash
volta install node@20
volta install corepack
corepack prepare pnpm@latest --activate
```

### Github packages

- generate a [classic github token](https://github.com/settings/tokens/new) (tick only `read:packages` scope)
- Modify `~/.npmrc` ([per-user config file](https://docs.npmjs.com/cli/v7/configuring-npm/npmrc#per-user-config-file))
  and add line `//npm.pkg.github.com/:_authToken=` and the generated token.

### Bootstrapping

```bash
pnpm install
pnpm build
pnpm test
pnpm dev
```
In separate terminal

```bash
pnpm watch
```

It will run following:

#### Community Solid Server

Run from [packages/css-solid-fixture](https://github.com/janeirodigital/sai-js/tree/main/packages/css-storage-fixture).
Used for solid storage instances and solid-oidc provider.

Available on http://localhost:3000, default demo account is `alice@acme.example` with `password`.

#### Authorization Agent

##### Service

Run from [packages/service](https://github.com/janeirodigital/sai-js/tree/main/packages/service).
Available on http://localhost:4000 (API only)

##### UI

Run from [ui/authorization](https://github.com/janeirodigital/sai-js/tree/main/ui/authorization).
Available on http://localhost:4200 , requires signing up with UI first and later signing up in with the service (_Connect server_).
Dev config uses local CSS as default provider when input left empty.

#### Demo app (Vujectron)

Run from [examples/vuejectron](https://github.com/janeirodigital/sai-js/tree/main/examples/vuejectron).
Available on http://localhost:4500 , requires signup and authorization.
Dev config uses local CSS as default provider when input left empty.

## Funding

This project is funded through the [NGI Zero Entrust Fund](https://nlnet.nl/entrust), a fund established by [NLnet](https://nlnet.nl) with financial support from the European Commission's [Next Generation Internet](https://ngi.eu) program. Learn more at the [NLnet project page](https://nlnet.nl/project/SolidInterop3).

[<img src="https://nlnet.nl/logo/banner.png" alt="NLnet foundation logo" width="20%" />](https://nlnet.nl)

[<img src="https://nlnet.nl/image/logos/NGI0Entrust_tag.svg" alt="NGI Zero Entrust Logo" width="20%" />](https://nlnet.nl/entrust)
