# Node.js — HubSpot CRM Integration Technical Test

Modular Node.js application designed to interact with the HubSpot CRM API, performing CRUD operations on Contacts and Deals, handling associations, and implementing robust error management with automatic retries for rate limits (`429`) and server errors (`5xx`).

## Project Structure & Architecture

The project is structured following a strict separation of concerns across different layers:

* `src/config/`: Environment variables validation.
* `src/clients/`: Centralized HTTP client using Axios configured with custom timeouts.
* `src/repositories/`: Data-access abstraction layer handling direct calls to HubSpot endpoints for Contacts and Deals.
* `src/services/`: Business logic orchestrator handling entity synchronization and object associations.
* `src/utils/`: Shared utilities including payload validation, safe error logging, and Node.js streams.
* `src/fundamentals/`: Demonstrations of core Node.js concepts (callbacks, async/await, CommonJS modules).
* `src/examples/`: Executable scripts to test core HubSpot operations via CLI.

## Prerequisites & Installation

1. Clone the repository or extract the ZIP file.

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables by copying `.env.example` to `.env`:

```bash
cp .env.example .env
```

4. Configure your private app token in the `.env` file:

```env
HUBSPOT_ACCESS_TOKEN=your_private_app_token_here
HUBSPOT_PIPELINE_ID=default
HUBSPOT_STAGE_ID=appointmentscheduled
```

## HubSpot Private App Configuration & Scopes

To run this project against your own HubSpot portal, create a Private App in your HubSpot developer account with the following scopes:

* `crm.objects.contacts.read`
* `crm.objects.contacts.write`
* `crm.objects.deals.read`
* `crm.objects.deals.write`

## Handling HubSpot API Scope Restrictions

During the Private App configuration in the HubSpot developer portal, the platform restricted the assignment of CRM read and write scopes (`crm.objects.contacts.read`, `crm.objects.contacts.write`, `crm.objects.deals.read`, `crm.objects.deals.write`), returning the following platform-level security restriction:

> `You are not authorized to add this scope. Ask a super admin for help.`

### Mitigation and Architecture Approach

* **Graceful Error Handling:** The error management layer (`utils/handleErrors.js`) specifically intercepts HTTP `403` and `401` status codes. Instead of an unhandled crash, the system catches authorization failures and logs a clear message regarding token permission limits.
* **Local Payload Validation:** Thanks to the separation of concerns, data integrity is verified locally (`validateContact` and `validateDeal`) before network requests are dispatched, ensuring payloads are correctly formatted even if rejected by account-tier security policies.
* **Resilient Sync Pipeline:** The bulk synchronization logic is fully structured to evaluate and process local datasets, ensuring that code architecture remains robust and production-ready once adequate portal permissions are granted.

## Official Endpoints Used

### Contacts API

```text
GET    /crm/v3/objects/contacts
POST   /crm/v3/objects/contacts
PATCH  /crm/v3/objects/contacts/{contactId}
DELETE /crm/v3/objects/contacts/{contactId}
```

### Deals API

```text
GET    /crm/v3/objects/deals
POST   /crm/v3/objects/deals
PATCH  /crm/v3/objects/deals/{dealId}
DELETE /crm/v3/objects/deals/{dealId}
```

### Associations API

```text
PUT /crm/v4/objects/contacts/{contactId}/associations/deals/{dealId}
```

## Running Examples

### Test  connection

```bash
node src/examples/test-connection.js
```

### Create contact

```bash
node src/examples/create-contact.js
```

### List contacts

```bash
node src/examples/list-contacts.js
```

### Create a deal

```bash
node src/examples/create-deal.js
```

### Sync local data

```bash
node src/examples/sync-data.js
```

### Test Node.js Streams

```bash
node -e "require('./src/utils/streams').runStreamExample()"
```

## Project Directory Tree

```text
my-hubspot-test/
├── .env.example
├── package.json
├── README.md
└── src/
    ├── config/
    │   └── env.js                 # Environment variables validation
    ├── clients/
    │   └── hubSpotClient.js       # Centralized HTTP client (Axios + 429/retry interceptors)
    ├── repositories/
    │   ├── contactRepository.js   # CRUD abstraction for Contacts
    │   └── dealRepository.js      # CRUD abstraction for Deals
    ├── services/
    │   └── hubSpotService.js      # Business logic orchestrator (sync, associations, main logic)
    ├── utils/
    │   ├── handleErrors.js        # Error normalization, safe logging, and backoff
    │   ├── validator.js            # Payload validation before sending
    │   └── streams.js              # Node.js Streams (Required in Section 1)
    ├── fundamentals/              # Section 1: Node.js Fundamentals
    │   ├── callbacks.js
    │   ├── asyncAwait.js
    │   ├── utils_module.js
    │   └── main.js
    └── examples/                  # Executable scripts (Section 2)
        ├── create-contact.js
        ├── list-contacts.js
        ├── create-deal.js
        └── sync-data.js
```


## What You Can Work On Before Receiving the Token

The code and documentation are already structured. The main remaining step is to perform real API tests against HubSpot once the required scopes and access token are available.

In the meantime, you can verify the project structure, environment configuration, validation, error handling, and example scripts.

### `.env.example`

Make sure the project root contains a clean `.env.example` file that can be used as a configuration reference:

```env
HUBSPOT_ACCESS_TOKEN=your_token_here
HUBSPOT_PIPELINE_ID=default
HUBSPOT_STAGE_ID=appointmentscheduled
```

> **Note:** Do not commit your actual `.env` file or private HubSpot access token to the repository. Only commit `.env.example`.