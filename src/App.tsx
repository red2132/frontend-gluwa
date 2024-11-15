import './style/index.scss';
import React, { useEffect, useState } from 'react';
import { TokenSelector } from './component/TokenSelector';
import { balanceProps } from '../types';
import { usePayStore, useReceiveStore } from './store/store';

const Main: React.FC = () => {
  //토글 관련
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  /** 토글 오픈 함수(어떤 토글인지 알려주는 flag 값도 포함) */
  const toggleTokenSelectorOpen = (selectedPayCurrency: boolean) => {
    setIsTokenSelectorOpen(!isTokenSelectorOpen)
    setIsPayCurrency(selectedPayCurrency)
  };

  // 현재 잔액
  const [nowBalance, setNowBalance] = useState<balanceProps>({
    CTC: 0,
    USDC: 0,
    USDT: 0,
    WCTC: 0
  });

  // 현재 통화 가치
  const [valueofCurrency, setValueofCurrency] = useState<balanceProps>({
    CTC: 0,
    USDC: 0,
    USDT: 0,
    WCTC: 0
  });
  const [inputBalance, setInputBalance] = useState("0"); // 입력 금액
  const [isPayCurrency, setIsPayCurrency] = useState(false); // pay인지 receive인지 체크하는 플래그
  const [receiveBalance, setReceiveBalance] = useState(0); // receive 금액

  //(통화 - zustand로 상태 관리)
  const { payCurrency, setPayCurrency } = usePayStore();
  const { receiveCurrency, setReceiveCurrency } = useReceiveStore();

  /** 현재 잔고 확인 */
  const getNowBalance = async () => {
    const response = await fetch(`https://inhousedashboard-test-app.azurewebsites.net/api/Interview/get-balance`);

    // 정상 호출시 데이터 세팅
    if (response.ok) {
      const data = await response.json();
      setNowBalance({
        CTC: Number(data.CTC),
        USDC: Number(data.USDC),
        USDT: Number(data.USDT),
        WCTC: Number(data.WCTC)
      })
    } else {
      console.error('Failed to fetch data:', response.status);
    }
  }

  /** 잔액 비교 함수 */
  const diffbalance = () => {
    return (Number(inputBalance) < nowBalance[payCurrency]) ? false : true;
  }
  // 입력 금액이 잔액보다 많을 경우, 버튼 disable하는 flag
  const isBalanceValid = diffbalance();

  /** 통화 교환 함수(화살표 버튼 클릭 시) */
  const swapCurrency = () => {
    if (receiveCurrency === 'Select token') {
      // currency를 입력하지 않았을 경우 경고창 출력 및 함수 종료
      alert("please select currency!!")
      return
    }
    const temp = payCurrency;
    setPayCurrency(receiveCurrency)
    setReceiveCurrency(temp);
  }

  /** 받을 금액 표기 */
  const displayReceive = async () => {
    // 통화가 선택되고, inputBalance가 0이상(금액 입력) 됐을 경우 받을 금액 표기
    if (!(receiveCurrency === 'Select token') && Number(inputBalance) > 0) {
      const response = await fetch(`https://inhousedashboard-test-app.azurewebsites.net/api/Interview/get-price`);

      // 정상 호출시 데이터 세팅
      if (response.ok) {
        const data = await response.json();
        // 통화 가치 세팅
        await setValueofCurrency({
          CTC: Number(data.CTC),
          USDC: Number(data.USDC),
          USDT: Number(data.USDT),
          WCTC: Number(data.WCTC)
        })

        // 계산한 금액 세팅
        await setReceiveBalance((Number(inputBalance) * valueofCurrency[payCurrency]) / valueofCurrency[receiveCurrency])
      } else {
        console.error('Failed to fetch data:', response.status);
      }
    }
  }

  /** post api 호출 함수 */
  const callPostApi = async () => {

    try {
      const response = await fetch(`https://inhousedashboard-test-app.azurewebsites.net/api/Interview/post-swap`, {
        method: 'POST', // HTTP 메서드
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // 서버 응답 데이터 처리
      console.log('Response:', result);
      return result;
    } catch (error) {
      console.error('Error sending data:', error);
      throw error;
    }
  }

  // 첫 로딩 시 잔액 세팅
  useEffect(() => {
    getNowBalance()
  }, [])

  // 인풋값이 변경될 때마다 잔액 비교
  useEffect(() => {
    diffbalance()
  }, [inputBalance])

  // 인풋값, 통화가 변경될 때마다 계산
  useEffect(() => {
    displayReceive()
  }, [inputBalance, payCurrency, receiveCurrency])

  return (
    <>
      <div>
        <section className="page swap-page">
          <div className="box-content">
            <div className="heading">
              <h2>Swap</h2>
            </div>

            <div className="swap-dashboard">
              <div className="swap-item active">
                <div className="title">
                  <h3>You pay</h3>
                </div>

                <div className="amount-input">
                  <div className="input">
                    <input
                      type="number"
                      value={inputBalance}
                      onChange={(e) => {
                        setInputBalance(e.target.value)
                      }}
                    />
                  </div>
                  <button type="button" className="currency-label" onClick={() => toggleTokenSelectorOpen(true)}>
                    <div className={`token ${payCurrency}`} data-token-size="28"></div>
                    <strong className="name">{payCurrency}</strong>
                  </button>

                </div>

                <div className="amount item-flex">
                  <div className="lt">
                  </div>
                  <div className="rt">
                    <div className="balance">
                      <span>Balance: {new Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 10,
                      }).format(nowBalance[payCurrency])} {payCurrency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" className="mark" onClick={() => { swapCurrency() }} >
                <i className="blind">swap</i>
              </button>

              <div className="swap-item">
                <div className="title">
                  <h3>You receive</h3>
                </div>

                <div className="amount-input">
                  <div className="input">
                    <input type="number" value={receiveBalance.toString()} readOnly />
                  </div>
                  {receiveCurrency === 'Select token' ? (
                    <button type="button" className="currency-label select" onClick={() => toggleTokenSelectorOpen(false)}>
                      {receiveCurrency}
                    </button>
                  ) : (<button type="button" className="currency-label" onClick={() => toggleTokenSelectorOpen(false)}>
                    <div className={`token ${receiveCurrency}`} data-token-size="28"></div>
                    <strong className="name">{receiveCurrency}</strong>
                  </button>)}
                </div>
                <div className="item-flex amount">
                  <div className="rt">
                    <div className="balance">
                      <span>{receiveCurrency === 'Select token' ? 'token not selected' : 'Balance: ' + new Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 10,
                      }).format(nowBalance[payCurrency] - Number(inputBalance)) + " " + payCurrency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="button-wrap">
                <button type="button" className="normal" disabled={isBalanceValid} onClick={() => callPostApi()}>
                  Swap
                </button>
              </div>

            </div>
          </div>
        </section>
      </div>

      {isTokenSelectorOpen && (
        <TokenSelector onClose={() => setIsTokenSelectorOpen(false)} isPayCurrency={isPayCurrency} />
      )}
    </>
  );
}

export { Main as default };
