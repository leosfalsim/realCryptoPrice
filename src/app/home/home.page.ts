import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocketservice.service';
import { Subscription } from 'rxjs';

interface CryptoData {
  symbol: string;
  price: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  cryptos: CryptoData[] = [];
  errorMessage: string = '';
  private websocketSubscription!: Subscription;
  public cryptoNamesMap = new Map<string, string>([
    ['BTCUSDT', 'Bitcoin'],
    ['LTCUSDT', 'Litecoin'],
    ['ETHUSDT', 'Ethereum'],
    ['XRPUSDT', 'XRP Ripple'],
    ['DOGEUSDT', 'Dogecoin'],
    ['ADAUSDT', 'Ada Cardano'],
    ['AVAXUSDT', 'Avalanche'],
    ['SOLUSDT', 'Solana'],
    ['DOTUSDT', 'Polkadot'],
    ['LINKUSDT', 'Chainlink'],
    ['BNBUSDT', 'Binance']
  ]);

  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    this.websocketSubscription = this.websocketService.connectWebSocket().subscribe(
      (data: any) => {
        if (data && data.data) {
          const cryptoData: CryptoData = {
            symbol: data.data.s,
            price: data.data.p
          };

          const existingCryptoIndex = this.cryptos.findIndex(crypto => crypto.symbol === cryptoData.symbol);
          if (existingCryptoIndex !== -1) {
            this.cryptos[existingCryptoIndex].price = cryptoData.price;
          } else {
            this.cryptos.push(cryptoData);
          }

          // Ordenar a lista pelo preço mais alto
          this.cryptos.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else {
          console.error('WebSocket data is not in the expected format:', data);
        }
      },
      error => {
        console.error('WebSocket error:', error);
        this.errorMessage = 'WebSocket connection failed. Please try again later.';
      }
    );
  }

  ngOnDestroy() {
    this.websocketSubscription.unsubscribe();
    this.websocketService.disconnectWebSocket();
  }

  getCryptoName(cryptoName: string): string {
    return this.cryptoNamesMap.get(cryptoName)!;
  }

  getImageUrl(symbol: string): string {
    switch (symbol) {
      case 'BTCUSDT':
        return 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png';
      case 'ETHUSDT':
        return 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png';
      case 'BNBUSDT':
        return 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png';
      case 'SOLUSDT':
        return 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png';
      case 'XRPUSDT':
        return 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png';
      case 'DOGEUSDT':
        return 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png';
      case 'ADAUSDT':
        return 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png';
      case 'AVAXUSDT':
        return 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png';
      case 'LINKUSDT':
        return 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png';
      case 'LTCUSDT':
        return 'https://s2.coinmarketcap.com/static/img/coins/64x64/2.png';
      case 'DOTUSDT':
        return 'https://s2.coinmarketcap.com/static/cloud/img/logo/polkadot/Polkadot_Logo_Animation_32x32.gif';
      default:
        return 'lhttps://p7.hiclipart.com/preview/822/164/28/initial-coin-offering-cryptocurrency-exchange-lion-blockchain-token-png.jpg';
    }
  }
}
