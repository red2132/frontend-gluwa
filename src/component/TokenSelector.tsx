import React from 'react';
import { usePayStore, useReceiveStore } from '../store/store';
import { balanceProps } from '../../types';

interface TokenSelectorProps {
  onClose: () => void;
  isPayCurrency: boolean // pay인지 receive인지 체크하는 플래그
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({ onClose, isPayCurrency }) => {
  const { setPayCurrency } = usePayStore();
  const { setReceiveCurrency } = useReceiveStore();

  /** isPayCurrency에 따라 해당하는 값 세팅 */
  const changeCurrency = (selectedCurrency: keyof balanceProps) => {
    isPayCurrency ? setPayCurrency(selectedCurrency) : setReceiveCurrency(selectedCurrency)

  }
  return (
    <section className="layer-wrap">
      <div className="dimmed" onClick={onClose}></div>
      <div className="layer-container">
        <header className="layer-header">
          <div className="inner">
            <h3>Select a token</h3>
            <button type="button" className="button-close" onClick={onClose}>
              <i className="blind">Close</i>
            </button>
          </div>
        </header>
        <div className="layer-content">
          <div className="inner">
            <div className="select-token-wrap">
              <div className="currency-list-wrap">
                <div className="lists">
                  <button type="button" className="currency-label" onClick={() => { changeCurrency("CTC") }}>
                    <div className="token CTC" data-token-size="36"></div>
                    <div className="name">
                      <div className="full">Creditcoin</div>
                      <span>CTC</span>
                    </div>
                  </button>
                  <button type="button" className="currency-label" onClick={() => { changeCurrency("USDC") }}>
                    <div className="token USDC" data-token-size="36"></div>
                    <div className="name">
                      <div className="full">USDCoin</div>
                      <span>USDC</span>
                    </div>
                  </button>
                  <button type="button" className="currency-label" onClick={() => { changeCurrency("USDT") }}>
                    <div className="token USDT" data-token-size="36"></div>
                    <div className="name">
                      <div className="full">Tether USD</div>
                      <span>USDT</span>
                    </div>
                  </button>
                  <button type="button" className="currency-label" onClick={() => { changeCurrency("WCTC") }}>
                    <div className="token WCTC" data-token-size="36"></div>
                    <div className="name">
                      <div className="full">Wrapped CTC</div>
                      <span>WCTC</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
