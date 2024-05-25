import { Injectable } from '@angular/core';
import { Observable, Observer, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private websocket!: WebSocket;
  private websocketUrl = 'wss://fstream.binance.com/stream?streams=';
  private reconnectInterval = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
  private reconnectTimer!: Subscription;

  constructor() { }

  connectWebSocket(): Observable<any> {


    const pairs = ['btcusdt', 'ltcusdt', 'ethusdt', 'xrpusdt', 'dogeusdt', 'adausdt', 'avaxusdt', 'solusdt', 'dotusdt', 'linkusdt', 'bnbusdt'];

    // Adiciona "@markPrice" a cada elemento do array
    const pairsWithMarkPrice = pairs.map(pair => `${pair}@markPrice`);

    // Junta os elementos do array separados por "/"
    const result = pairsWithMarkPrice.join('/');

    console.log(result); // Saída:

    return new Observable((observer: Observer<any>) => {
      this.websocket = new WebSocket(this.websocketUrl + result);

      this.websocket.onopen = (event) => {
        console.log('WebSocket connection established.');
        this.setupReconnectTimer();
      };

      this.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        observer.next(data);
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        observer.error(error);
      };

      this.websocket.onclose = () => {
        console.log('WebSocket connection closed.');
        this.setupReconnectTimer();
        observer.complete();
      };

      return () => {
        console.log('WebSocket connection unsubscribed.');
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
      console.log('Attempting to reconnect WebSocket...');
      this.connectWebSocket().subscribe();
    });
  }
}
