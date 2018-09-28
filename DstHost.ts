import * as URL from "url";

export class DstHost {
  private _host: string;
  private _protocol: string;
  constructor( hostName: string ) {
    // Parse URL and get both hostname and protocol
    const url: URL.UrlObject = URL.parse( hostName );
    url.host === null ? this._host = hostName : this._host = url.host;
    url.protocol === null ? this._protocol = "http:" : this._protocol = url.protocol;
  }

  get host(): string {
    return this._host;
  }

  set host( newHost: string ) {
    this._host = newHost;
  }

  get protocol(): string {
    return this._protocol;
  }

  set protocol( newProtocol: string ) {
    this._protocol = newProtocol;
  }
}
