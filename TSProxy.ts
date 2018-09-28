import * as http from "http";
import * as https from "https";
import * as URL from "url";
import * as tshost from "./DstHost";

export class TSProxy {
  constructor( protected dstUrl: tshost.DstHost, protected proxyPort: number ) {
  }

  public start() {
    // Create http server as proxy.
    const proxy: http.Server = http.createServer( (clientReq, clientRes) => {
      // Modify the request from the client.
      clientReq.headers.host = this.dstUrl.host;
      this.requestToServ( clientReq, clientRes );
    });
    // Proxy events handlers
    proxy.on( "error", (err) => {
      console.log(err.message);
      proxy.close();
    });
    proxy.on( "listening", () => {
      console.log( `Proxy started on port ${this.proxyPort}` );
    });
    proxy.on( "close", () => {
      console.log( "Proxy closed" );
    });
    // Proxy run at localhost
    proxy.listen( this.proxyPort );
  }
  // Create request to the destination server, get response and send it to
  // the client
  protected requestToServ(
    clientReq: http.IncomingMessage,
    clientRes: http.ServerResponse ) {

    const serverOptions: http.RequestOptions = {
      headers: clientReq.headers,
      host: this.dstUrl.host,
      method: clientReq.method,
      path: clientReq.url };

    let serverReq: http.ClientRequest;  // Client request to access the distServer.
    // Protocol choice and create request to destination server
    if (this.dstUrl.protocol === "https:") {
      serverReq = https.request( serverOptions );
    } else {
      serverReq = http.request( serverOptions );
    }
    // Redirect server response
    serverReq.on( "response", (serverRes: http.IncomingMessage) => {
      // Check "location" in header
      // and detect redirect
      if (serverRes.headers.location !== undefined) {
        const newUrl: URL.UrlObject = URL.parse( serverRes.headers.location );
        this.dstUrl.protocol = newUrl.protocol;
        this.dstUrl.host = newUrl.host;
        // Recreate request to server
        console.log( `Detect new Location. Redirect to ${this.dstUrl.protocol}//${this.dstUrl.host}` );
        this.requestToServ( clientReq, clientRes );
        return;
      }
      serverRes.on( "data", (data) => {
        // Copy headers from server"s response to client.
        clientRes.writeHead(serverRes.statusCode, serverRes.headers);
        clientRes.write(data);
      });
      serverRes.on( "error", (err) => {
        console.log(err.message);
      });
      serverRes.on( "end", () => {
        clientRes.end();
      });
    });
    // Send request.
    serverReq.end();
  }
}
