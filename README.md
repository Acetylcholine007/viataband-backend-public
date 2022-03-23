# Vitaband Backend

## Important Routes for Web Client

- POST /auth/user/signup

  - **Usage:** For health worker user registration
  - **Headers:** None
  - **Request Body:** `{firstname: String, lastname: String, email: String, password: String}`
  - **Response:** `{message: String, data: {userId: String}}`
  - **Query parameters:** None

- POST /auth/user/login

  - **Usage:** For health worker user log in
  - **Headers:** None
  - **Request Body:** `{email: String, password: String}`
  - **Response:** `{message: String, data: {token: String, userId: String}}`
  - **Query parameters:** None

- GET /nodes

  - **Usage:** For retrieving list of Nodes
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** None
  - **Response:** `{message: String, data: {nodes: [{_id: String, patient: Object, nodeSerial: String, createdAt: String, updatedAt: String], totalItems: Number}}`
  - **Query parameters:** `target` and `pageIndex` -- query parameters optional

- POST /nodes

  - **Usage:** For registering new Node, Patient is optional
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `nodeSerial: String, patient: Object}` -- patient is optional
  - **Response:** `{message: String, data: {node: {nodeId: String, nodeSerial: String, patient: Object}}}`
  - **Query parameters:** None

- GET /nodes/:nodeId

  - **Usage:** For getting specific Node
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** None
  - **Response:** `{message: String, data: {node: {_id: String, patient: Object, nodeSerial: String, createdAt: String, updatedAt: String, readings: [Object]}}}`
  - **Query parameters:** `readingLength` and `offset` -- optional

- PUT /nodes/:nodeId
  - **Usage:** For editing node serial or Patient information
  - **Headers:** `{Authorization: Bearer token}`
  - **Request Body:** `{nodeSerial: String, patient: Object}`
  - **Response:** `{message: String, data: {token: String, node: {_id: String, nodeSerial: String, createdAt: String, updatedAt: String, patient: Object}}}`
  - **Query parameters:** None

## Important Routes for Gateway Client

- POST /readings/

  - **Usage:** For transmitting reading snapshot from Node to Server
  - **Headers:** None
  - **Request Body:** `{...readingObject}`
  - **Response:** `{...readingObject}`
  - **Query parameters:** None

## Web Socket

- **Usage:** For real time acquisition of reading snapshots. Use it in NodeViewerPage -- see Notes
- **Channel:** `node`
- **Payload:** `{nodeSerial: String, reading: Object}`

## Notes

- Data structure for Patient<br/>
  `{`<br/>
  ` firstname: String,`<br/>
  ` lastname: String,`<br/>
  ` address: String,`<br/>
  ` age: Number,`<br/>
  ` contactNo: String,`<br/>
  ` isMale: Boolean,`<br/>
  ` latitude: Number,`<br/>
  ` longitude: Number`<br/>
  `}`<br/>

- Data structure for Reading<br/>
  `{`<br/>
  ` source: {nodeSerial: String},`<br/>
  ` temperature: Number,`<br/>
  ` spo2: Number,`<br/>
  ` heartRate: Number,`<br/>
  ` cough: Boolean,`<br/>
  ` lat: Number,`<br/>
  ` lng: Number,`<br/>
  ` datetime: String`<br/>
  ` ir: Number,`<br/>
  ` irBuffer: Array,`<br/>
  ` battery: Number,`<br/>
  `}`<br/>

- Websocket Usage for React<br/>
Install `socket.io-client@4.4.1`<br/>
Import `socket.io-client` in NodeViewerPage and add `useEffect` hook<br/>
Initialize socket object inside useEffect `const socket = io(server URL);`<br/>
Listen to `node` channel and check if nodeSerial of payload matched with the nodeSerial that the NodeViewerPage displays. If matched, update readings state and append the new reading snapshot
