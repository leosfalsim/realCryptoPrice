import { Injectable } from '@angular/core';
import { Observable, Observer, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private websocket!: WebSocket;
  private websocketUrl = 'wss://fstream.binance.com/stream?streams=';
  private reconnectInterval = 24 * 60 * 60 * 1000;
  private reconnectTimer!: Subscription;

  constructor() { }

  connectWebSocket(): Observable<any> {

    const pairs = ['btcusdt', 'ltcusdt', 'ethusdt', 'xrpusdt', 'dogeusdt', 'adausdt', 'avaxusdt', 'solusdt', 'dotusdt', 'linkusdt', 'bnbusdt'];

    const pairsWithMarkPrice = pairs.map(pair => `${pair}@markPrice`);

    const result = pairsWithMarkPrice.join('/');

    return new Observable((observer: Observer<any>) => {
      this.websocket = new WebSocket(this.websocketUrl + result);

      this.websocket.onopen = (event) => {
        this.setupReconnectTimer();
      };

      this.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        observer.next(data);
      };

      this.websocket.onerror = (error) => {
        observer.error(error);
      };

      this.websocket.onclose = () => {
        this.setupReconnectTimer();
        observer.complete();
      };

      return () => {
        this.websocket.close();
      };
    });
  }

  disconnectWebSocket() {
    if (this.websocket) {
      this.websocket.close();
    }
    if (this.reconnectTimer) {
      this.reconnectTimer.unsubscribe();
    }
  }

  private setupReconnectTimer() {
    this.reconnectTimer = interval(this.reconnectInterval).subscribe(() => {
      this.connectWebSocket().subscribe();
    });
  }
}
