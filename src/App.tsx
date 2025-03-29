import "./App.css";
import ModalWindow from "./components/ModalWindow";
import { useState, useEffect } from "react";
import myImage from "./assets/money-svgrepo-com.svg";

function App() {
  const [tokens, setTokens] = useState<{ [key: string]: string }>({});
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const [changeToken, setChangeToken] = useState<{
    [key: string]: { priceChange: string; priceChangePercent: string };
  }>({});

  useEffect(() => {
    const savedTokens = localStorage.getItem("tokens");
    if (savedTokens) setTokens(JSON.parse(savedTokens));
  }, []);

  useEffect(() => {
    const tokenList = ["btc", "eth", "bnb", "bcc", "neo", "ltc", "xrp", "etc"];

    const wsPrice = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${
        tokenList.join("usdt@trade/") + "usdt@trade"
      }`
    );

    const wsChange = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${
        tokenList.join("usdt@ticker/") + "usdt@ticker"
      }`
    );

    wsPrice.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const tokenName = data.stream.split("usdt@trade")[0].toUpperCase();
      setPrices((prev) => ({ ...prev, [tokenName]: data.data.p }));
    };

    wsChange.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const tokenName = data.stream.split("usdt@ticker")[0].toUpperCase();
      setChangeToken((prev) => ({
        ...prev,
        [tokenName]: {
          priceChange: data.data.p,
          priceChangePercent: data.data.P,
        },
      }));
    };

    return () => {
      wsPrice.close();
      wsChange.close();
    };
  }, []);

  const handleTokenChange = (token: string, value: string) => {
    setTokens((prev) => ({ ...prev, [token]: value }));
  };

  const saveToLocalStorage = () => {
    localStorage.setItem("tokens", JSON.stringify(tokens));
  };

  const removeToken = (tokenToRemove: string) => {
    const newTokens = { ...tokens };
    delete newTokens[tokenToRemove];
    setTokens(newTokens);
    localStorage.setItem("tokens", JSON.stringify(newTokens));
  };

  const calculatePortfolioPercentage = (token: string) => {
    if (!prices[token] || !tokens[token]) return "0.00";

    const totalValue = Object.entries(tokens).reduce((sum, [key, val]) => {
      return sum + parseFloat(val) * parseFloat(prices[key] || "0");
    }, 0);

    if (totalValue === 0) return "0.00";

    const tokenValue = parseFloat(tokens[token]) * parseFloat(prices[token]);
    return ((tokenValue / totalValue) * 100).toFixed(2);
  };

  return (
    <>
      <div className="container">
        <div className="container__title">
          <img src={myImage} alt="" className="container__image" />
        </div>
        <ModalWindow
          prices={prices}
          tokens={tokens}
          onTokenChange={handleTokenChange}
          onSave={saveToLocalStorage}
        />
        <div className="container__table-active-token">
          <table className="container__table">
            <thead>
              <tr className="head-table">
                <th>Актив</th>
                <th>Количество</th>
                <th>Цена</th>
                <th>Общая стоимость</th>
                <th>Изм. за 24ч.</th>
                <th>% портфеля</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tokens).map(([key, val]) => (
                <tr
                  key={key}
                  onClick={() => removeToken(key)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{key}</td>
                  <td>{val}</td>
                  <td>{parseFloat(prices[key] || "0").toFixed(2)}</td>
                  <td>
                    {(
                      parseFloat(tokens[key]) * parseFloat(prices[key] || "0")
                    ).toFixed(2)}
                  </td>
                  <td>
                    {changeToken[key] ? (
                      <>
                        <div
                          className={
                            parseFloat(changeToken[key].priceChange) >= 0
                              ? "positive-change"
                              : "negative-change"
                          }
                        >
                          {parseFloat(changeToken[key].priceChange).toFixed(2)}{" "}
                          $
                        </div>
                        <div
                          className={
                            parseFloat(changeToken[key].priceChangePercent) >= 0
                              ? "positive-change"
                              : "negative-change"
                          }
                        >
                          (
                          {parseFloat(
                            changeToken[key].priceChangePercent
                          ).toFixed(2)}
                          %)
                        </div>
                      </>
                    ) : (
                      "Загрузка..."
                    )}
                  </td>
                  <td>{calculatePortfolioPercentage(key)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
