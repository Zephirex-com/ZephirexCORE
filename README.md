# ZephirexCORE v5.0

Welcome to the repository for **ZephirexCORE v5.0**, our **NodeJS-based automated trading algorithm**. This project is designed to streamline cryptocurrency trading by connecting directly with the Coinbase Advanced Trade API. The algorithm extracts real-time market data, applies trading strategies, and executes trades automatically.

---

## Features

- **Real-Time Data Retrieval**: Fetches live market information for cryptocurrency pairs such as BTC-USD, ETH-BTC, SHIB-USD, and others.
- **Automated Trading**: Implements predefined strategies to execute buy and sell orders.
- **Customizable Strategies**: Configure parameters like trading pairs, order size, and risk tolerance.
- **Secure and Efficient**: Built with robust error handling and secure API integration.
- **Comprehensive Logging**: Tracks trading activity and system performance.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Coinbase Advanced Trade API Key](https://www.coinbase.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/zephirex-com/ZephirexCORE.git
   ```

2. Navigate to the project directory:
   ```bash
   cd ZephirexCORE
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Install the required dependency for API integration:
   ```bash
   npm install tiagosiebler/coinbase-api
   ```

### Configuration

1. Create a `.env` file in the root directory:
   ```env
   ADVANCED_TRADE_CDP_KEY_NAME=organizations/876bc90b-c3ad-4058-baed-d90c941215e8/apiKeys/02cc536f-3bf5-411c-94b6-f5df6ea7277f
   ADVANCED_TRADE_CDP_KEY_PRIVATE=-----BEGIN EC PRIVATE KEY-----
   ```

2. Update the configuration settings in `config.json` as needed:
   ```json
   {
     "tradePair": "BTC-USD",
     "orderSize": 0.01,
     "strategy": "momentum"
   }
   ```

### Running the Application

Start the application with:
```bash
npm start
```

---

## Usage

- **Strategy Management**: Modify the strategy parameters in the configuration file to suit your trading goals.
- **Logging**: Logs are stored in the `logs` directory for monitoring and debugging.
- **Error Handling**: The system captures and logs API errors to prevent disruptions.

---

## Contributing

We welcome contributions to enhance the functionality of this project. Here’s how you can help:

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Disclaimer

This software is provided "as is," without warranty of any kind, express or implied. Trading cryptocurrencies involves significant risk. Use this software at your own risk.

---

## Contact

For questions or feedback, feel free to open an issue or reach out:

- **Email**: info@zephirex.com
- **GitHub Issues**: [Issues Page](https://github.com/yourusername/repository-name/issues)

